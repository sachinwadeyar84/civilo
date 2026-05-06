/**
 * Vendor routes: /api/vendors
 *
 * GET    /                  — list vendors near customer (filter by category, location)
 * GET    /:id               — single vendor profile (public)
 * POST   /profile           — create/update own vendor profile (vendor only)
 * POST   /services          — add a service offering (vendor only)
 */

const express = require('express');
const Joi = require('joi');
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const CATEGORIES = [
  'interior_designer', 'civil_engineer', 'land_developer',
  'contractor', 'renovation_expert',
  'painter', 'plumber', 'electrician',
];

// ── GET /api/vendors — discovery ───────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { category, lat, lng, radius = 10, sort = 'rating' } = req.query;
    const params = [];
    const filters = ["vp.kyc_status = 'approved'"];

    if (category && CATEGORIES.includes(category)) {
      params.push(category);
      filters.push('vp.category = $' + params.length);
    }

    // Distance filter — proper Haversine. Compute distance_km, then (if lat/lng given)
    // restrict results to vendors within `radius` km of the customer.
    let distanceSelect = '';
    let havingClause = '';
    if (lat && lng) {
      params.push(Number(lat), Number(lng));
      const latIdx = params.length - 1;
      const lngIdx = params.length;
      distanceSelect = ',\n        (6371 * acos(\n' +
        '          cos(radians($' + latIdx + ')) * cos(radians(vp.lat)) *\n' +
        '          cos(radians(vp.lng) - radians($' + lngIdx + ')) +\n' +
        '          sin(radians($' + latIdx + ')) * sin(radians(vp.lat))\n' +
        '        )) AS distance_km';

      params.push(Number(radius));
      havingClause = 'AND distance_km <= $' + params.length;
    }

    const orderBy = sort === 'price'
      ? 'min_price ASC NULLS LAST'
      : sort === 'distance' && lat && lng
        ? 'distance_km ASC'
        : 'rating_avg DESC NULLS LAST';

    // Subquery wrapper so the outer WHERE can reference the computed distance_km column
    const sql = 'SELECT * FROM (\n' +
      '  SELECT vp.id, vp.business_name, vp.bio, vp.category,\n' +
      '         vp.experience_years, vp.rating_avg, vp.rating_count,\n' +
      '         vp.cover_photo_url, vp.lat, vp.lng,\n' +
      '         (SELECT MIN(price_per_unit) FROM services WHERE vendor_id = vp.id AND is_active) AS min_price\n' +
      '         ' + distanceSelect + '\n' +
      '  FROM vendor_profiles vp\n' +
      '  WHERE ' + filters.join(' AND ') + '\n' +
      ') v\n' +
      'WHERE 1=1 ' + havingClause + '\n' +
      'ORDER BY ' + orderBy + '\n' +
      'LIMIT 50';

    const { rows } = await db.query(sql, params);
    res.json({ vendors: rows });
  } catch (err) { next(err); }
});

// ── GET /api/vendors/:id — profile detail ──────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const vendorQ = await db.query(
      'SELECT vp.*, u.name AS owner_name FROM vendor_profiles vp JOIN users u ON u.id = vp.user_id WHERE vp.id = $1',
      [req.params.id]
    );
    if (!vendorQ.rows.length) return res.status(404).json({ error: 'Vendor not found' });

    const servicesQ = await db.query(
      'SELECT id, title, description, unit, price_per_unit FROM services WHERE vendor_id = $1 AND is_active = true',
      [req.params.id]
    );

    const reviewsQ = await db.query(
      'SELECT r.id, r.rating, r.comment, r.photo_urls, r.created_at, u.name AS customer_name FROM reviews r JOIN users u ON u.id = r.customer_id WHERE r.vendor_id = $1 ORDER BY r.created_at DESC LIMIT 20',
      [req.params.id]
    );

    res.json({ vendor: vendorQ.rows[0], services: servicesQ.rows, reviews: reviewsQ.rows });
  } catch (err) { next(err); }
});

// ── POST /api/vendors/profile — create or update ───────────
const profileSchema = Joi.object({
  businessName: Joi.string().min(2).max(120).required(),
  bio: Joi.string().max(2000).allow(''),
  category: Joi.string().valid(...CATEGORIES).required(),
  experienceYears: Joi.number().integer().min(0).max(60).required(),
  serviceAreaKm: Joi.number().min(1).max(100).default(10),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  coverPhotoUrl: Joi.string().uri().optional(),
});

router.post('/profile', authenticate, requireRole('vendor'), async (req, res, next) => {
  try {
    const { error, value } = profileSchema.validate(req.body);
    if (error) throw error;

    const existing = await db.query('SELECT id FROM vendor_profiles WHERE user_id = $1', [req.user.id]);

    if (existing.rows.length) {
      const { rows } = await db.query(
        'UPDATE vendor_profiles SET business_name = $1, bio = $2, category = $3, experience_years = $4, service_area_km = $5, lat = $6, lng = $7, cover_photo_url = $8 WHERE user_id = $9 RETURNING *',
        [value.businessName, value.bio, value.category, value.experienceYears, value.serviceAreaKm, value.lat, value.lng, value.coverPhotoUrl, req.user.id]
      );
      return res.json({ profile: rows[0] });
    }

    const { rows } = await db.query(
      "INSERT INTO vendor_profiles (user_id, business_name, bio, category, experience_years, service_area_km, lat, lng, cover_photo_url, kyc_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending') RETURNING *",
      [req.user.id, value.businessName, value.bio, value.category, value.experienceYears, value.serviceAreaKm, value.lat, value.lng, value.coverPhotoUrl]
    );
    res.status(201).json({ profile: rows[0] });
  } catch (err) { next(err); }
});

// ── POST /api/vendors/services — add service offering ──────
const serviceSchema = Joi.object({
  title: Joi.string().min(2).max(120).required(),
  description: Joi.string().max(1000).allow(''),
  unit: Joi.string().valid('sqft', 'hour', 'lumpsum', 'visit').required(),
  pricePerUnit: Joi.number().positive().required(),
});

router.post('/services', authenticate, requireRole('vendor'), async (req, res, next) => {
  try {
    const { error, value } = serviceSchema.validate(req.body);
    if (error) throw error;

    const vp = await db.query('SELECT id FROM vendor_profiles WHERE user_id = $1', [req.user.id]);
    if (!vp.rows.length) return res.status(400).json({ error: 'Create vendor profile first' });

    const { rows } = await db.query(
      'INSERT INTO services (vendor_id, title, description, unit, price_per_unit, is_active) VALUES ($1, $2, $3, $4, $5, true) RETURNING *',
      [vp.rows[0].id, value.title, value.description, value.unit, value.pricePerUnit]
    );
    res.status(201).json({ service: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;

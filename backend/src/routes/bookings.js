/**
 * Booking routes: /api/bookings
 *
 * POST   /              — customer creates booking
 * GET    /me            — list current user's bookings (customer or vendor)
 * GET    /:id           — booking detail
 * PATCH  /:id/status    — vendor updates status
 *
 * This is the heart of the MVP. Treat it carefully.
 */

const express = require('express');
const Joi = require('joi');
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// ── Validation schemas ─────────────────────────────────────
const createBookingSchema = Joi.object({
  vendorId: Joi.string().uuid().required(),
  serviceId: Joi.string().uuid().required(),
  scheduledDate: Joi.date().iso().required(),
  timeSlot: Joi.string().valid('9-12', '12-3', '3-6', '6-9').required(),
  address: Joi.string().min(5).max(500).required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  scopeText: Joi.string().min(5).max(2000).required(),
  scopePhotos: Joi.array().items(Joi.string().uri()).max(5).default([]),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected', 'in_progress', 'completed', 'cancelled').required(),
  finalPrice: Joi.number().positive().optional(),
});

const VALID_TRANSITIONS = {
  requested: ['accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
};

// ── POST /api/bookings — create booking (customer only) ────
router.post('/', authenticate, requireRole('customer'), async (req, res, next) => {
  try {
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) throw error;

    // Pull service to compute price estimate
    const serviceQ = await db.query(
      `SELECT s.id, s.price_per_unit, s.unit, s.vendor_id
       FROM services s
       WHERE s.id = $1 AND s.vendor_id = $2 AND s.is_active = true`,
      [value.serviceId, value.vendorId]
    );
    if (!serviceQ.rows.length) {
      return res.status(404).json({ error: 'Service not found for this vendor' });
    }
    const service = serviceQ.rows[0];

    // Rough estimate: ±25% band around base price.
    // Real estimate is finalized after on-site visit.
    const base = Number(service.price_per_unit) * 100; // assume 100 units default; UI can refine
    const estimateMin = Math.round(base * 0.75);
    const estimateMax = Math.round(base * 1.25);

    const insert = await db.query(
      `INSERT INTO bookings
        (customer_id, vendor_id, service_id, scheduled_date, time_slot,
         address, lat, lng, scope_text, scope_photos,
         status, price_estimate_min, price_estimate_max)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'requested', $11, $12)
       RETURNING *`,
      [
        req.user.id, value.vendorId, value.serviceId,
        value.scheduledDate, value.timeSlot,
        value.address, value.lat, value.lng,
        value.scopeText, JSON.stringify(value.scopePhotos),
        estimateMin, estimateMax,
      ]
    );

    // TODO: send push notification to vendor via FCM
    res.status(201).json({ booking: insert.rows[0] });
  } catch (err) { next(err); }
});

// ── GET /api/bookings/me — my bookings (role-aware) ────────
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const column = role === 'vendor' ? 'vendor_id' : 'customer_id';

    // Vendor's id is in vendor_profiles.id, not users.id — handle that
    let ownerId = id;
    if (role === 'vendor') {
      const vp = await db.query('SELECT id FROM vendor_profiles WHERE user_id = $1', [id]);
      if (!vp.rows.length) return res.json({ bookings: [] });
      ownerId = vp.rows[0].id;
    }

    const { rows } = await db.query(
      `SELECT b.*,
              s.title AS service_title,
              vp.business_name AS vendor_name,
              u.name AS customer_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN vendor_profiles vp ON vp.id = b.vendor_id
       JOIN users u ON u.id = b.customer_id
       WHERE b.${column} = $1
       ORDER BY b.created_at DESC`,
      [ownerId]
    );
    res.json({ bookings: rows });
  } catch (err) { next(err); }
});

// ── GET /api/bookings/:id — booking detail ─────────────────
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT b.*, s.title AS service_title,
              vp.business_name AS vendor_name, vp.user_id AS vendor_user_id,
              u.name AS customer_name
       FROM bookings b
       JOIN services s ON s.id = b.service_id
       JOIN vendor_profiles vp ON vp.id = b.vendor_id
       JOIN users u ON u.id = b.customer_id
       WHERE b.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Booking not found' });

    const b = rows[0];
    const isCustomer = req.user.id === b.customer_id;
    const isVendor = req.user.id === b.vendor_user_id;
    const isAdmin = req.user.role === 'admin';
    if (!isCustomer && !isVendor && !isAdmin) {
      return res.status(403).json({ error: 'Not your booking' });
    }
    res.json({ booking: b });
  } catch (err) { next(err); }
});

// ── PATCH /api/bookings/:id/status — vendor updates status ─
router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error) throw error;

    const cur = await db.query(
      `SELECT b.*, vp.user_id AS vendor_user_id
       FROM bookings b JOIN vendor_profiles vp ON vp.id = b.vendor_id
       WHERE b.id = $1`,
      [req.params.id]
    );
    if (!cur.rows.length) return res.status(404).json({ error: 'Booking not found' });
    const booking = cur.rows[0];

    // Permission: vendor of this booking, customer (only for cancel), or admin
    const isVendor = req.user.id === booking.vendor_user_id;
    const isCustomer = req.user.id === booking.customer_id;
    if (!isVendor && !isCustomer && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (isCustomer && value.status !== 'cancelled') {
      return res.status(403).json({ error: 'Customer can only cancel' });
    }

    // State machine
    const allowed = VALID_TRANSITIONS[booking.status] || [];
    if (!allowed.includes(value.status)) {
      return res.status(400).json({
        error: `Cannot transition from ${booking.status} to ${value.status}`,
      });
    }

    const { rows } = await db.query(
      `UPDATE bookings
       SET status = $1, final_price = COALESCE($2, final_price), updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [value.status, value.finalPrice || null, req.params.id]
    );

    // TODO: send push notification to customer
    res.json({ booking: rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;

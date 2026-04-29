/**
 * Admin routes: /api/admin
 *  GET   /vendors/pending          — vendors awaiting approval
 *  PATCH /vendors/:id/approve      — approve a vendor
 *  PATCH /vendors/:id/reject       — reject a vendor
 *  GET   /stats                    — basic dashboard counts
 */

const express = require('express');
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, requireRole('admin'));

router.get('/vendors/pending', async (_req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT vp.*, u.name AS owner_name, u.phone, u.email
       FROM vendor_profiles vp
       JOIN users u ON u.id = vp.user_id
       WHERE vp.kyc_status = 'pending'
       ORDER BY vp.created_at ASC`
    );
    res.json({ vendors: rows });
  } catch (err) { next(err); }
});

router.patch('/vendors/:id/approve', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE vendor_profiles SET kyc_status = 'approved' WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ vendor: rows[0] });
  } catch (err) { next(err); }
});

router.patch('/vendors/:id/reject', async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `UPDATE vendor_profiles SET kyc_status = 'rejected' WHERE id = $1 RETURNING *`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ vendor: rows[0] });
  } catch (err) { next(err); }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [users, vendors, bookings, completed] = await Promise.all([
      db.query("SELECT COUNT(*) FROM users WHERE role = 'customer'"),
      db.query("SELECT COUNT(*) FROM vendor_profiles WHERE kyc_status = 'approved'"),
      db.query('SELECT COUNT(*) FROM bookings'),
      db.query("SELECT COUNT(*) FROM bookings WHERE status = 'completed'"),
    ]);
    res.json({
      customers: Number(users.rows[0].count),
      activeVendors: Number(vendors.rows[0].count),
      totalBookings: Number(bookings.rows[0].count),
      completedBookings: Number(completed.rows[0].count),
    });
  } catch (err) { next(err); }
});

// ── Database viewer (admin-only) ────────────────────────────
// Whitelist of tables admin can read. Never accept arbitrary table names from query string.
const DB_TABLES = {
  users: {
    columns: ['id', 'name', 'phone', 'email', 'role', 'is_active', 'created_at'],
    orderBy: 'created_at DESC',
  },
  vendor_profiles: {
    columns: ['id', 'business_name', 'category', 'experience_years', 'kyc_status', 'rating_avg', 'rating_count', 'lat', 'lng', 'created_at'],
    orderBy: 'created_at DESC',
  },
  services: {
    columns: ['id', 'vendor_id', 'title', 'description', 'unit', 'price_per_unit', 'is_active', 'created_at'],
    orderBy: 'created_at DESC',
  },
  bookings: {
    columns: ['id', 'customer_id', 'vendor_id', 'service_id', 'scheduled_date', 'time_slot', 'address', 'status', 'price_estimate_min', 'price_estimate_max', 'final_price', 'created_at'],
    orderBy: 'created_at DESC',
  },
  reviews: {
    columns: ['id', 'booking_id', 'customer_id', 'vendor_id', 'rating', 'comment', 'created_at'],
    orderBy: 'created_at DESC',
  },
};

router.get('/db/tables', (_req, res) => {
  res.json({ tables: Object.keys(DB_TABLES) });
});

router.get('/db/:table', async (req, res, next) => {
  try {
    const meta = DB_TABLES[req.params.table];
    if (!meta) return res.status(404).json({ error: 'Unknown or disallowed table' });

    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const cols = meta.columns.join(', ');
    const { rows } = await db.query(
      `SELECT ${cols} FROM ${req.params.table} ORDER BY ${meta.orderBy} LIMIT $1`,
      [limit]
    );
    const countQ = await db.query(`SELECT COUNT(*) FROM ${req.params.table}`);
    res.json({
      table: req.params.table,
      columns: meta.columns,
      rows,
      total: Number(countQ.rows[0].count),
      shown: rows.length,
    });
  } catch (err) { next(err); }
});

module.exports = router;

/**
 * Review routes: /api/reviews
 *  POST /  — submit review for completed booking
 */

const express = require('express');
const Joi = require('joi');
const db = require('../config/db');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

const reviewSchema = Joi.object({
  bookingId: Joi.string().uuid().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(2000).allow(''),
  photoUrls: Joi.array().items(Joi.string().uri()).max(5).default([]),
});

router.post('/', authenticate, requireRole('customer'), async (req, res, next) => {
  try {
    const { error, value } = reviewSchema.validate(req.body);
    if (error) throw error;

    const bookingQ = await db.query(
      `SELECT id, customer_id, vendor_id, status FROM bookings WHERE id = $1`,
      [value.bookingId]
    );
    if (!bookingQ.rows.length) return res.status(404).json({ error: 'Booking not found' });
    const booking = bookingQ.rows[0];

    if (booking.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Not your booking' });
    }
    if (booking.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    const dup = await db.query('SELECT id FROM reviews WHERE booking_id = $1', [value.bookingId]);
    if (dup.rows.length) return res.status(409).json({ error: 'Already reviewed' });

    // Use a transaction: insert review + update vendor avg
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const insertQ = await client.query(
        `INSERT INTO reviews (booking_id, customer_id, vendor_id, rating, comment, photo_urls)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [value.bookingId, req.user.id, booking.vendor_id, value.rating, value.comment, JSON.stringify(value.photoUrls)]
      );

      await client.query(
        `UPDATE vendor_profiles
         SET rating_count = rating_count + 1,
             rating_avg = (
               (COALESCE(rating_avg, 0) * rating_count) + $1
             ) / (rating_count + 1)
         WHERE id = $2`,
        [value.rating, booking.vendor_id]
      );

      await client.query('COMMIT');
      res.status(201).json({ review: insertQ.rows[0] });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) { next(err); }
});

module.exports = router;

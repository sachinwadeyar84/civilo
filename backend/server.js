/**
 * Civilo Backend — Server entry
 *
 * Boots Express, wires middleware, mounts route modules.
 * Keep this file thin — all logic lives under src/.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./src/routes/auth');
const vendorRoutes = require('./src/routes/vendors');
const serviceRoutes = require('./src/routes/services');
const bookingRoutes = require('./src/routes/bookings');
const reviewRoutes = require('./src/routes/reviews');
const adminRoutes = require('./src/routes/admin');

const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ─────────────────────────────────────────────
// Disable CSP in dev so inline scripts in preview.html run.
// Re-enable with proper config for production.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ── Health check ───────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'civilo-api', time: new Date().toISOString() });
});

// ── Preview UI (served from same origin to avoid CORS) ─────
app.get('/', (_req, res) => res.redirect('/app.html'));
app.get('/preview.html', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'preview.html'));
});
app.get('/app.html', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'app.html'));
});
app.get('/admin', (_req, res) => res.redirect('/admin.html'));
app.get('/admin.html', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'admin.html'));
});

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 + error handler ────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🏗️  Civilo API running on http://localhost:${PORT}`);
});

module.exports = app;

/**
 * Auth routes: /api/auth
 *  POST /register   — create user (customer or vendor)
 *  POST /login      — exchange credentials for tokens
 *  POST /refresh    — exchange refresh token for new access token
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../config/db');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('customer', 'vendor').required(),
});

const loginSchema = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

function signTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
  return { accessToken, refreshToken };
}

router.post('/register', async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) throw error;

    const { name, phone, email, password, role } = value;

    const existing = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length) return res.status(409).json({ error: 'Phone already registered' });

    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await db.query(
      `INSERT INTO users (name, phone, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, email, role, created_at`,
      [name, phone, email || null, passwordHash, role]
    );

    const user = rows[0];
    const tokens = signTokens(user);
    res.status(201).json({ user, ...tokens });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw error;

    const { rows } = await db.query(
      'SELECT id, name, phone, email, role, password_hash FROM users WHERE phone = $1',
      [value.phone]
    );
    const user = rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(value.password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    delete user.password_hash;
    res.json({ user, ...signTokens(user) });
  } catch (err) { next(err); }
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken required' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
    );
    res.json({ accessToken });
  } catch (_err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;

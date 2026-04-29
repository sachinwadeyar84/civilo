/**
 * Express error handler — last middleware in the chain.
 * Normalizes errors thrown anywhere in the request pipeline.
 */

module.exports = function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.isJoi) {
    return res.status(400).json({ error: 'Validation failed', details: err.details });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
};

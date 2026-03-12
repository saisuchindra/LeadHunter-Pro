function errorHandler(err, req, res, _next) {
  console.error('Error:', err.message, err.stack);

  if (err.isJoi) {
    return res.status(400).json({ error: err.details.map((d) => d.message).join(', ') });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
}

module.exports = errorHandler;

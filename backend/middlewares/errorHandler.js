const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route tidak ditemukan: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  console.error("[ERROR HANDLER]", err);

  if (res.headersSent) {
    if (typeof next === "function") {
      return next(err);
    }
    return;
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server",
    stack: err.stack,
  });
};

module.exports = { notFoundHandler, errorHandler };

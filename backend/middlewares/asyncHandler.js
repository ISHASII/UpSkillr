const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      if (typeof next === "function") {
        return next(error);
      }
      console.error("[ASYNC HANDLER] next not a function", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Terjadi kesalahan pada server",
      });
    });
  };
};

module.exports = asyncHandler;

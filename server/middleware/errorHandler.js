/**
 * Global error handler middleware.
 * Must have 4 parameters (err, req, res, next) for Express to recognize it as error handler.
 */
function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    console.error("[500] Internal error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    },
  });
}

export default errorHandler;

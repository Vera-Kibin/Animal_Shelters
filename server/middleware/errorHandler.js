function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode === 500) {
    console.error("[500] Internal error:", err.message);
  }

  const response = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorHandler;

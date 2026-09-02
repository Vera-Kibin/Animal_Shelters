/**
 * 404 handler for unknown routes.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      statusCode: 404,
    },
  });
}

export default notFound;

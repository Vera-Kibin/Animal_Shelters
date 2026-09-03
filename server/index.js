import "./env.js";
import app from "./app.js";
import { logger } from "./middleware/logger.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
  logger.info(`Swagger UI: http://localhost:${PORT}/api/docs`);
  logger.info(`OpenAPI JSON: http://localhost:${PORT}/api/openapi.json`);
});

function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
  setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 5000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

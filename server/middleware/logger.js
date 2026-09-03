function timestamp() {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

const logger = {
  info(msg) {
    console.log(`${timestamp()} INFO: ${msg}`);
  },
  warn(msg) {
    console.warn(`${timestamp()} WARN: ${msg}`);
  },
  error(msg) {
    console.error(`${timestamp()} ERROR: ${msg}`);
  },
};

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;

    if (res.statusCode >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
}

export { logger, requestLogger };

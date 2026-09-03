function validate(schema, source = "body") {
  return (req, res, next) => {
    if (req[source] === undefined || req[source] === null) {
      req[source] = {};
    }

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          statusCode: 400,
          details,
        },
      });
    }

    if (source === "query") {
      Object.defineProperty(req, "query", {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[source] = value;
    }
    next();
  };
}

export default validate;
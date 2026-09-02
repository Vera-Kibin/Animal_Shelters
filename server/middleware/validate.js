/**
 * Validation middleware factory.
 * @param {import('joi').Schema} schema - Joi validation schema
 * @param {'body'|'query'|'params'} source - Which part of the request to validate
 * @returns {Function} Express middleware
 */
function validate(schema, source = "body") {
  return (req, res, next) => {
    // Ensure source object exists (e.g. req.body when no body is sent)
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

    // Express 5 defines req.query as a read-only getter — assigning to it silently
    // fails. Override the getter with a plain object so downstream handlers see
    // Joi defaults and type conversions.
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
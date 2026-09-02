import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "animal-shelters-dev-secret-key-change-in-production";

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication required", statusCode: 401 },
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { message: "Invalid or expired token", statusCode: 401 },
    });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: "Authentication required", statusCode: 401 },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: "Insufficient permissions", statusCode: 403 },
      });
    }

    next();
  };
}

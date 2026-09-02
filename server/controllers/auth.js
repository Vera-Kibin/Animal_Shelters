import { Router } from "express";
import jwt from "jsonwebtoken";
import validate from "../middleware/validate.js";
import { register as registerSchema, login as loginSchema } from "../schemas/auth.js";
import { createUser, findUserByEmail, verifyPassword } from "../data/store.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "animal-shelters-dev-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.warn("[SECURITY] JWT_SECRET not set in production! Using default secret - this is insecure!");
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     description: Creates a new user with email, password, and name.
 *     operationId: register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       201:
 *         description: User registered
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const user = await createUser({ email, password, name });
    res.status(201).json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    if (err.message === "Duplicate email") {
      return res.status(409).json({ success: false, error: { message: "Email already exists", statusCode: 409 } });
    }
    next(err);
  }
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Authenticates a user and returns a JWT token.
 *     operationId: login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: { message: "Invalid email or password", statusCode: 401 } });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, error: { message: "Invalid email or password", statusCode: 401 } });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     description: Returns the current user profile from the Bearer token.
 *     operationId: getMe
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Missing or invalid Authorization header
 */
router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: { message: "Missing or invalid Authorization header", statusCode: 401 } });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: { message: "Invalid or expired token", statusCode: 401 } });
    }

    const { findUser } = await import("../data/store.js");
    const user = await findUser(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, error: { message: "User not found", statusCode: 404 } });
    }

    res.json({ success: true, data: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

export default router;

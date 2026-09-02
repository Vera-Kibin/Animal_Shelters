import { Router } from "express";
import {
  handleListUsers,
  handleGetUserById,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from "../controllers/users.js";
import validate from "../middleware/validate.js";
import { register as registerSchema, login as loginSchema } from "../schemas/auth.js";

const router = Router();

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
    const { createUser } = await import("../data/store.js");
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
    const { getUsers } = await import("../data/store.js");
    const users = await getUsers();
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, error: { message: "Invalid email or password", statusCode: 401 } });
    }
    if (user.password !== password) {
      return res.status(401).json({ success: false, error: { message: "Invalid email or password", statusCode: 401 } });
    }
    res.json({ success: true, data: { token: "jwt-token-" + user.id, user: { id: user.id, email: user.email, name: user.name } } });
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

    const { getUsers } = await import("../data/store.js");
    const users = await getUsers();
    const user = users[0];

    if (!user) {
      return res.status(404).json({ success: false, error: { message: "User not found", statusCode: 404 } });
    }

    res.json({ success: true, data: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

export default router;
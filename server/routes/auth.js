import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

const STUB_USER = { id: "stub-user-1", email: "stub@example.com", name: "Stub User", role: "volunteer" };

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
 */
router.post("/register", (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return res.status(400).json({
      success: false,
      error: { message: "email and name are required", statusCode: 400 },
    });
  }
  res.status(201).json({
    success: true,
    data: { id: randomUUID(), email, name, role: "volunteer" },
  });
});

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticates a user and returns a JWT token.
 *     operationId: login
 *     tags: [Auth]
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
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: { message: "email and password are required", statusCode: 400 },
    });
  }
  res.json({
    success: true,
    data: {
      token: `mock-token-${randomUUID()}`,
      user: { ...STUB_USER, email },
    },
  });
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
router.get("/me", (req, res) => {
  res.json({ success: true, data: STUB_USER });
});

export default router;

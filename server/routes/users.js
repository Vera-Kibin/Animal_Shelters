import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

let users = [
  { id: "user-1", name: "Jan Kowalski", email: "jan@example.com", role: "admin", createdAt: "2025-01-15T10:30:00.000Z", updatedAt: "2025-01-15T10:30:00.000Z" },
  { id: "user-2", name: "Anna Nowak", email: "anna@example.com", role: "volunteer", createdAt: "2025-02-20T12:00:00.000Z", updatedAt: "2025-02-20T12:00:00.000Z" },
];

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: List users
 *     description: Returns a paginated list of users with optional role filter. Requires authentication.
 *     operationId: listUsers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         description: Filter by user role
 *         schema:
 *           type: string
 *           enum: [volunteer, admin, moderator]
 *       - in: query
 *         name: limit
 *         description: Number of results per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: offset
 *         description: Number of results to skip
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *     responses:
 *       200:
 *         description: Paginated list of users
 *       401:
 *         description: Authentication required
 */
router.get("/", (req, res) => {
  const { role, limit, offset } = req.query;
  let result = [...users];
  if (role) result = result.filter((u) => u.role === role);
  const limitNum = parseInt(limit) || 20;
  const offsetNum = parseInt(offset) || 0;
  res.json({
    success: true,
    data: result.slice(offsetNum, offsetNum + limitNum),
    meta: { total: result.length, limit: limitNum, offset: offsetNum },
  });
});

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Returns a single user by their unique ID. Requires authentication.
 *     operationId: getUserById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: `User with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  res.json({ success: true, data: user });
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Creates a new user. Requires admin role.
 *     operationId: createUser
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.post("/", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: { message: "name and email are required", statusCode: 400 },
    });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: { message: "Email already exists", statusCode: 409 },
    });
  }
  const now = new Date().toISOString();
  const user = { id: randomUUID(), name, email, role: req.body.role || "volunteer", createdAt: now, updatedAt: now };
  users.push(user);
  res.status(201).json({ success: true, data: user });
});

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user
 *     description: Updates an existing user. Requires admin role.
 *     operationId: updateUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 */
router.put("/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `User with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  users[idx] = { ...users[idx], ...req.body, id: users[idx].id, updatedAt: new Date().toISOString() };
  res.json({ success: true, data: users[idx] });
});

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user
 *     description: Permanently deletes a user. Requires admin role.
 *     operationId: deleteUser
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `User with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  const [removed] = users.splice(idx, 1);
  res.json({ success: true, data: { id: removed.id } });
});

export default router;

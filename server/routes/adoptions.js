import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

let adoptions = [
  { id: "1", user_id: "user-1", animal_id: "1", notes: "Mam domek z ogrodem", status: "pending" },
  { id: "2", user_id: "user-2", animal_id: "2", notes: "", status: "approved" },
];

/**
 * @openapi
 * /api/adoptions:
 *   get:
 *     tags: [Adoptions]
 *     summary: List adoption requests
 *     description: Returns a paginated list of adoption requests with optional filters. Requires authentication.
 *     operationId: listAdoptions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected, cancelled] }
 *       - in: query
 *         name: user_id
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: List of adoption requests
 *       401:
 *         description: Authentication required
 */
router.get("/", (req, res) => {
  const { status, user_id, limit, offset } = req.query;
  let result = [...adoptions];
  if (status) result = result.filter((a) => a.status === status);
  if (user_id) result = result.filter((a) => a.user_id === user_id);
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
 * /api/adoptions/{id}:
 *   get:
 *     tags: [Adoptions]
 *     summary: Get adoption request by ID
 *     description: Returns a single adoption request by their unique ID. Requires authentication.
 *     operationId: getAdoptionById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Adoption request found
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", (req, res) => {
  const adoption = adoptions.find((a) => a.id === req.params.id);
  if (!adoption) {
    return res.status(404).json({
      success: false,
      error: { message: `Adoption with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  res.json({ success: true, data: adoption });
});

/**
 * @openapi
 * /api/adoptions:
 *   post:
 *     tags: [Adoptions]
 *     summary: Request adoption
 *     description: Creates a new adoption request. Requires authentication.
 *     operationId: requestAdoption
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdoptionCreate'
 *     responses:
 *       201:
 *         description: Adoption request created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 */
router.post("/", (req, res) => {
  const { animal_id } = req.body;
  if (!animal_id) {
    return res.status(400).json({
      success: false,
      error: { message: "animal_id is required", statusCode: 400 },
    });
  }
  const adoption = { id: randomUUID(), user_id: "stub-user-1", status: "pending", notes: "", ...req.body };
  adoptions.push(adoption);
  res.status(201).json({ success: true, data: adoption });
});

/**
 * @openapi
 * /api/adoptions/{id}/status:
 *   put:
 *     tags: [Adoptions]
 *     summary: Update adoption status
 *     description: Updates the status of an adoption request. Requires admin or moderator role.
 *     operationId: updateAdoptionStatus
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdoptionStatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id/status", (req, res) => {
  const idx = adoptions.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Adoption with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  const { status } = req.body;
  if (!["pending", "approved", "rejected", "cancelled"].includes(status)) {
    return res.status(400).json({
      success: false,
      error: { message: "status must be one of: pending, approved, rejected, cancelled", statusCode: 400 },
    });
  }
  adoptions[idx] = { ...adoptions[idx], status };
  res.json({ success: true, data: adoptions[idx] });
});

/**
 * @openapi
 * /api/adoptions/{id}:
 *   delete:
 *     tags: [Adoptions]
 *     summary: Cancel adoption request
 *     description: Cancels an adoption request by setting status to cancelled. Requires authentication.
 *     operationId: cancelAdoption
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Adoption cancelled
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => {
  const idx = adoptions.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Adoption with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  adoptions[idx] = { ...adoptions[idx], status: "cancelled" };
  res.json({ success: true, data: adoptions[idx] });
});

export default router;

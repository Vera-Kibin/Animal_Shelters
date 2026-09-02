import { Router } from "express";
import {
  handleListAdoptions,
  handleGetAdoptionById,
  handleRequestAdoption,
  handleUpdateAdoptionStatus,
  handleCancelAdoption,
} from "../controllers/adoptions.js";
import validate from "../middleware/validate.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  idParam,
} from "../schemas/common.js";
import { requestAdoption as requestAdoptionSchema } from "../schemas/adoption.js";
import { updateAdoptionStatus as updateAdoptionStatusSchema } from "../schemas/adoption.js";
import { listAdoptions as listAdoptionsSchema } from "../schemas/adoption.js";

const router = Router();

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
router.get("/", authenticate, validate(listAdoptionsSchema, "query"), handleListAdoptions);

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
router.get("/:id", authenticate, validate(idParam, "params"), handleGetAdoptionById);

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
router.post("/", authenticate, validate(requestAdoptionSchema), handleRequestAdoption);

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
router.put("/:id/status", authenticate, requireRole("admin", "moderator"), validate(idParam, "params"), validate(updateAdoptionStatusSchema), handleUpdateAdoptionStatus);

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
router.delete("/:id", authenticate, validate(idParam, "params"), handleCancelAdoption);

export default router;
export { handleListAdoptions, handleGetAdoptionById, handleRequestAdoption, handleUpdateAdoptionStatus, handleCancelAdoption };

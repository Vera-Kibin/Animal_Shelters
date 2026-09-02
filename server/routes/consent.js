import { Router } from "express";
import { recordConsent } from "../controllers/consent.js";
import validate from "../middleware/validate.js";
import { recordConsent as recordConsentSchema } from "../schemas/consent.js";

const router = Router();

/**
 * @openapi
 * /api/consent:
 *   post:
 *     tags: [Consent]
 *     summary: Record user consent
 *     description: Records a user's consent decision (cookies, analytics, etc.).
 *     operationId: recordConsent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsentCreate'
 *     responses:
 *       201:
 *         description: Consent recorded
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", validate(recordConsentSchema), recordConsent);

export default router;

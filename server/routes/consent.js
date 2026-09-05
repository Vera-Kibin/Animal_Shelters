import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

const consents = [];

/**
 * @openapi
 * /api/consent:
 *   post:
 *     tags: [Consent]
 *     summary: Record user consent
 *     description: Records a user's consent decision (cookies, analytics, etc.). Requires authentication.
 *     operationId: recordConsent
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 */
router.post("/", (req, res) => {
  const { consent_type, granted } = req.body;
  if (!consent_type || typeof granted !== "boolean") {
    return res.status(400).json({
      success: false,
      error: { message: "consent_type and granted (boolean) are required", statusCode: 400 },
    });
  }
  const consent = {
    id: randomUUID(),
    user_id: "stub-user-1",
    consent_type,
    granted,
    recordedAt: new Date().toISOString(),
  };
  consents.push(consent);
  res.status(201).json({ success: true, data: consent });
});

export default router;

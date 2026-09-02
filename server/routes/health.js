import { Router } from "express";
import { getHealth } from "../controllers/health.js";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Returns server health status, uptime, memory usage, and system info.
 *     operationId: getHealth
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/HealthResponse'
 */
router.get("/health", getHealth);

export default router;

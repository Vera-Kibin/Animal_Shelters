import { Router } from "express";
import {
  listSurveys,
  getSurveyById,
  submitSurvey,
} from "../controllers/surveys.js";
import validate from "../middleware/validate.js";
import { authenticate, requireRole } from "../middleware/auth.js";
import {
  idParam,
  submitSurvey as submitSurveySchema,
  listSurveys as listSurveysSchema,
} from "../schemas/survey.js";

const router = Router();

/**
 * @openapi
 * /api/surveys:
 *   get:
 *     tags: [Surveys]
 *     summary: List surveys
 *     description: Returns a paginated list of surveys with optional filters. Requires authentication.
 *     operationId: listSurveys
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: shelter_id
 *         schema: { type: string }
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
 *         description: List of surveys
 *       401:
 *         description: Authentication required
 */
router.get("/", authenticate, validate(listSurveysSchema, "query"), listSurveys);

/**
 * @openapi
 * /api/surveys/{id}:
 *   get:
 *     tags: [Surveys]
 *     summary: Get survey by ID
 *     description: Returns a single survey by its unique ID. Requires authentication.
 *     operationId: getSurveyById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Survey found
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", authenticate, validate(idParam, "params"), getSurveyById);

/**
 * @openapi
 * /api/surveys:
 *   post:
 *     tags: [Surveys]
 *     summary: Submit a survey
 *     description: Submits a new survey with ratings for a shelter. Requires authentication.
 *     operationId: submitSurvey
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SurveyCreate'
 *     responses:
 *       201:
 *         description: Survey submitted
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 */
router.post("/", authenticate, validate(submitSurveySchema), submitSurvey);

export default router;

import { Router } from "express";
import {
  listSurveys,
  getSurveyById,
  submitSurvey,
} from "../controllers/surveys.js";
import validate from "../middleware/validate.js";
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
 *     description: Returns a paginated list of surveys with optional filters.
 *     operationId: listSurveys
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
 */
router.get("/", validate(listSurveysSchema, "query"), listSurveys);

/**
 * @openapi
 * /api/surveys/{id}:
 *   get:
 *     tags: [Surveys]
 *     summary: Get survey by ID
 *     description: Returns a single survey by its unique ID.
 *     operationId: getSurveyById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Survey found
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", validate(idParam, "params"), getSurveyById);

/**
 * @openapi
 * /api/surveys:
 *   post:
 *     tags: [Surveys]
 *     summary: Submit a survey
 *     description: Submits a new survey with ratings for a shelter.
 *     operationId: submitSurvey
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
 */
router.post("/", validate(submitSurveySchema), submitSurvey);

export default router;

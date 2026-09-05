import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

let surveys = [
  {
    id: "survey-1",
    user_id: "user-1",
    shelter_id: "shelter-1",
    ratings: { cleanliness: 5, animal_care: 4, staff_friendliness: 5, overall: 4 },
    comment: "Great shelter, very clean!",
    createdAt: "2025-06-20T10:00:00.000Z",
    updatedAt: "2025-06-20T10:00:00.000Z",
  },
];

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
router.get("/", (req, res) => {
  const { shelter_id, user_id, limit, offset } = req.query;
  let result = [...surveys];
  if (shelter_id) result = result.filter((s) => s.shelter_id === shelter_id);
  if (user_id) result = result.filter((s) => s.user_id === user_id);
  const limitNum = parseInt(limit) || 10;
  const offsetNum = parseInt(offset) || 0;
  res.json({
    success: true,
    data: result.slice(offsetNum, offsetNum + limitNum),
    meta: { total: result.length, limit: limitNum, offset: offsetNum },
  });
});

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
router.get("/:id", (req, res) => {
  const survey = surveys.find((s) => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({
      success: false,
      error: { message: `Survey with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  res.json({ success: true, data: survey });
});

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
router.post("/", (req, res) => {
  const { shelter_id, ratings } = req.body;
  if (!shelter_id || !ratings) {
    return res.status(400).json({
      success: false,
      error: { message: "shelter_id and ratings are required", statusCode: 400 },
    });
  }
  const now = new Date().toISOString();
  const survey = { id: randomUUID(), user_id: "stub-user-1", ...req.body, createdAt: now, updatedAt: now };
  surveys.push(survey);
  res.status(201).json({ success: true, data: survey });
});

export default router;

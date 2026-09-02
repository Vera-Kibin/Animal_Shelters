import { Router } from "express";
import {
  handleListShelters,
  handleGetShelterById,
  handleCreateShelter,
  handleUpdateShelter,
  handleDeleteShelter,
} from "../controllers/shelters.js";
import validate from "../middleware/validate.js";
import {
  idParam,
} from "../schemas/common.js";
import { createShelter as createShelterSchema } from "../schemas/shelter.js";
import { updateShelter as updateShelterSchema } from "../schemas/shelter.js";
import { listShelters as listSheltersSchema } from "../schemas/shelter.js";

const router = Router();

/**
 * @openapi
 * /api/shelters:
 *   get:
 *     tags: [Shelters]
 *     summary: List shelters
 *     description: Returns a paginated list of shelters with optional filters.
 *     operationId: listShelters
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
*       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
*       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
*     responses:
*       200:
*         description: List of shelters
*/
router.get("/", validate(listSheltersSchema, "query"), handleListShelters);

/**
 * @openapi
 * /api/shelters/{id}:
 *   get:
 *     tags: [Shelters]
 *     summary: Get shelter by ID
*     description: Returns a single shelter by their unique ID.
*     operationId: getShelterById
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema: { type: string }
*     responses:
*       200:
*         description: Shelter found
*       404:
*         $ref: '#/components/responses/NotFound'
*/
router.get("/:id", validate(idParam, "params"), handleGetShelterById);

/**
 * @openapi
 * /api/shelters:
 *   post:
 *     tags: [Shelters]
 *     summary: Create shelter
*     description: Creates a new shelter record.
*     operationId: createShelter
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/ShelterCreate'
*     responses:
*       201:
*         description: Shelter created
*       400:
*         $ref: '#/components/responses/ValidationError'
*/
router.post("/", validate(createShelterSchema), handleCreateShelter);

/**
 * @openapi
 * /api/shelters/{id}:
 *   put:
 *     tags: [Shelters]
 *     summary: Update shelter
*     description: Updates an existing shelter. At least one field must be provided.
*     operationId: updateShelter
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
*             $ref: '#/components/schemas/ShelterUpdate'
*     responses:
*       200:
*         description: Shelter updated
*       400:
*         $ref: '#/components/responses/ValidationError'
*       404:
*         $ref: '#/components/responses/NotFound'
*/
router.put("/:id", validate(idParam, "params"), validate(updateShelterSchema), handleUpdateShelter);

/**
 * @openapi
 * /api/shelters/{id}:
 *   delete:
 *     tags: [Shelters]
 *     summary: Delete shelter
*     description: Deletes a shelter by ID.
*     operationId: deleteShelter
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema: { type: string }
*     responses:
*       200:
*         description: Shelter deleted
*       404:
*         $ref: '#/components/responses/NotFound'
*/
router.delete("/:id", validate(idParam, "params"), handleDeleteShelter);

export default router;
export { handleListShelters, handleGetShelterById, handleCreateShelter, handleUpdateShelter, handleDeleteShelter };
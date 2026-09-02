import { Router } from "express";
import {
  handleListAnimals,
  handleGetAnimalById,
  handleCreateAnimal,
  handleUpdateAnimal,
  handleDeleteAnimal,
} from "../controllers/animals.js";
import validate from "../middleware/validate.js";
import {
  idParam,
} from "../schemas/common.js";
import { createAnimal as createAnimalSchema } from "../schemas/animal.js";
import { updateAnimal as updateAnimalSchema } from "../schemas/animal.js";
import { listAnimals as listAnimalsSchema } from "../schemas/animal.js";

const router = Router();

/**
 * @openapi
 * /api/animals:
 *   get:
 *     tags: [Animals]
 *     summary: List animals
 *     description: Returns a paginated list of animals with optional filters.
 *     operationId: listAnimals
 *     parameters:
 *       - in: query
 *         name: shelter_id
 *         schema: { type: string }
 *       - in: query
 *         name: species
 *         schema: { type: string }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *       - in: query
 *         name: offset
 *         schema: { type: integer, minimum: 0, default: 0 }
 *     responses:
 *       200:
 *         description: List of animals
 */
router.get("/", validate(listAnimalsSchema, "query"), handleListAnimals);

/**
 * @openapi
 * /api/animals/{id}:
 *   get:
 *     tags: [Animals]
 *     summary: Get animal by ID
 *     description: Returns a single animal by their unique ID.
 *     operationId: getAnimalById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Animal found
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get("/:id", validate(idParam, "params"), handleGetAnimalById);

/**
 * @openapi
 * /api/animals:
 *   post:
 *     tags: [Animals]
 *     summary: Create animal
 *     description: Creates a new animal record.
 *     operationId: createAnimal
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnimalCreate'
 *     responses:
 *       201:
 *         description: Animal created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post("/", validate(createAnimalSchema), handleCreateAnimal);

/**
 * @openapi
 * /api/animals/{id}:
 *   put:
 *     tags: [Animals]
 *     summary: Update animal
 *     description: Updates an existing animal. At least one field must be provided.
 *     operationId: updateAnimal
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
 *             $ref: '#/components/schemas/AnimalUpdate'
 *     responses:
 *       200:
 *         description: Animal updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", validate(idParam, "params"), validate(updateAnimalSchema), handleUpdateAnimal);

/**
 * @openapi
 * /api/animals/{id}:
 *   delete:
 *     tags: [Animals]
 *     summary: Delete animal
 *     description: Deletes an animal by ID.
 *     operationId: deleteAnimal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Animal deleted
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", validate(idParam, "params"), handleDeleteAnimal);

export default router;
export { handleListAnimals, handleGetAnimalById, handleCreateAnimal, handleUpdateAnimal, handleDeleteAnimal };
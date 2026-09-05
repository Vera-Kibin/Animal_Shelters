import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

let animals = [
  { id: "1", name: "Burek", species: "dog", breed: "Labrador", age: 3, shelter_id: "1" },
  { id: "2", name: "Mruczek", species: "cat", breed: "Maine Coon", age: 2, shelter_id: "2" },
];

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
router.get("/", (req, res) => {
  const { shelter_id, species, limit, offset } = req.query;
  let result = [...animals];
  if (shelter_id) result = result.filter((a) => a.shelter_id === shelter_id);
  if (species) result = result.filter((a) => a.species === species);
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
router.get("/:id", (req, res) => {
  const animal = animals.find((a) => a.id === req.params.id);
  if (!animal) {
    return res.status(404).json({
      success: false,
      error: { message: `Animal with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  res.json({ success: true, data: animal });
});

/**
 * @openapi
 * /api/animals:
 *   post:
 *     tags: [Animals]
 *     summary: Create animal
 *     description: Creates a new animal record. Requires authentication.
 *     operationId: createAnimal
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 */
router.post("/", (req, res) => {
  const { name, species, shelter_id } = req.body;
  if (!name || !species || !shelter_id) {
    return res.status(400).json({
      success: false,
      error: { message: "name, species and shelter_id are required", statusCode: 400 },
    });
  }
  const animal = { id: randomUUID(), ...req.body };
  animals.push(animal);
  res.status(201).json({ success: true, data: animal });
});

/**
 * @openapi
 * /api/animals/{id}:
 *   put:
 *     tags: [Animals]
 *     summary: Update animal
 *     description: Updates an existing animal. Requires authentication.
 *     operationId: updateAnimal
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
 *             $ref: '#/components/schemas/AnimalUpdate'
 *     responses:
 *       200:
 *         description: Animal updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", (req, res) => {
  const idx = animals.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Animal with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  animals[idx] = { ...animals[idx], ...req.body, id: animals[idx].id };
  res.json({ success: true, data: animals[idx] });
});

/**
 * @openapi
 * /api/animals/{id}:
 *   delete:
 *     tags: [Animals]
 *     summary: Delete animal
 *     description: Deletes an animal by ID. Requires admin role.
 *     operationId: deleteAnimal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Animal deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => {
  const idx = animals.findIndex((a) => a.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Animal with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  const [removed] = animals.splice(idx, 1);
  res.json({ success: true, data: { id: removed.id } });
});

export default router;

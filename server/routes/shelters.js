import { Router } from "express";
import { randomUUID } from "node:crypto";

const router = Router();

let shelters = [
  { id: "1", name: "Schronisko w Krakowie", city: "Kraków", country: "Polska", contact_email: "kontakt@schronisko.pl", contact_phone: "+48 12 345 67 89" },
  { id: "2", name: "Azyl dla Zwierząt", city: "Warszawa", country: "Polska", contact_email: "info@azyl.pl", contact_phone: "+48 22 987 65 43" },
];

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
router.get("/", (req, res) => {
  const { city, country, limit, offset } = req.query;
  let result = [...shelters];
  if (city) result = result.filter((s) => s.city === city);
  if (country) result = result.filter((s) => s.country === country);
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
router.get("/:id", (req, res) => {
  const shelter = shelters.find((s) => s.id === req.params.id);
  if (!shelter) {
    return res.status(404).json({
      success: false,
      error: { message: `Shelter with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  res.json({ success: true, data: shelter });
});

/**
 * @openapi
 * /api/shelters:
 *   post:
 *     tags: [Shelters]
 *     summary: Create shelter
 *     description: Creates a new shelter record. Requires authentication.
 *     operationId: createShelter
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Authentication required
 */
router.post("/", (req, res) => {
  const { name, city, country } = req.body;
  if (!name || !city || !country) {
    return res.status(400).json({
      success: false,
      error: { message: "name, city and country are required", statusCode: 400 },
    });
  }
  const shelter = { id: randomUUID(), ...req.body };
  shelters.push(shelter);
  res.status(201).json({ success: true, data: shelter });
});

/**
 * @openapi
 * /api/shelters/{id}:
 *   put:
 *     tags: [Shelters]
 *     summary: Update shelter
 *     description: Updates an existing shelter. Requires authentication.
 *     operationId: updateShelter
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
 *             $ref: '#/components/schemas/ShelterUpdate'
 *     responses:
 *       200:
 *         description: Shelter updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         description: Authentication required
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.put("/:id", (req, res) => {
  const idx = shelters.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Shelter with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  shelters[idx] = { ...shelters[idx], ...req.body, id: shelters[idx].id };
  res.json({ success: true, data: shelters[idx] });
});

/**
 * @openapi
 * /api/shelters/{id}:
 *   delete:
 *     tags: [Shelters]
 *     summary: Delete shelter
 *     description: Deletes a shelter by ID. Requires admin role.
 *     operationId: deleteShelter
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Shelter deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:id", (req, res) => {
  const idx = shelters.findIndex((s) => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({
      success: false,
      error: { message: `Shelter with id "${req.params.id}" not found`, statusCode: 404 },
    });
  }
  const [removed] = shelters.splice(idx, 1);
  res.json({ success: true, data: { id: removed.id } });
});

export default router;

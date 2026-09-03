import { v4 as uuidv4 } from "uuid";

let animals = [
  { id: "1", name: "Burek", species: "dog", breed: "Labrador", age: 3, shelter_id: "1" },
  { id: "2", name: "Mruczek", species: "cat", breed: "Maine Coon", age: 2, shelter_id: "2" },
];

export async function handleListAnimals(req, res, next) {
  try {
    const { species, shelter_id, limit, offset } = req.query;
    let result = [...animals];
    if (species) {
      result = result.filter((a) => a.species === species);
    }
    if (shelter_id) {
      result = result.filter((a) => a.shelter_id === shelter_id);
    }
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    const total = result.length;
    const paginated = result.slice(offsetNum, offsetNum + limitNum);
    res.json({ success: true, data: paginated, meta: { total, limit: limitNum, offset: offsetNum } });
  } catch (err) {
    next(err);
  }
}

export async function handleGetAnimalById(req, res, next) {
  try {
    const animal = animals.find((a) => a.id === req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, error: { message: "Animal not found", statusCode: 404 } });
    }
    res.json({ success: true, data: animal });
  } catch (err) {
    next(err);
  }
}

export async function handleCreateAnimal(req, res, next) {
  try {
    const newAnimal = { id: uuidv4(), ...req.body };
    animals.push(newAnimal);
    res.status(201).json({ success: true, data: newAnimal });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateAnimal(req, res, next) {
  try {
    const index = animals.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Animal not found", statusCode: 404 } });
    }
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    animals[index] = { ...animals[index], ...updates };
    res.json({ success: true, data: animals[index] });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteAnimal(req, res, next) {
  try {
    const index = animals.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Animal not found", statusCode: 404 } });
    }
    const deleted = animals.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
  } catch (err) {
    next(err);
  }
}
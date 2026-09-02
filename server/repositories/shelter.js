import { v4 as uuidv4 } from "uuid";

let shelters = [
  { id: "1", name: "Schronisko w Krakowie", city: "Kraków", country: "Polska", contact_email: "kontakt@schronisko.pl", contact_phone: "+48 12 345 67 89" },
  { id: "2", name: "Azyl dla Zwierząt", city: "Warszawa", country: "Polska", contact_email: "info@azyl.pl", contact_phone: "+48 22 987 65 43" },
];

export async function handleListShelters(req, res, next) {
  try {
    const { city, country, limit, offset } = req.query;
    let result = [...shelters];
    if (city) result = result.filter((s) => s.city === city);
    if (country) result = result.filter((s) => s.country === country);
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    const total = result.length;
    const paginated = result.slice(offsetNum, offsetNum + limitNum);
    res.json({ success: true, data: paginated, meta: { total, limit: limitNum, offset: offsetNum } });
  } catch (err) {
    next(err);
  }
}

export async function handleGetShelterById(req, res, next) {
  try {
    const shelter = shelters.find((s) => s.id === req.params.id);
    if (!shelter) {
      return res.status(404).json({ success: false, error: { message: "Shelter not found", statusCode: 404 } });
    }
    res.json({ success: true, data: shelter });
  } catch (err) {
    next(err);
  }
}

export async function handleCreateShelter(req, res, next) {
  try {
    const newShelter = { id: uuidv4(), ...req.body };
    shelters.push(newShelter);
    res.status(201).json({ success: true, data: newShelter });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateShelter(req, res, next) {
  try {
    const index = shelters.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Shelter not found", statusCode: 404 } });
    }
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    shelters[index] = { ...shelters[index], ...updates };
    res.json({ success: true, data: shelters[index] });
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteShelter(req, res, next) {
  try {
    const index = shelters.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Shelter not found", statusCode: 404 } });
    }
    const deleted = shelters.splice(index, 1);
    res.json({ success: true, data: deleted[0] });
  } catch (err) {
    next(err);
  }
}
import { v4 as uuidv4 } from "uuid";

let adoptions = [
  { id: "1", user_id: "1", animal_id: "1", notes: "Mam domek z ogrodem", status: "pending" },
  { id: "2", user_id: "2", animal_id: "2", notes: "", status: "approved" },
];

export async function handleListAdoptions(req, res, next) {
  try {
    const { status, user_id, limit, offset } = req.query;
    let result = [...adoptions];
    if (!["admin", "moderator"].includes(req.user.role)) {
      result = result.filter((a) => a.user_id === req.user.id);
    } else if (user_id) {
      result = result.filter((a) => a.user_id === user_id);
    }
    if (status) result = result.filter((a) => a.status === status);
    const limitNum = parseInt(limit) || 20;
    const offsetNum = parseInt(offset) || 0;
    const total = result.length;
    const paginated = result.slice(offsetNum, offsetNum + limitNum);
    res.json({ success: true, data: paginated, meta: { total, limit: limitNum, offset: offsetNum } });
  } catch (err) {
    next(err);
  }
}

export async function handleGetAdoptionById(req, res, next) {
  try {
    const adoption = adoptions.find((a) => a.id === req.params.id);
    if (!adoption) {
      return res.status(404).json({ success: false, error: { message: "Adoption not found", statusCode: 404 } });
    }
    if (!["admin", "moderator"].includes(req.user.role) && adoption.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: "Insufficient permissions", statusCode: 403 } });
    }
    res.json({ success: true, data: adoption });
  } catch (err) {
    next(err);
  }
}

export async function handleRequestAdoption(req, res, next) {
  try {
    const newAdoption = { id: uuidv4(), ...req.body, user_id: req.user.id, status: "pending" };
    adoptions.push(newAdoption);
    res.status(201).json({ success: true, data: newAdoption });
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateAdoptionStatus(req, res, next) {
  try {
    const index = adoptions.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Adoption not found", statusCode: 404 } });
    }
    adoptions[index] = { ...adoptions[index], status: req.body.status };
    res.json({ success: true, data: adoptions[index] });
  } catch (err) {
    next(err);
  }
}

export async function handleCancelAdoption(req, res, next) {
  try {
    const index = adoptions.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: { message: "Adoption not found", statusCode: 404 } });
    }
    const adoption = adoptions[index];
    if (!["admin", "moderator"].includes(req.user.role) && adoption.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: "Insufficient permissions", statusCode: 403 } });
    }
    adoptions[index] = { ...adoption, status: "cancelled" };
    res.json({ success: true, data: adoptions[index] });
  } catch (err) {
    next(err);
  }
}
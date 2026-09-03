const surveys = [
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

export async function listSurveys(req, res, next) {
  try {
    const { shelter_id, user_id, limit, offset } = req.query;

    let filtered = [...surveys];
    if (!["admin", "moderator"].includes(req.user.role)) {
      filtered = filtered.filter((s) => s.user_id === req.user.id);
    } else if (user_id) {
      filtered = filtered.filter((s) => s.user_id === user_id);
    }
    if (shelter_id) filtered = filtered.filter((s) => s.shelter_id === shelter_id);

    const total = filtered.length;
    const limitNum = parseInt(limit) || 10;
    const offsetNum = parseInt(offset) || 0;
    const paginated = filtered.slice(offsetNum, offsetNum + limitNum);

    res.status(200).json({
      success: true,
      data: paginated,
      meta: { total, limit: limitNum, offset: offsetNum },
    });
  } catch (err) {
    next(err);
  }
}

export async function getSurveyById(req, res, next) {
  try {
    const { id } = req.params;
    const survey = surveys.find((s) => s.id === id);

    if (!survey) {
      return res.status(404).json({
        success: false,
        error: { message: `Survey with id "${id}" not found`, statusCode: 404 },
      });
    }

    if (!["admin", "moderator"].includes(req.user.role) && survey.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: { message: "Insufficient permissions", statusCode: 403 } });
    }

    res.status(200).json({ success: true, data: survey });
  } catch (err) {
    next(err);
  }
}

export async function submitSurvey(req, res, next) {
  try {
    const survey = {
      id: `survey-${Date.now()}`,
      user_id: req.user.id,
      shelter_id: req.body.shelter_id,
      ratings: req.body.ratings,
      comment: req.body.comment || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    surveys.push(survey);
    res.status(201).json({ success: true, data: survey });
  } catch (err) {
    next(err);
  }
}

export async function listSurveys(req, res, next) {
  try {
    const { shelter_id, user_id, limit, offset } = req.query;

    const surveys = [
      {
        id: "survey-1",
        user_id: "user-1",
        shelter_id: "shelter-1",
        ratings: { cleanliness: 5, animal_care: 4, staff_friendliness: 5, overall: 4 },
        comment: "Great shelter, very clean!",
        createdAt: "2025-06-20T10:00:00.000Z",
      },
    ];

    let filtered = surveys;
    if (shelter_id) filtered = filtered.filter((s) => s.shelter_id === shelter_id);
    if (user_id) filtered = filtered.filter((s) => s.user_id === user_id);

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: paginated,
      meta: { total, limit, offset },
    });
  } catch (err) {
    next(err);
  }
}

export async function getSurveyById(req, res, next) {
  try {
    const { id } = req.params;

    if (id !== "survey-1") {
      return res.status(404).json({
        success: false,
        error: { message: `Survey with id "${id}" not found`, statusCode: 404 },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: "survey-1",
        user_id: "user-1",
        shelter_id: "shelter-1",
        ratings: { cleanliness: 5, animal_care: 4, staff_friendliness: 5, overall: 4 },
        comment: "Great shelter, very clean!",
        createdAt: "2025-06-20T10:00:00.000Z",
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function submitSurvey(req, res, next) {
  try {
    const survey = {
      id: `survey-${Date.now()}`,
      user_id: req.body.user_id,
      shelter_id: req.body.shelter_id,
      ratings: req.body.ratings,
      comment: req.body.comment || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.status(201).json({ success: true, data: survey });
  } catch (err) {
    next(err);
  }
}

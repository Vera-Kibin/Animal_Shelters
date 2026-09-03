import Joi from "joi";

const idParam = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "Survey ID is required",
  }),
});

const submitSurvey = Joi.object({
  user_id: Joi.string().optional(),
  shelter_id: Joi.string().required().messages({
    "any.required": "Shelter ID is required",
  }),
  ratings: Joi.object({
    cleanliness: Joi.number().integer().min(1).max(5).required(),
    animal_care: Joi.number().integer().min(1).max(5).required(),
    staff_friendliness: Joi.number().integer().min(1).max(5).required(),
    overall: Joi.number().integer().min(1).max(5).required(),
  })
    .required()
    .messages({
      "any.required": "Ratings are required",
    }),
  comment: Joi.string().max(1000).optional().allow("", null),
});

const listSurveys = Joi.object({
  shelter_id: Joi.string().optional(),
  user_id: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

export { idParam, submitSurvey, listSurveys };

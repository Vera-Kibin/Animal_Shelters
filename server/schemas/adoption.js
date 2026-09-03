import Joi from "joi";

const idParam = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
});

const requestAdoption = Joi.object({
  user_id: Joi.string().optional(),
  animal_id: Joi.string().required().messages({
    "any.required": "Animal ID is required",
  }),
  notes: Joi.string().max(1000).optional().allow("", null),
});

const updateAdoptionStatus = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "rejected", "cancelled")
    .required()
    .messages({
      "any.only": "Status must be one of: pending, approved, rejected, cancelled",
      "any.required": "Status is required",
    }),
});

const listAdoptions = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "rejected", "cancelled")
    .optional(),
  user_id: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

export { idParam, requestAdoption, updateAdoptionStatus, listAdoptions };

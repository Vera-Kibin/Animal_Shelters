import Joi from "joi";

const idParam = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
});

const createShelter = Joi.object({
  name: Joi.string().min(1).max(200).required().messages({
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must not exceed 200 characters",
    "any.required": "Name is required",
  }),
  city: Joi.string().min(1).max(100).required().messages({
    "string.min": "City must be at least 1 character long",
    "string.max": "City must not exceed 100 characters",
    "any.required": "City is required",
  }),
  country: Joi.string().min(1).max(100).required().messages({
    "string.min": "Country must be at least 1 character long",
    "string.max": "Country must not exceed 100 characters",
    "any.required": "Country is required",
  }),
  contact_email: Joi.string().email().optional().allow("", null),
  contact_phone: Joi.string().max(30).optional().allow("", null),
});

const updateShelter = Joi.object({
  name: Joi.string().min(1).max(200).optional(),
  city: Joi.string().min(1).max(100).optional(),
  country: Joi.string().min(1).max(100).optional(),
  contact_email: Joi.string().email().optional().allow("", null),
  contact_phone: Joi.string().max(30).optional().allow("", null),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

const listShelters = Joi.object({
  city: Joi.string().optional(),
  country: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

export { idParam, createShelter, updateShelter, listShelters };

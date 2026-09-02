import Joi from "joi";

const idParam = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
});

const createUser = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  role: Joi.string().valid("volunteer", "admin", "moderator").default("volunteer"),
});

const updateUser = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid("volunteer", "admin", "moderator").optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

const listUsers = Joi.object({
  role: Joi.string().valid("volunteer", "admin", "moderator").optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

export { idParam, createUser, updateUser, listUsers };

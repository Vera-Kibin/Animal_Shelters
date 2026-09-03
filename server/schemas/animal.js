import Joi from "joi";

const idParam = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
});

const createAnimal = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.min": "Name must be at least 1 character long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  species: Joi.string().min(1).max(50).required().messages({
    "string.min": "Species must be at least 1 character long",
    "string.max": "Species must not exceed 50 characters",
    "any.required": "Species is required",
  }),
  breed: Joi.string().max(100).optional().allow("", null),
  age: Joi.number().integer().min(0).max(100).optional(),
  shelter_id: Joi.string().required().messages({
    "any.required": "Shelter ID is required",
  }),
});

const updateAnimal = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  species: Joi.string().min(1).max(50).optional(),
  breed: Joi.string().max(100).optional().allow("", null),
  age: Joi.number().integer().min(0).max(100).optional(),
  shelter_id: Joi.string().optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided for update",
});

const listAnimals = Joi.object({
  shelter_id: Joi.string().optional(),
  species: Joi.string().optional(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});

export { idParam, createAnimal, updateAnimal, listAnimals };

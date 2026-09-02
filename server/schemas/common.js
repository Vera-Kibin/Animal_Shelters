import Joi from "joi";

export const idParam = Joi.object({
  id: Joi.string().required(),
});

export const pagination = Joi.object({
  limit: Joi.number().integer().min(1).default(20),
  offset: Joi.number().integer().min(0).default(0),
});
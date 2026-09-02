import Joi from "joi";

const recordConsent = Joi.object({
  user_id: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  consent_type: Joi.string()
    .valid("cookies", "analytics", "marketing", "data_processing")
    .required()
    .messages({
      "any.only":
        "Consent type must be one of: cookies, analytics, marketing, data_processing",
      "any.required": "Consent type is required",
    }),
  granted: Joi.boolean().required().messages({
    "any.required": "Granted status is required",
  }),
});

export { recordConsent };

import Joi from "joi";

export const ownerLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

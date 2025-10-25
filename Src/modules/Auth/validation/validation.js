import Joi from "joi"

export const registerSchema =Joi.object({
    fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("saas_owner", "restaurant_owner", "manager", "customer", "delivery_partner").required(),

})
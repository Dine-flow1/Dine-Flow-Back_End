import Joi from "joi";

export const addCategoryValidation = Joi.object({
  restaurantId: Joi.string().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().allow(""),
  sortOrder: Joi.number().default(0),
  image: Joi.string().allow(null, ""),
});
export const addItemVallidation = Joi.object({
  categoryId: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  description: Joi.string().allow(""),
  price: Joi.number().min(0).required(),
  image: Joi.string().allow(null, ""),
  isAvailable: Joi.boolean(),
  isVeg: Joi.boolean(),
  spiceLevel: Joi.string().valid("Low", "Medium", "High"),
  discount: Joi.number().min(0),
  tags: Joi.array().items(Joi.string()),
});

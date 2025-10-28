import Joi from "joi";

export const registerRestaurantSchema = Joi.object({
  restaurantData: Joi.object({
    restaurantName: Joi.string().required(),
    restaurantType: Joi.string().optional(),
    description: Joi.string().optional(),
    logo: Joi.string().optional(),
    bannerImage: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    contactEmail: Joi.string().email().required(),
    contactPhone: Joi.string().optional(),
    panNumber: Joi.string().optional(),
    gstinNumber: Joi.string().optional(),
    fssaiNumber: Joi.string().optional(),
    registrationNumber: Joi.string().optional(),
  }).required(),

  ownerData: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
  }).required(),
});

export const addBranchSchema = Joi.object({
  branchName: Joi.string().required(),
  address: Joi.string().required(),
  geoLocation: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),
  contactPhone: Joi.string().optional(),
  openingHours: Joi.object().optional(),
});

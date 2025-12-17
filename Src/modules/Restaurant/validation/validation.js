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
  branchCode: Joi.string().optional(),
  branchType: Joi.string().valid("Restaurant", "Cafe", "Takeaway").optional(),
  branchStatus: Joi.string().valid("active", "closed", "suspended").optional(),
  
  address: Joi.string().required(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pincode: Joi.string().optional(),
  landmark: Joi.string().optional(),

  geoLocation: Joi.object({
    type: Joi.string().valid("Point").required(),
    coordinates: Joi.array().items(Joi.number()).length(2).required(),
  }).required(),

  contactPhone: Joi.string().optional(),
  contactEmail: Joi.string().email().optional(),
  whatsappNumber: Joi.string().optional(),

  openingHours: Joi.object({
    openingTime: Joi.string().optional(),
    closingTime: Joi.string().optional(),
  }).optional(),
  workingDays: Joi.array().items(Joi.string()).optional(),
  breakTime: Joi.string().optional(),

  managerId: Joi.string().optional(),
  receptionistIds: Joi.array().items(Joi.string()).optional(),
  kitchenStaffIds: Joi.array().items(Joi.string()).optional(),
  deliveryStaffIds: Joi.array().items(Joi.string()).optional(),

  totalTables: Joi.number().optional(),
  totalSeats: Joi.number().optional(),
  seatingType: Joi.string().optional(),

  services: Joi.object({
    dineIn: Joi.boolean().optional(),
    takeaway: Joi.boolean().optional(),
    delivery: Joi.boolean().optional(),
    onlineOrders: Joi.boolean().optional(),
    tableReservation: Joi.boolean().optional(),
  }).optional(),

  paymentMethods: Joi.array().items(Joi.string()).optional(),

  gstNumber: Joi.string().optional(),
  fssaiNumber: Joi.string().optional(),
  serviceCharge: Joi.number().optional(),
  taxPercentage: Joi.number().optional(),

  orderPrefix: Joi.string().optional(),
  invoicePrefix: Joi.string().optional(),
  defaultPrinter: Joi.string().optional(),

  branchImage: Joi.string().optional(),
  notes: Joi.string().optional(),
});

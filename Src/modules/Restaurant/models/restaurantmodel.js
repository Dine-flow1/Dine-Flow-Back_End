import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  address: { type: String, required: true },
  geoLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      required: true, // [longitude, latitude]
    },
  },
  contactPhone: { type: String, required: true },
  openingHours: { type: Object }, // example: { mon: "9-9", tue: "10-8" }
});

const RestaurantSchema = new mongoose.Schema({
  restaurantName: { type: String, required: true },
  restaurantType: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  bannerImage: { type: String },
  website: { type: String },

  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },

  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  owner: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // hashed
    phone: String,
    role: { type: String, default: "restaurant_owner" },
    isAccountVerified: { type: Boolean, default: false },
  },

  panNumber: { type: String },
  gstinNumber: { type: String },
  fssaiNumber: { type: String },
  registrationNumber: { type: String },

  branches: [BranchSchema], // multiple branches

  status: {
    type: String,
    enum: ["active", "suspended", "pending_verification"],
    default: "pending_verification",
  },

  createdAt: { type: Date, default: Date.now },
});

RestaurantSchema.index({ "branches.geoLocation": "2dsphere" });

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;

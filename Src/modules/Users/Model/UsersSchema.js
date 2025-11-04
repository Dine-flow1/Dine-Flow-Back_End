import mongoose from "mongoose";
const userSchama = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String },
  googleId: { type: String }, 
  role: {
    type: String,
    enum: [
      "saas_owner",
      "restaurant_owner",
      "manager",
      "customer",
      "delivery_partner",
    ],
    required: true,
  },
  contact: { type: String },
  profileImage: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
  },
  isAccountVerified: { type: Boolean, default: false },
  verifyOtp: String,
  verifyOtpExpireAt: Date,
  resetOtp: String,
  resetOtpExpireAt: Date,
});
const UserModel = mongoose.model("users", userSchama);
export default UserModel;

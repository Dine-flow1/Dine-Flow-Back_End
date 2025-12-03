import mongoose from "mongoose";

const SubscriptionPlanSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,   // "6_months", "1_year"
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,  // 699 / 1199
  },

  originalPrice: {
    type: Number,
  },

  currency: {
    type: String,
    default: "INR",
  },

  durationMonths: {
    type: Number,
    required: true, 
  },

  popular: {
    type: Boolean,
    default: false,
  },

  badge: {
    type: String,
  },

  features: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);

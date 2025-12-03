import mongoose from "mongoose";

const RestaurantSubscriptionSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },

  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubscriptionPlan",
    required: true,
  },

  startDate: {
    type: Date,
    default: Date.now,
  },

  endDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["active", "expired", "cancelled"],
    default: "active",
  },

  paymentId: {
    type: String,
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model(
  "RestaurantSubscription",
  RestaurantSubscriptionSchema
);

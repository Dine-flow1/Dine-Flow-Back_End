import mongoose from "mongoose";

const RestaurantSubscriptionSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },

  plan: {
    type: String,
    enum: ["699", "1199"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  startDate: {
    type: Date,
    default: null,
  },

  endDate: {
    type: Date,
    default: null,
  },

  status: {
    type: String,
    enum: ["pending", "active", "expired", "cancelled"],
    default: "pending",
  },

  paymentId: { type: String },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RestaurantSubscription", RestaurantSubscriptionSchema);

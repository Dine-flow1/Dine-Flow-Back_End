import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FeedbackSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: "MenuItem",
    required: false,
  },
  type: {
    type: String,
    enum: ["restaurant", "menu"], 
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  anonymous: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Feedback", FeedbackSchema);

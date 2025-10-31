import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "menuCategory",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: null, 
    },
    isAvailable: {
      type: Boolean,
      default: true, 
    },
    isVeg: {
      type: Boolean,
      default: false, 
    },
    spiceLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    discount: {
      type: Number,
      default: 0, 
    },
    rating: {
      type: Number,
      default: 0, 
    },
    tags: [
      {
        type: String,
        trim: true, 
      },
    ],
  },
  { timestamps: true }
);

const MenuItem= mongoose.model("MenuItem", MenuItemSchema);
export default MenuItem
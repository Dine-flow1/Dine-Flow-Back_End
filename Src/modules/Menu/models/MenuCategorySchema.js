import mongoose from "mongoose";

const MenuCategorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
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
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Menucategory= mongoose.model("menuCategory", MenuCategorySchema);
export default Menucategory
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type: { type: String, enum: ["auto", "specific" ,"walkin"], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    totalAmount: { type: Number, default: 0 },
    token: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    cancellationReason: { type: String, default: null },
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    tableNumber: { type: Number, required: true },
    seats: { type: Number, required: true },

    isPremium: { type: Boolean, default: false },
    priceMultiplier: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    bookings: [bookingSchema], // nested bookings here

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

const TableBookingModel = mongoose.model("TableBooking", tableSchema);
export default TableBookingModel;

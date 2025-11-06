import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MenuItem",
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  customer: {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: { type: String },
    phone: { type: String },
  },
  restaurant: {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: { type: String },
    address: { type: String },
  },
  items: [ItemSchema],
  orderSummary: {
    orderType: { type: String, enum: ["delivery", "pickup"], required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD", "Online"], required: true },
    notes: { type: String },
  },
  deliveryDetails: {
    address: { type: String },
    instructions: { type: String },
    phone: { type: String },
    assignedDeliveryPerson: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      name: { type: String },
      phone: { type: String },
    },
    estimatedDeliveryTime: { type: Date },
  },
  orderStatus: {
    placed: { type: Date, default: Date.now },
    confirmed: { type: Date },
    preparing: { type: Date },
    readyForDelivery: { type: Date },
    outForDelivery: { type: Date },
    delivered: { type: Date },
    canceled: { type: Date },
  },
});

const OrderModel = mongoose.model("Order", OrderSchema);

export default OrderModel;

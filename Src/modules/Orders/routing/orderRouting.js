import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
import orderController from "../controllers/orderController.js";
const orderRouting = express.Router();

orderRouting.post(
  "/create",
  authMiddleware,
  authorizeRoles("customer"),
  orderController.createOrder
);

// Cancel order (restaurant)
orderRouting.put(
  "/cancel/:orderId",
  authMiddleware,
  authorizeRoles("customer"),
  orderController.cancelOrder
);

// Get current order for customer
orderRouting.get(
  "/curent",
  authMiddleware,
  authorizeRoles("customer"),
  orderController.getCurrentOrder
);

// Get all my orders for customer
orderRouting.get(
  "/myOrders",
  authMiddleware,
  authorizeRoles("customer"),
  orderController.getMyOrders
);

// Customer: Get my order by ID
orderRouting.get(
  "/myOrders/:orderId",
  authMiddleware,
  authorizeRoles("customer"),
  orderController.getMyOrderById
);

// Restaurant: Get orders by restaurant
orderRouting.get(
  "/restaurant",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  orderController.getOrdersByRestaurant
);

// Restaurant: Update order status
orderRouting.put(
  "/status/:orderId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  orderController.updateOrderStatus
);

// Restaurant: Get orders by customer ID
orderRouting.get(
  "/restaurant/customer/:customerId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  orderController.getOrdersByCustomerId
);
orderRouting.put(
  "/assing-delivery/:orderId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  orderController.assignDelivery
);

orderRouting.get(
  "/generate-invoice/:orderId",
  authMiddleware,
  authorizeRoles(" customer", "restaurant_owner", "manager"),
  orderController.generateInvoice
);
export default orderRouting;

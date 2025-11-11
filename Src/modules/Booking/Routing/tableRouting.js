import express from "express";
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
import tableBookingController from "../controlles/tableController.js";

const TableRouting = express.Router();

// ================== TABLE ROUTES ==================

// ✅ Create a new table (Restaurant Owner / Manager)
TableRouting.post(
  "/create",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.createTable
);

// ✅ Get all tables for the logged-in restaurant
TableRouting.get(
  "/tables",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.getTablesByRestaurant
);

// ✅ Get single table details
TableRouting.get(
  "/table/:tableId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.getTableById
);

// ✅ Update table details
TableRouting.put(
  "/table/:tableId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.updateTable
);

// ✅ Delete a table
TableRouting.delete(
  "/table/:tableId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.deleteTable
);

// ✅ Update table status (available / reserved / occupied)
TableRouting.put(
  "/table/:tableId/status",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.updateTableStatus
);

// ================== BOOKING ROUTES ==================

// ✅ Create booking (Customer)
TableRouting.post(
  "/booking/:restaurantId/:tableId",
  authMiddleware,
  authorizeRoles("customer"),
  tableBookingController.createBooking
);
TableRouting.get(
  "/tables/customer/:restaurantId",
  authMiddleware,
  authorizeRoles("customer"),
  tableBookingController.getTablesByRestaurantForCustomer
);
// ✅ Approve booking (Restaurant)
TableRouting.put(
  "/booking/:tableId/:bookingId/approve",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.approveBooking
);

// ✅ Reject booking (Restaurant)
TableRouting.put(
  "/booking/:tableId/:bookingId/reject",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.rejectBooking
);

// ✅ Cancel booking (Customer)
TableRouting.put(
  "/booking/:tableId/:bookingId/cancel",
  authMiddleware,
  authorizeRoles("customer"),
  tableBookingController.cancelBooking
);

// ✅ Get all bookings for logged-in restaurant
TableRouting.get(
  "/bookings/restaurant",
  authMiddleware,
  authorizeRoles("restaurant_owner", "manager"),
  tableBookingController.getBookingsByRestaurant
);

// ✅ Get all bookings for logged-in customer
TableRouting.get(
  "/bookings/customer",
  authMiddleware,
  authorizeRoles("customer"),
  tableBookingController.getBookingsByCustomer
);

// ✅ (Optional) Get single booking details
// TableRouting.get(
//   "/booking/:tableId/:bookingId",
//   authMiddleware,
//   authorizeRoles("customer", "restaurant_owner", "manager"),
//   tableBookingController.getBookingById
// );

export default TableRouting;

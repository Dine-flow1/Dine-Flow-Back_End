import express from "express";
import {
  addBranch,
  getAllRestaurants,
  getBranchById,
  getCustomerBranches,
  getOwnerBranches,
  getRestaurantById,
  registerRestaurants,
  sendOtpController,
  verifyRestaurantOtp,
} from "../controller/restaurantController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
import { addBranchSchema } from "../validation/validation.js";
import { validateRequest } from "../../../middleware/validateRequest.js";
import { createManager, deleteManager, getAllManagers, toggleManagerStatus, updateManager } from "../controller/manager.controller.js";

const Restaurantrouter = express.Router();

Restaurantrouter.post("/send-otp", sendOtpController);
Restaurantrouter.post("/register", registerRestaurants);
Restaurantrouter.post("/verify-otp", verifyRestaurantOtp);

Restaurantrouter.get("/restaurants", getAllRestaurants);
Restaurantrouter.post(
  "/:restaurantId/branches",
  validateRequest(addBranchSchema),
  addBranch
);

Restaurantrouter.get(
  "/getallRestaurants",
  authMiddleware,
  authorizeRoles("restaurantOwner", "manager"),
  getAllRestaurants
);
Restaurantrouter.get(
  "/getRestaurants/:id",
  authMiddleware,
  authorizeRoles("customer"),
  getRestaurantById
);
Restaurantrouter.get(
  "/owner/branches",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  getOwnerBranches
);
Restaurantrouter.get(
  "/:restaurantId/branches",
  authMiddleware,
  authorizeRoles("customer"),
  getCustomerBranches
);

Restaurantrouter.get(
  "/getbranches/id",
  authMiddleware,
  authorizeRoles("customer","restaurant_owner","manager"),
  getBranchById
);

// Manager
Restaurantrouter.post(
  "/create-manager",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  createManager
);
Restaurantrouter.get(
  "/getall-manager",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  getAllManagers
);
Restaurantrouter.get(
  "/getall-manager/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  getAllManagers
);
Restaurantrouter.put(
  "/update-manager/:managerId",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  updateManager
);
Restaurantrouter.delete(
  "/delete-manager/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  deleteManager
);
Restaurantrouter.patch(
  "/toggle-manager-status/:managerId",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  toggleManagerStatus
);

export default Restaurantrouter;

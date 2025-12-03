import express from "express";
import {
  addBranch,
  getAllRestaurants,
  getRestaurantById,
  registerRestaurants,
  verifyRestaurantOtp,
} from "../controller/restaurantController.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
import { addBranchSchema } from "../validation/validation.js";
import { validateRequest } from "../../../middleware/validateRequest.js";

const Restaurantrouter = express.Router();

Restaurantrouter.post("/register", registerRestaurants);

Restaurantrouter.post("/verify-otp", verifyRestaurantOtp);

Restaurantrouter.get(
  "/restaurants",
  getAllRestaurants
);
Restaurantrouter.post(
  "/:restaurantId/branches",  validateRequest(addBranchSchema),
  addBranch
);

Restaurantrouter.get(
  "/:id",
  authMiddleware,
  authorizeRoles("customer"),
  getRestaurantById
);

export default Restaurantrouter;

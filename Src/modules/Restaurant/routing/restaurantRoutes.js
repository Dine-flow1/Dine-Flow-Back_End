import express from "express";
import {
  addBranch,
  getAllRestaurants,
  getRestaurantById,
  registerRestaurants,
  verifyRestaurantOtp,
} from "../controller/restaurantController.js";

const Restaurantrouter = express.Router();

Restaurantrouter.post("/register", registerRestaurants);

Restaurantrouter.post("/verify-otp", verifyRestaurantOtp);

Restaurantrouter.get("/restaurants", getAllRestaurants);
Restaurantrouter.post("/:restaurantId/branches", addBranch);

Restaurantrouter.get("/:id", getRestaurantById);

export default Restaurantrouter;

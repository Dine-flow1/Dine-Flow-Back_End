import express from "express";
import { loginOwner } from "../controller/saasController.js";
import { authOwner } from "../middleware/ownerAuth.js";

import { ownerDashboard } from "../controller/dashboardController.js";
import {
  getAllRestaurants,
  getRestaurant,
  approveRestaurant,
  rejectRestaurant,
  blockRestaurant,
  unblockRestaurant,
} from "../controller/restaurantManagementController.js";

const router = express.Router();

// Owner login
router.post("/ownerLogin", loginOwner);

// Dashboard
router.get("/dashboard", authOwner, ownerDashboard);

// Restaurant management
router.get("/restaurants", authOwner, getAllRestaurants);
router.get("/restaurants/:id", authOwner, getRestaurant);
router.put("/restaurants/approve/:id", authOwner, approveRestaurant);
router.put("/restaurants/reject/:id", authOwner, rejectRestaurant);
router.put("/restaurants/block/:id", authOwner, blockRestaurant);
router.put("/restaurants/unblock/:id", authOwner, unblockRestaurant);

export default router;

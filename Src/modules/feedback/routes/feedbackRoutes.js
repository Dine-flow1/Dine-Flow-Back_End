import express from "express";
import {
  addFeedback,
  getAllFeedbackForRestaurant,
  getRestaurantOnlyFeedback,
  getMenuItemFeedback,
} from "../controller/feedbackController.js";

const router = express.Router();

router.post("/add", addFeedback);

router.get("/restaurant/:restaurantId", getAllFeedbackForRestaurant);

router.get("/restaurant-only/:restaurantId", getRestaurantOnlyFeedback);

router.get("/menu/:menuItemId", getMenuItemFeedback);

export default router;

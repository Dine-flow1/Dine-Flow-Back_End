import express from "express";
import {
  addCategory,
  addItem,
  deleteCategory,
  deleteItem,
  getCategories,
  getCategoriesByRestaurantId,
  getItemById,
  getItems,
  updateCategory,
  updateItem,
} from "../controllers/menuControllers.js";
import { authorizeRoles } from "../../../middleware/authmiddleware.js";
import {
  addCategoryValidation,
  addItemVallidation,
} from "../vallidetion/menuValidation.js";
import { validateRequest } from "../../../middleware/validateRequest.js";

const menuRoutin = express.Router();

// Categorys
menuRoutin.post(
  "/categories",
  authorizeRoles("manager", "restaurant_owner"),
  validateRequest(addCategoryValidation),
  addCategory
);
menuRoutin.get("/getCategories", getCategories);
menuRoutin.get("/getCategories/:restaurantId", getCategoriesByRestaurantId);
menuRoutin.put(
  "/updateCategories/:id",
  authorizeRoles("manager", "restaurant_owner"),
  updateCategory
);
menuRoutin.delete(
  "/deletedCategories/:id",
  authorizeRoles("manager", "restaurant_owner"),
  deleteCategory
);

// Items
menuRoutin.post(
  "/items",
  authorizeRoles("manager", "restaurant_owner"),
  addItem
);
menuRoutin.get("/getItems", getItems);
menuRoutin.get("/getItem/:id", getItemById);
menuRoutin.put(
  "/updateItems/:id",
  authorizeRoles("manager", "restaurant_owner"),
  updateItem
);
menuRoutin.delete(
  "/deleteItems/:id",
  authorizeRoles("manager", "restaurant_owner"),
  validateRequest(addItemVallidation),
  deleteItem
);

export default menuRoutin;

import express from "express";
import { menuController } from "../controllers/menuControllers.js";
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/category",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.createCategory
);
router.get(
  "/categories",
  authMiddleware,
  authorizeRoles("restaurant_owner", "customer"),
  menuController.getAllCategories
);
router.get(
  "/category/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner", "customer"),
  menuController.getCategoryById
);
router.put(
  "/category/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.updateCategory
);
router.delete(
  "/deleteCategory/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.deleteCategory
);

// ITEM routes
router.post(
  "/item",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.createItem
);
router.get(
  "/items",
  authMiddleware,
  menuController.getAllItems
);
router.get(
  "/item/:id",
  authMiddleware,
  authorizeRoles("customer"),
  menuController.getItemById
);
router.put(
  "/item/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.updateItem
);
router.delete(
  "/itemDeleted/:id",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  menuController.deleteItem
);

// FULL MENU
router.get(
  "/fullmenu/:restaurantId",
  authMiddleware,
  authorizeRoles("restaurant_owner", "customer"),
  menuController.getFullMenu
);

export default router;

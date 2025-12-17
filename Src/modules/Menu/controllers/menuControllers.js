import { menuService } from "../services/menuServices.js";


export const menuController = {
  // CATEGORY
  createCategory: async (req, res) => {
    const result = await menuService.createCategory(req.body, req.user);
    return res.status(result.status).json(result);
  },

getAllCategories: async (req, res) => {
  const result = await menuService.getAllCategories(
    req.user,
    req.query.restaurantId
  );
  return res.status(result.status).json(result);
},


  getCategoryById: async (req, res) => {
    const result = await menuService.getCategoryById(req.params.id);
    return res.status(result.status).json(result);
  },

  updateCategory: async (req, res) => {
    const result = await menuService.updateCategory(req.params.id, req.body);
    return res.status(result.status).json(result);
  },

  deleteCategory: async (req, res) => {
    const result = await menuService.deleteCategory(req.params.id);
    return res.status(result.status).json(result);
  },

  // ITEM
  createItem: async (req, res) => {
    const result = await menuService.createItem(req.body, req.user);
    return res.status(result.status).json(result);
  },

  getAllItems: async (req, res) => {
    const result = await menuService.getAllItems(
      req.query.restaurantId,
      req.query.categoryId
    );
    return res.status(result.status).json(result);
  },

  getItemById: async (req, res) => {
    const result = await menuService.getItemById(req.params.id);
    return res.status(result.status).json(result);
  },

  updateItem: async (req, res) => {
    const result = await menuService.updateItem(req.params.id, req.body);
    return res.status(result.status).json(result);
  },

  deleteItem: async (req, res) => {
    const result = await menuService.deleteItem(req.params.id);
    return res.status(result.status).json(result);
  },

  // FULL MENU
getFullMenu: async (req, res) => {
  const restaurantId = req.params.restaurantId || req.query.restaurantId;
  const result = await menuService.getFullMenu(req.user, restaurantId);
  return res.status(result.status).json(result);
},


};

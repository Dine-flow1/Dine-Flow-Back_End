import { menuService } from "../services/menuServices.js";

export const addCategory = async (req, res) => {
  const result = await menuService.addCategory(req.body, req.user);
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const getCategories = async (req, res) => {
  const result = await menuService.getCategories(req.user);
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const getCategoriesByRestaurantId = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await menuService.getCategoriesByRestaurantId(restaurantId);

    return res.status(result.status).json({
      success: result.status < 400,
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    console.error("getCategoriesByRestaurantId Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

// ITEM CONTROLLERS
export const addItem = async (req, res) => {
  const result = await menuService.addItem(req.user, req.body); // ✅ swapped order
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const getItems = async (req, res) => {
  const result = await menuService.getItems(req.user, req.query.categoryId);
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};


export const getItemById = async (req, res) => {
  try {
    const result = await menuService.getItemById(req.params.id, req.user);

    return res.status(result.status).json({
      success: result.status < 400,
      message: result.message,
      data: result.data,
    });
  } catch (err) {
    console.error("Controller Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// UPDATE & DELETE
export const updateCategory = async (req, res) => {
  const result = await menuService.updateCategory(
    req.params.id,
    req.body,
    req.user
  );
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const updateItem = async (req, res) => {
  const result = await menuService.updateItem(
    req.params.id,
    req.body,
    req.user
  );
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const deleteCategory = async (req, res) => {
  const result = await menuService.deleteCategory(req.params.id, req.user);
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

export const deleteItem = async (req, res) => {
  const result = await menuService.deleteItem(req.params.id, req.user);
  return res.status(result.status).json({
    success: result.status < 400,
    message: result.message,
    data: result.data,
  });
};

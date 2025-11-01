import Menucategory from "../models/MenuCategorySchema.js";
import MenuItem from "../models/MenuItemSchema.js";
import Restaurant from "../../Restaurant/models/restaurantmodel.js";
import mongoose from "mongoose";

export const menuService = {
  createCategory: async (data, user) => {
    try {
      let restaurantId = user?.restaurantId;
      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({ ownerId: user._id });
        if (!restaurant)
          return { status: 404, message: "Restaurant not found" };
        restaurantId = restaurant._id;
      }
      console.log(restaurantId);
     
      const existingCategory = await Menucategory.findOne({
        restaurantId,
        name: data.name.trim(),
      });

      if (existingCategory) {
        return { status: 400, message: "Category already exists" };
      }

      const category = await Menucategory.create({ ...data, restaurantId });
      return { status: 201, message: "Category created", data: category };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  getAllCategories: async (id) => {
    console.log("sdds",id);

    try {
      const categories = await Menucategory.find({ id });
      return { status: 200, message: "Categories fetched", data: categories };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  getCategoryById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        return { status: 400, message: "Invalid category ID" };

      const category = await Menucategory.findById(id);
      if (!category) return { status: 404, message: "Category not found" };
      return { status: 200, message: "Category fetched", data: category };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  updateCategory: async (id, data) => {
    try {
      const category = await Menucategory.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!category) return { status: 404, message: "Category not found" };
      return { status: 200, message: "Category updated", data: category };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  deleteCategory: async (id) => {
    try {
      const deleted = await Menucategory.findByIdAndDelete(id);
      if (!deleted) return { status: 404, message: "Category not found" };
      return { status: 200, message: "Category deleted" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

 createItem: async (data, user) => {
    try {
      let restaurantId = user?.restaurantId;
      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({ ownerId: user._id });
        if (!restaurant)
          return { status: 404, message: "Restaurant not found" };
        restaurantId = restaurant._id;
      }

      const item = await MenuItem.create({ ...data, restaurantId });
      return { status: 201, message: "Item created", data: item };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  getAllItems: async (id, categoryId = null) => {
    console.log(categoryId);
    console.log(id);
    
    try {
      const filter = { id };
      if (categoryId) filter.categoryId = categoryId;

      const items = await MenuItem.find(filter).populate("categoryId", "name");
      return { status: 200, message: "Items fetched", data: items };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  getItemById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        return { status: 400, message: "Invalid item ID" };

      const item = await MenuItem.findById(id).populate("categoryId", "name");
      if (!item) return { status: 404, message: "Item not found" };
      return { status: 200, message: "Item fetched", data: item };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  updateItem: async (id, data) => {
    try {
      const item = await MenuItem.findByIdAndUpdate(id, data, { new: true });
      if (!item) return { status: 404, message: "Item not found" };
      return { status: 200, message: "Item updated", data: item };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  deleteItem: async (id) => {
    try {
      const deleted = await MenuItem.findByIdAndDelete(id);
      if (!deleted) return { status: 404, message: "Item not found" };
      return { status: 200, message: "Item deleted" };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },

  // ---------- FULL MENU ----------
getFullMenu: async (user, restaurantId = null) => {
  try {
    // ✅ 1. If restaurantId not provided, find from user
    if (!restaurantId) {
      if (!user?._id) {
        return { status: 400, message: "User information missing" };
      }

      const restaurantDoc = await Restaurant.findOne({ ownerId: user._id });
      if (!restaurantDoc) {
        return { status: 404, message: "Restaurant not found for this user" };
      }
      restaurantId = restaurantDoc._id;
    }

    // ✅ 2. Validate restaurantId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return { status: 400, message: "Invalid restaurant ID" };
    }

    // ✅ 3. Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return { status: 404, message: "Restaurant not found" };
    }

    // ✅ 4. Fetch categories & items
    const categories = await Menucategory.find({ restaurantId });
    const menu = [];

    for (const category of categories) {
      const items = await MenuItem.find({ categoryId: category._id });
      menu.push({
        category: {
          _id: category._id,
          name: category.name,
          description: category.description,
          image: category.image,
        },
        items,
      });
    }

    // ✅ 5. Return structured full menu
    return {
      status: 200,
      message: "Full menu fetched successfully",
      data: {
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
        },
        menu,
      },
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
},

};

import Restaurant from "../../Restaurant/models/restaurantmodel.js";
import Menucategory from "../models/MenuCategorySchema.js";
import MenuItem from "../models/MenuItemSchema.js";
import mongoose from "mongoose";

export const menuService = {
  addCategory: async (data, user) => {
    try {
      let restaurantId = user?.restaurantId;

      // If restaurantId not in user (owner), fetch it
      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({
          ownerId: new mongoose.Types.ObjectId(user._id),
        });
        if (!restaurant) {
          return {
            status: 404,
            message: "Restaurant not found for this owner",
            data: null,
          };
        }
        restaurantId = restaurant._id;
      }

      // Check if category already exists
      const existing = await Menucategory.findOne({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        name: data.name.trim(),
      });

      if (existing)
        return { status: 400, message: "Category already exists", data: null };

      const category = await Menucategory.create({
        ...data,
        restaurantId,
      });

      return {
        status: 201,
        message: "Category added successfully",
        data: category,
      };
    } catch (err) {
      console.error("addCategory Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  getCategories: async (user) => {
    try {
      let restaurantId = user?.restaurantId;

      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({
          ownerId: new mongoose.Types.ObjectId(user._id),
        });
        if (!restaurant) {
          return {
            status: 404,
            message: "Restaurant not found for this owner",
            data: [],
          };
        }
        restaurantId = restaurant._id;
      }

      const categories = await Menucategory.find({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        isActive: true,
      }).sort({ sortOrder: 1 });

      return {
        status: 200,
        message: "Categories fetched successfully",
        data: categories,
      };
    } catch (err) {
      console.error("getCategories Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  getCategoriesByRestaurantId: async (restaurantId) => {
    try {
      const categories = await Menucategory.find({
        restaurantId,
        isActive: true,
      });

      if (!categories || categories.length === 0) {
        return {
          status: 404,
          message: "No categories found for this restaurant",
          data: [],
        };
      }

      return {
        status: 200,
        message: "Categories fetched successfully",
        data: categories,
      };
    } catch (err) {
      console.error("getCategoriesByRestaurantId Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  addItem: async (user, data) => {
    try {
      let restaurantId = user?.restaurantId;

      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({
          ownerId: new mongoose.Types.ObjectId(user._id),
        });
        if (!restaurant) {
          return {
            status: 404,
            message: "Restaurant not found for this owner",
            data: null,
          };
        }
        restaurantId = restaurant._id;
      }

      const categoryId = data.categoryId;
      const category = await Menucategory.findOne({
        _id: categoryId,
        restaurantId,
      });

      if (!category)
        return { status: 400, message: "Invalid category", data: null };

      const existingItem = await MenuItem.findOne({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        name: data.name,
      });
      if (existingItem)
        return { status: 400, message: "Item already exists", data: null };

      const item = await MenuItem.create({
        ...data,
        restaurantId,
      });

      const populatedItem = await item.populate(
        "categoryId",
        "name description image"
      );

      return {
        status: 201,
        message: "Item added successfully",
        data: populatedItem,
      };
    } catch (err) {
      console.error("addItem Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  getItems: async (user, categoryId = null) => {
    try {
      let restaurantId = user?.restaurantId;

      if (!restaurantId) {
        const restaurant = await Restaurant.findOne({
          ownerId: user._id,
        });
        if (!restaurant) {
          return {
            status: 404,
            message: "Restaurant not found for this owner",
            data: [],
          };
        }
        restaurantId = restaurant._id;
      }

      let query = {
        restaurantId,
        isAvailable: true,
      };

      if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        query.categoryId = categoryId;
      }

      const items = await MenuItem.find(query).populate(
        "categoryId",
        "name description image"
      );

      return {
        status: 200,
        message: "Items fetched successfully",
        data: items,
      };
    } catch (err) {
      console.error("getItems Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

 getItemById: async (itemId, user) => {
    try {
  
      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return { status: 400, message: "Invalid item ID", data: null };
      }


      if (!user?.restaurantId) {
        return { status: 400, message: "Restaurant ID missing in user", data: null };
      }

      
      const item = await MenuItem.findOne({
        _id: itemId,
        restaurantId: user.restaurantId,
        isAvailable: true, 
      }).populate("categoryId", "name description image");

      if (!item) {
        return { status: 404, message: "Item not found", data: null };
      }

 
      return { status: 200, message: "Item fetched successfully", data: item };
    } catch (err) {
      console.error("getItemById Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  getFullMenu: async (restaurantId) => {
    try {
      const categories = await Menucategory.find({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        isActive: true,
      }).sort({ sortOrder: 1 });

      const items = await MenuItem.find({
        restaurantId: new mongoose.Types.ObjectId(restaurantId),
        isAvailable: true,
      }).populate("categoryId", "name description image");

      const fullMenu = categories.map((cat) => ({
        ...cat.toObject(),
        items: items.filter(
          (i) => i.categoryId._id.toString() === cat._id.toString()
        ),
      }));

      return {
        status: 200,
        message: "Full menu fetched successfully",
        data: fullMenu,
      };
    } catch (err) {
      console.error("getFullMenu Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  updateCategory: async (categoryId, data, user) => {
    try {
      const category = await Menucategory.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(categoryId),
          restaurantId: new mongoose.Types.ObjectId(user.restaurantId),
        },
        data,
        { new: true }
      );
      if (!category)
        return { status: 404, message: "Category not found", data: null };

      return {
        status: 200,
        message: "Category updated successfully",
        data: category,
      };
    } catch (err) {
      console.error("updateCategory Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  updateItem: async (itemId, data, user) => {
    try {
      if (data.categoryId) {
        const category = await Menucategory.findOne({
          _id: new mongoose.Types.ObjectId(data.categoryId),
          restaurantId: new mongoose.Types.ObjectId(user.restaurantId),
        });
        if (!category)
          return { status: 400, message: "Invalid category", data: null };
      }

      const item = await MenuItem.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(itemId),
          restaurantId: new mongoose.Types.ObjectId(user.restaurantId),
        },
        data,
        { new: true }
      ).populate("categoryId", "name description image");

      if (!item) return { status: 404, message: "Item not found", data: null };

      return { status: 200, message: "Item updated successfully", data: item };
    } catch (err) {
      console.error("updateItem Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  deleteCategory: async (categoryId, user) => {
    try {
      const category = await Menucategory.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(categoryId),
          restaurantId: new mongoose.Types.ObjectId(user.restaurantId),
        },
        { isActive: false },
        { new: true }
      );
      if (!category)
        return { status: 404, message: "Category not found", data: null };

      return {
        status: 200,
        message: "Category deleted successfully",
        data: category,
      };
    } catch (err) {
      console.error("deleteCategory Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },

  deleteItem: async (itemId, user) => {
    try {
      const item = await MenuItem.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(itemId),
          restaurantId: new mongoose.Types.ObjectId(user.restaurantId),
        },
        { isAvailable: false },
        { new: true }
      );
      if (!item) return { status: 404, message: "Item not found", data: null };

      return { status: 200, message: "Item deleted successfully", data: item };
    } catch (err) {
      console.error("deleteItem Service Error:", err);
      return { status: 500, message: err.message, data: null };
    }
  },
};

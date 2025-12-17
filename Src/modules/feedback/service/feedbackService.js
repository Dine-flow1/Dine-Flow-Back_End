import Feedback from "../models/feedbackModel.js";

const feedbackService = {
  createFeedback: async (data) => {
    try {
      const feedback = new Feedback(data);
      await feedback.save();
      return feedback;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getFeedbackByRestaurant: async (restaurantId) => {
    try {
      return await Feedback.find({ restaurantId })
        .populate("user", "name email")
        .populate("menuItemId", "itemName");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getRestaurantOnlyFeedback: async (restaurantId) => {
    try {
      return await Feedback.find({ restaurantId, type: "restaurant" })
        .populate("user", "name email");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getFeedbackByMenuItem: async (menuItemId) => {
    try {
      return await Feedback.find({ menuItemId, type: "menu" })
        .populate("user", "name email");
    } catch (error) {
      throw new Error(error.message);
    }
  },  
};

export default feedbackService;

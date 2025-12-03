import feedbackService from "../service/feedbackService.js";

export const addFeedback = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { email, restaurantId, menuItemId, comment, anonymous, type } = req.body;

    if (!["restaurant", "menu"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback type",
      });
    }

    if (type === "menu" && !menuItemId) {
      return res.status(400).json({
        success: false,
        message: "menuItemId is required for menu feedback",
      });
    }

    const feedbackData = {
      restaurantId,
      comment,
      anonymous,
      type,
    };

    if (type === "menu") feedbackData.menuItemId = menuItemId;

    if (!anonymous) {
      if (userId) feedbackData.user = userId; 
      else if (email) feedbackData.email = email;
    }

    const feedback = await feedbackService.createFeedback(feedbackData);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getAllFeedbackForRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const feedbacks = await feedbackService.getFeedbackByRestaurant(restaurantId);
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRestaurantOnlyFeedback = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const feedbacks = await feedbackService.getRestaurantOnlyFeedback(restaurantId);
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMenuItemFeedback = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const feedbacks = await feedbackService.getFeedbackByMenuItem(menuItemId);
    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import RestaurantSubscription from '../models/subscription.js';
import subscriptionService from '../service/subscriptionService.js';

export const initiateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const restaurantId = req.user?.id;

    if (!restaurantId) return res.status(401).json({ message: "Unauthorized" });
    if (!plan) return res.status(400).json({ message: "Plan is required" });

    const paymentData = await subscriptionService.initiatePayment(restaurantId,plan);

    return res.status(200).json({
      success: true,
      message: "Subscription payment initiated",
      data: paymentData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    const subscription = await subscriptionService.verifyPayment(req.body);

    return res.status(200).json({
      success: true,
      message: "Subscription activated successfully",
      data: subscription
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getSubscriptionStatus = async (req, res) => {
  try {
    const restaurantId = req.user?.id;

    if (!restaurantId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const subscription = await RestaurantSubscription.findOne({
      restaurant: restaurantId,
      status: "active",
      endDate: { $gt: new Date() },
    });

    return res.status(200).json({
      hasActiveSubscription: !!subscription,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


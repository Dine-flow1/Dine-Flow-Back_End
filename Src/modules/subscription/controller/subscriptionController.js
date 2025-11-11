import subscriptionService from '../service/subscriptionService.js';

export const initiateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;
    const restaurantId = req.user.id;

    if (!plan) return res.status(400).json({ message: "Plan is required" });

    const paymentData = await subscriptionService.initiatePayment(restaurantId, plan);

    res.status(200).json({
      success: true,
      message: "Subscription payment initiated",
      data: paymentData
    });
  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const subscription = await subscriptionService.verifyPayment(req.body);

    res.status(200).json({
      success: true,
      message: "Subscription payment verified successfully",
      subscription
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

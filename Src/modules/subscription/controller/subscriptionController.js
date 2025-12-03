import subscriptionService from '../service/subscriptionService.js';

export const initiateSubscription = async (req, res) => {
  try {
    const { planId } = req.body; // planId instead of "plan"
    const restaurantId = req.user.id;

    if (!planId) return res.status(400).json({ message: "Plan ID is required" });

    const paymentData = await subscriptionService.initiatePayment(restaurantId, planId);

    res.status(200).json({
      success: true,
      message: "Subscription payment initiated",
      data: paymentData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

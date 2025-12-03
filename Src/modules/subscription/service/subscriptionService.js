import Razorpay from 'razorpay';
import crypto from 'crypto';
import subscription from '../models/subscription.js';
import subscriptionPlan from '../models/subscriptionPlan.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const subscriptionService = {
  initiatePayment: async (restaurantId, planId) => {

    const plan = await subscriptionPlan.findById(planId);
    if (!plan) throw new Error("Invalid Subscription Plan");

    const amount = plan.price;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `sub_${restaurantId}_${Date.now()}`,
    });

    const subscription = await RestaurantSubscription.create({
      restaurant: restaurantId,
      plan: planId,
      amount,
      status: "pending"
    });

    return {
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subscriptionId: subscription._id
    };
  },

  verifyPayment: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId }) => {

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const subscription = await RestaurantSubscription.findById(subscriptionId)
      .populate("plan");

    if (!subscription) throw new Error("Subscription not found");

    const duration = subscription.plan.durationMonths;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(now.getMonth() + duration);

    subscription.status = "active";
    subscription.startDate = now;
    subscription.endDate = endDate;
    subscription.paymentId = razorpay_payment_id;

    await subscription.save();

    return subscription;
  }
};

export default subscriptionService;

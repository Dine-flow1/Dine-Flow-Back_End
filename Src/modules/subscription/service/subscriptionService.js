import Razorpay from 'razorpay';
import crypto from 'crypto';
import RestaurantSubscription from '../models/subscription.js';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const subscriptionService = {

  initiatePayment: async (restaurantId, plan) => {

    // Validate plan
    if (!["699", "1199"].includes(plan)) {
      throw new Error("Invalid subscription plan");
    }

    const amount = Number(plan);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `sub_${Date.now()}`,
    });

    // Create DB record (pending)
    const subscription = await RestaurantSubscription.create({
      restaurant: restaurantId,
      plan,
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

  verifyPayment: async ({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionId
  }) => {

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    const subscription = await RestaurantSubscription.findById(subscriptionId);
    if (!subscription) throw new Error("Subscription not found");

    // PLAN = 699 => 6 months
    // PLAN = 1199 => 12 months
    const duration = subscription.plan === "699" ? 6 : 12;

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

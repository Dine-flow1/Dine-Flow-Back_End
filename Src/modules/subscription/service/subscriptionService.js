import Razorpay from 'razorpay';
import crypto from 'crypto';
import Subscription from '../models/subscription.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});

const subscriptionPlans = {
    "6_months": 499,
    "1_year": 899
};

const subscriptionService = {
    initiatePayment: async (restaurantId, plan) => {
        if (!subscriptionPlans[plan]) throw new Error('Invalid subscription plan');

        const amount = subscriptionPlans[plan];

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `sub_${restaurantId.toString().slice(-6)}_${Date.now()}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const subscription = new Subscription({
            restaurantId,
            subscriptionPlan: plan,
            amount,
            status: 'pending',
        });

        await subscription.save();

        return {
            key: process.env.RAZORPAY_KEY_ID,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            subscriptionId: subscription._id
        };
    },

    verifyPayment: async (razorpayResponse) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = razorpayResponse;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            throw new Error("Payment verification failed — signature mismatch");
        }

        const now = new Date();
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) throw new Error('Subscription not found');

        let endDate;
        if (subscription.subscriptionPlan === "6_months") {
            endDate = new Date(now.setMonth(now.getMonth() + 6));
        } else {
            endDate = new Date(now.setFullYear(now.getFullYear() + 1));
        }

        subscription.status = 'active';
        subscription.startDate = new Date();
        subscription.endDate = endDate;
        subscription.paymentId = razorpay_payment_id;

        await subscription.save();

        return subscription;
    }
};

export default subscriptionService;

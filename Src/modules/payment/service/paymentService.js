import Payment from "../model/paymentModel.js";
import razorpay from "../../../config/razorpay.js";
import crypto from "crypto";

const paymentService = {
  // ✅ Step 1: Create Razorpay Order
  initiatePayment: async (orderId, user, amount, restaurantId) => {
    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${orderId}`,
    };

    // 1️⃣ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create(options);

    // 2️⃣ Save in DB
    const payment = new Payment({
      orderId,
      userId: user._id,
      restaurantId,
      amount,
      paymentStatus: "pending",
      transactionId: razorpayOrder.id,
    });

    await payment.save();

    // 3️⃣ Send order info back to frontend
    return {
      key: process.env.RAZORPAY_KEY_ID,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  },

  // ✅ Step 2: Verify Razorpay Payment
  verifyPayment: async (razorpayResponse) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      razorpayResponse;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      throw new Error("Payment verification failed — signature mismatch");
    }

    // ✅ Update payment in DB
    const payment = await Payment.findOneAndUpdate(
      { transactionId: razorpay_order_id },
      {
        paymentStatus: "completed",
        transactionId: razorpay_payment_id,
      },
      { new: true }
    );

    return payment;
  },

  // ✅ Step 3: Refund Logic
  refundPayment: async (paymentId) => {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new Error("Payment not found");

    // Razorpay refund API call
    await razorpay.payments.refund(payment.transactionId, {
      amount: payment.amount * 100, // in paise
      speed: "optimum",
    });

    payment.paymentStatus = "refunded";
    return await payment.save();
  },

  // ✅ Get all payments for a restaurant
  getPaymentsByRestaurant: async (restaurantId) => {
    return await Payment.find({ restaurantId }).sort({ createdAt: -1 });
  },

  // ✅ Revenue stats (optional)
  getRevenueStats: async (restaurantId, dateRange) => {
    const match = { restaurantId };

    if (dateRange?.from && dateRange?.to) {
      match.createdAt = {
        $gte: new Date(dateRange.from),
        $lte: new Date(dateRange.to),
      };
    }

    return await Payment.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);
  },

  getPaymentDetails: async (paymentId) => {
    return await Payment.findById(paymentId);
  },
};

export default paymentService;

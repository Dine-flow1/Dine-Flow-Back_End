const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'pro', 'enterprise'],
    default: 'basic',
  },
  status: {
    type: String,
    enum: ['trial', 'active', 'expired', 'canceled'],
    default: 'trial',
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  trialEndsAt: Date,
  amount: { type: Number, default: 0 },
  paymentGatewayId: String, // e.g., Razorpay/Stripe ID
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);

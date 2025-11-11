import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  subscriptionPlan: {
    type: String,
    enum: ['6_months', '1_year'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'canceled'],
    default: 'pending',
  },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  amount: { type: Number, default: 0 },
  paymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Subscription', SubscriptionSchema);

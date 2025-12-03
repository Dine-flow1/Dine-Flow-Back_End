import express from 'express';
import { initiateSubscription, verifySubscriptionPayment } from '../controller/subscriptionController.js';
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
const router = express.Router();

router.post(
  '/subInitiate',
  authMiddleware,
  authorizeRoles('restaurant_owner'),
  initiateSubscription
);

router.post(
  '/subVerify',
  authMiddleware,
  authorizeRoles('restaurant_owner'),
  verifySubscriptionPayment
);


router.get("/subscription-plans", async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

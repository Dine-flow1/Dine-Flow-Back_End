import express from 'express';
import { initiateSubscription, verifySubscriptionPayment,getSubscriptionStatus } from '../controller/subscriptionController.js';
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

router.get(
  "/status",
  authMiddleware,
  authorizeRoles("restaurant_owner"),
  getSubscriptionStatus
);

router.get("/subscription-plans", async (req, res) => {
  return res.status(200).json([
    { plan: "699", duration: 6, price: 699 },
    { plan: "1199", duration: 12, price: 1199 },
  ]);
});

export default router;

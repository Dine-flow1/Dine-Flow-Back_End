import express from 'express';
import { initiateSubscription, verifySubscriptionPayment } from '../controller/subscriptionController.js';
import {
  authMiddleware,
  authorizeRoles,
} from "../../../middleware/authmiddleware.js";
const router = express.Router();

// Only restaurants can initiate subscription
router.post(
  '/subInitiate',
  authMiddleware,
  authorizeRoles('restaurant_owner'), // allow only restaurant role
  initiateSubscription
);

router.post(
  '/subVerify',
  authMiddleware,
  authorizeRoles('restaurant_owner'),
  verifySubscriptionPayment
);

export default router;

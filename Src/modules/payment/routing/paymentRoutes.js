import express from "express";
import {
  initiatePayment,
  verifyPayment,
  refundPayment,
} from "../controller/paymentController.js";
import { authMiddleware } from "../../../middleware/authmiddleware.js";

const router = express.Router();

router.post("/initiate",authMiddleware, initiatePayment);
router.post("/verify", verifyPayment);
router.post("/refund/:id", refundPayment);

export default router;

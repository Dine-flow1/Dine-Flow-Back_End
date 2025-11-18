import express from "express";
import connectDB from "./config/ConnectDb.js";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"
import Restaurantrouter from "./modules/Restaurant/routing/restaurantRoutes.js";
import authRouting from "./modules/Auth/routing/authrouting.js";
import ownerRoutes from "./modules/saasOwner/routing/saasRouting.js";
import paymentRoutes from "./modules/payment/routing/paymentRoutes.js"
import menuRoutin from "./modules/Menu/routing/menuRouting.js";
import orderRouting from "./modules/Orders/routing/orderRouting.js";
import subscriptionRoutes from "./modules/subscription/routes/subscriptionRoutes.js"
import feedbackRoutes from './modules/feedback/routes/feedbackRoutes.js'

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouting);

app.use("/api/restaurants", Restaurantrouter);
app.use("/api/owner", ownerRoutes);
app.use("/api/menu", menuRoutin);
app.use("/api/payments", paymentRoutes);
app.use("/api/order", orderRouting);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/feedback", feedbackRoutes);







connectDB();

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

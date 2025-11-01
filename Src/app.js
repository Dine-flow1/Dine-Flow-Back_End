import express from "express";
import connectDB from "./config/ConnectDb.js";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser"
import Restaurantrouter from "./modules/Restaurant/routing/restaurantRoutes.js";
import authRouting from "./modules/Auth/routing/authrouting.js";
import ownerRoutes from "./modules/saasOwner/routing/saasRouting.js";
import menuRoutin from "./modules/Menu/routing/menuRouting.js";
import { authMiddleware } from "./middleware/authmiddleware.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouting);
app.use("/api/restaurants", Restaurantrouter);
app.use("/api/owner", ownerRoutes);
app.use("/api/menu", menuRoutin);




connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

import express from "express";
import connectDB from "./config/ConnectDb.js";
import dotenv from "dotenv"; 

import Restaurantrouter from "./modules/Restaurant/routing/restaurantRoutes.js";
import authRouting from "./modules/Auth/routing/authrouting.js";
import ownerRoutes from "./modules/saasOwner/routing/saasRouting.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRouting);
app.use("/api/restaurants", Restaurantrouter);
app.use("/api/owner", ownerRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

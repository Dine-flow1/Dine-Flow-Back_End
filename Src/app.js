import express from "express"
import mongoose from "mongoose"
import connectDB from "./config/ConnectDb.js"
import dontenv from "dotenv"
import Restaurantrouter from "./modules/Restaurant/routing/restaurantRoutes.js"
import authRouting from "./modules/Auth/routing/authrouting.js"




dontenv.config()
const app = express()

app.use(express.json());

app.use("/api/auth", authRouting);
app.use("/api/restaurants", Restaurantrouter);


connectDB()

const PORT = process.env.PORT || 5000 
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})



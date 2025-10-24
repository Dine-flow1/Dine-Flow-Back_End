import express from "express"
import mongoose from "mongoose"
import connectDB from "./config/ConnectDb.js"
import dontenv from "dotenv"
dontenv.config()
const app = express()

connectDB()

const PORT = process.env.PORt || 5000 
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
    

})



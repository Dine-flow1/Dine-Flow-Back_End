import express from "express"
import * as authController from "../controllers/auth.controller.js"


const authRouting = express.Router()
authRouting.post("/register",authController.register)
authRouting.post("/login",authController.login)
authRouting.post("/forgot-password",authController.forgotPassword)
authRouting.post("/reset-password",authController.resetPassword)

export default authRouting
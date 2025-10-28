import express from "express";
import { loginOwner } from "../controller/saasController.js";

const router = express.Router();

router.post("/ownerLogin", loginOwner);

export default router;

import { ownerLoginSchema } from "../validation/saasValidation.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) throw new Error(error.details.map(d => d.message).join(", "));
};

export const loginOwner = async (req, res) => {
  try {
    validate(ownerLoginSchema, req.body);

    const { email, password } = req.body;

    if (email !== process.env.OWNER_EMAIL || password !== process.env.OWNER_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: "saas_owner", role: "owner" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("ownerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Owner logged in successfully",
      data: {
        email,
        role: "owner",
      },
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

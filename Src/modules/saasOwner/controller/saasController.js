import { ownerLoginSchema } from "../validation/saasValidation.js";
import dotenv from "dotenv";
dotenv.config();

const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) throw new Error(error.details.map(d => d.message).join(", "))
};

export const loginOwner = async (req, res) => {
  try {
    validate(ownerLoginSchema, req.body);

    const { email, password } = req.body;

    if (email === process.env.OWNER_EMAIL && password === process.env.OWNER_PASSWORD) {
      return res.status(200).json({
        success: true,
        data: { email, role: "owner" }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

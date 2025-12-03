import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authOwner = (req, res, next) => {
  try {
    const token = req.cookies.ownerToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "owner") {
      return res.status(403).json({ message: "Access denied: Not SaaS Owner" });
    }

    req.owner = {
      email: process.env.OWNER_EMAIL,
      role: "owner"
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired owner token" });
  }
};

import jwt from "jsonwebtoken";
import UserModel from "../modules/Users/Model/UsersSchema.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    // Check both header and cookie
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(403).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

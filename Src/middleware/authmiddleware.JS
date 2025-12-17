import jwt from "jsonwebtoken";
import UserModel from "../modules/Users/Model/UsersSchema.js";;

export const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    // ✅ FIX: READ _id (NOT userId)
    const userId = decoded._id;
    // console.log("USER ID:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      userId: user._id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("AuthMiddleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};



export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    //     console.log("User role:", req.user.role);
    // console.log("Allowed roles:", allowedRoles);
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
};

import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import UserModel from "../../Users/Model/UsersSchema.js";
import sendEmail from "../utils/email.js";

const authService = {
  register: async ({
    fullName,
    email,
    password,
    confirmPassword,
    contact,
    profileImage,
    address,
    role,
  }) => {
    // 1️⃣ Check confirm password
    if (password !== confirmPassword) {
      throw new Error("Password & Confirm Password do not match");
    }

    // 2️⃣ Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) throw new Error("Email already registered");

    // 3️⃣ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // 4️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 5️⃣ Create new user
    const user = await UserModel.create({
      fullName,
      email,
      password: hashed,
      contact,
      profileImage,
      address,
      role: "customer",
      verifyOtp: otp,
      verifyOtpExpireAt: otpExpiry,
      isAccountVerified: false,
    });

    // 6️⃣ Send OTP Email
    await sendEmail(
      email,
      "Your DineFlow OTP Verification",
      `Hi ${fullName}`,
      `Your verification OTP is: ${otp}. It is valid for 10 minutes.`
    );

    return {
      userId: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      message: "OTP Sent to your email.",
    };
  },
  verifyOtp: async ({ email, otp }) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");

    console.log("Type of stored OTP:", typeof user.verifyOtp); 
    console.log("Type of stored OTP:", typeof otp); 

    // Compare as strings
    if (user.verifyOtp !== otp) throw new Error("Invalid OTP");

    if (user.verifyOtpExpireAt < Date.now()) throw new Error("OTP expired");

    // Update status
    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpireAt = null;

    await user.save();

    return {
      message: "OTP verified successfully. You can now login.",
    };
  },

  login: async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User Not Found");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid Password");

    const token = Jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "15m" }
    );
    await sendEmail(
      email,
      "Login Notification",
      `Hi ${user.fullName},`,
      "You just logged in to your DineFlow account."
    );
    return {
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  },

  forgotPassword: async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("No account found with that email ");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    await sendEmail(
      email,
      "Password Reset Request",
      `Hi ${user.fullName},`,
      `Your OTP for password reset is <b>${otp}</b>. It expires in 15 minutes.`
    );
    return { message: "OTP sent to your email" };
  },
  resetPassword: async (otp, newPasword) => {
    const user = await UserModel.findOne({
      resetOtp: otp,
      resetOtpExpireAt: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalied or Expried OTP");
    user.password = await bcrypt.hash(newPasword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();
    return { message: "Password reset successfully" };
  },
  logout: async () => {
    return { message: "Logged out successfully" };
  },
};
export default authService;

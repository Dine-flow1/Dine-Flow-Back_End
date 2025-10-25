import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import UserModel from "../../Users/Model/UsersSchema";
import sendEmail from "../utils/email";

const authServiceww = {
  register: async ({
    fullName,
    email,
    password,
    contact,
    profileImage,
    address,
    role,
  }) => {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) throw new Error("Email already registered ");

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email,
      password: hashed,
      contact,
      profileImage,
      address,
      role,
    });
    await sendEmail(email, "Welcome!", "Thank you for registering");
    return { userId: user_id, email: user.email };
  },
  login: async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User Not Found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid Password");

    const token = Jwt.sign(
      { id: user_id, role: user.role },
      process.env.JWR_SECRET,
      { expiresIn: "7d" }
    );
    await sendEmail(email, "Login Alert", "You just logged in your account");
    return { token, user };
  },
  forgotPassword: async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("No account found with that email ");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();
    await sendEmail(email, "Password Reset ", `Your otp is${otp}`);
    return true;
  },
  resetPassword: async (otp, newPasword) => {
    const user = await UserModel.findOne({
      resetOtp: otp,
      resetOtpExpireAt: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalied or Expried OTP");
    user.password = await bcrypt.compare(newPasword, 10);
    user.resetOtp = undefined;
    user.resetOtpExpireAt = undefined;
    await user.save();
    return true;
  },
};
export default authService;

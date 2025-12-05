import bcrypt from "bcrypt";
import Restaurant from "../models/restaurantmodel.js";
import UserModel from "../../Users/Model/UsersSchema.js";
import sendEmail from "../utils/email.js";

const restaurantService = {
  sendOtp: async (email, phone) => {
    let user = await UserModel.findOne({ email });

    if (user && user.isAccountVerified)
      throw new Error("Email already registered");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    if (user) {
      // Update existing unverified user
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = otpExpires;
      user.contact = phone;
      await user.save();
    } else {
      // Create new temp user
      user = await UserModel.create({
        fullName: "Temp",
        email,
        contact: phone,
        role: "restaurant_owner",
        isAccountVerified: false,
        verifyOtp: otp,
        verifyOtpExpireAt: otpExpires,
      });
    }

    await sendEmail(
      email,
      "Your Verification OTP",
      `Your OTP is <b>${otp}</b>, valid for 5 minutes.`
    );

    return { message: "OTP sent successfully", userId: user._id };
  },

  register: async (data) => {
    const { restaurantData, ownerData } = data;

    if (!ownerData || !restaurantData)
      throw new Error("Missing ownerData or restaurantData");

    const existingUser = await UserModel.findOne({ email: ownerData.email });
    if (existingUser)
      throw new Error("Owner email already registered as a user");

    const hashedPassword = await bcrypt.hash(ownerData.password, 10);

    const user = await UserModel.create({
      fullName: ownerData.fullName,
      email: ownerData.email,
      password: hashedPassword,
      contact: ownerData.phone,
      role: "restaurant_owner",
      isAccountVerified: false,
    });

    const restaurant = await Restaurant.create({
      ...restaurantData,
      ownerId: user._id,
      isVerified: false,
      status: "pending_verification",
    });

    return {
      message: "OTP sent to your email for verification.",
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      ownerEmail: ownerData.email,
      userId: user._id,
      role: user.role,
    };
  },
  // ---------------------- VERIFY OTP ----------------------
  verifyOtp: async (email, otp) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("OTP not requested");

    if (user.isAccountVerified) throw new Error("Already verified");

    if (user.verifyOtp !== otp) throw new Error("Invalid OTP");

    if (user.verifyOtpExpireAt < Date.now()) throw new Error("OTP expired");

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;

    await user.save();

    return {
      message: "Email verified successfully",
      email,
      userId: user._id,
    };
  },

  login: async (data) => {
    const { email, password } = data;

    // 1️⃣ Find restaurant by owner's email
    const restaurant = await Restaurant.findOne({ "owner.email": email });
    if (!restaurant) throw new Error("User Not Found");

    // 2️⃣ Check if account verified
    if (!restaurant.owner.isAccountVerified) {
      throw new Error("Please verify your email before logging in");
    }

    // 3️⃣ Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      restaurant.owner.password
    );
    if (!isPasswordValid) throw new Error("Invalid credentials");

    // 4️⃣ Create JWT token
    const token = jwt.sign(
      {
        id: restaurant._id,
        role: restaurant.owner.role,
        email: restaurant.owner.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      message: "Login successful",
      token,
      restaurantName: restaurant.restaurantName,
      owner: {
        fullName: restaurant.owner.fullName,
        email: restaurant.owner.email,
        role: restaurant.owner.role,
      },
    };
  },

  addBranch: async (restaurantId, branchData) => {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    restaurant.branches.push(branchData);
    await restaurant.save();
    return restaurant;
  },

  getAll: async () => {
    return await Restaurant.find().populate("ownerId", "fullName email role");
  },

  getById: async (id) => {
    const restaurant = await Restaurant.findById(id).populate(
      "ownerId",
      "fullName email role"
    );
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  },
};

export default restaurantService;

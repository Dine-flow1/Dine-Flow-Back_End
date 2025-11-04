import bcrypt from "bcrypt";
import Restaurant from "../models/restaurantmodel.js";
import UserModel from "../../Users/Model/UsersSchema.js";
import sendEmail from "../utils/email.js";

const restaurantService = {
  register: async (data) => {
    const { restaurantData, ownerData } = data;

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const restaurant = await Restaurant.create({
      ...restaurantData,
      ownerId: user._id,
      otp,
      otpExpires,
      isVerified: false,
      status: "pending_verification",
    });
    console.log("New User ID:", user._id);

    await sendEmail(
      ownerData.email,
      "Verify your DineFlow Account",
      `Hi ${ownerData.fullName},`,
      `Your OTP for DineFlow account verification is <b>${otp}</b>. It will expire in 5 minutes.`
    );

    return {
      message: "OTP sent to your email for verification.",
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      ownerEmail: ownerData.email,
      userId: user._id,
      role: user.role,
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

  verifyOtp: async (email, otp) => {
    const restaurant = await Restaurant.findOne({ "owner.email": email });
    if (!restaurant) throw new Error("Restaurant not found");

    if (restaurant.isVerified) throw new Error("Already verified");

    if (!restaurant.otp || restaurant.otp !== otp)
      throw new Error("Invalid OTP");

    if (!restaurant.otpExpires || restaurant.otpExpires < Date.now())
      throw new Error("OTP expired");

    restaurant.isVerified = true;
    restaurant.otp = undefined;
    restaurant.otpExpires = undefined;

    await restaurant.save();

    return {
      message: "Restaurant verified successfully",
      restaurantId: restaurant._id,
      email: restaurant.owner.email,
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

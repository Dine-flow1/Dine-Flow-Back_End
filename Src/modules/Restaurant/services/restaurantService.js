import bcrypt from "bcrypt";
import Restaurant from "../models/restaurantmodel.js";
import UserModel from "../../Users/Model/UsersSchema.js";
import sendEmail from "../utils/email.js";

const restaurantService = {
  register: async (data) => {
    const { restaurantData, ownerData } = data;

    const existingRestaurant = await Restaurant.findOne({
      "owner.email": ownerData.email,
    });
    if (existingRestaurant) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(ownerData.password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins expiry

    const restaurant = await Restaurant.create({
      ...restaurantData,
      owner: {
        ...ownerData,
        password: hashedPassword,
        role: "restaurant_owner",
      },
      otp,
      otpExpires,
    });

    await sendEmail(
      ownerData.email,
      "Verify your DineFlow Account",
      `Hi ${ownerData.fullName},`,
      `Your OTP for DineFlow account verification is <b>${otp}</b>. It will expire in 5 minutes.`
    );

    return {
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      ownerEmail: ownerData.email,
      message: "OTP sent to your email for verification.",
    };
  },

  verifyOtp: async (email, otp) => {
    const restaurant = await Restaurant.findOne({ "owner.email": email });
    if (!restaurant) throw new Error("Restaurant not found");

    if (restaurant.isVerified) throw new Error("Already verified");

    if (restaurant.otp !== otp) throw new Error("Invalid OTP");
    if (restaurant.otpExpires < Date.now()) throw new Error("OTP expired");

    restaurant.isVerified = true;
    restaurant.otp = undefined;
    restaurant.otpExpires = undefined;
    await restaurant.save();

    return { message: "Restaurant verified successfully" };
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

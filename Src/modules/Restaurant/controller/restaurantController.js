import restaurantService from "../services/restaurantService.js";
import {
  addBranchSchema,
  registerRestaurantSchema,
} from "../validation/validation.js";

export const registerRestaurants = async (req, res) => {
  try {
    const { restaurantData, ownerData } = req.body;
    const result = await restaurantService.register({
      restaurantData,
      ownerData,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("RegisterController Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyRestaurantOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await restaurantService.verifyOtp(email, otp);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("VerifyOtpController Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const addBranch = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("Restaurant ID:", restaurantId);

    const branchData = req.body;

    const result = await restaurantService.addBranch(restaurantId, branchData);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await restaurantService.getAll();
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getById(id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

import restaurantService from "../services/restaurantService.js";
import {
  addBranchSchema,
  registerRestaurantSchema,
} from "../validation/validation.js";

export const sendOtpController = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const result = await restaurantService.sendOtp(email, phone);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const registerRestaurants = async (req, res) => {
  try {
    const result = await restaurantService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyRestaurantOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await restaurantService.verifyOtp(email, otp);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const addBranch = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    console.log("Restaurant ID:", restaurantId);

    const branchData = req.body; // make sure request body contains all branch fields

    const result = await restaurantService.addBranch(restaurantId, branchData);

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
// Get all branches for Owner
export const getOwnerBranches = async (req, res) => {
  try {
    const data = await restaurantService.getAllBranchesByRole({
      role: req.user.role,
      userId: req.user.userId,
      restaurantId: null, // owner doesn't send restaurantId
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCustomerBranches = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const data = await restaurantService.getAllBranchesByRole({
      role: req.user.role,
      userId: req.user.userId,
      restaurantId,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
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

export const getBranchById = async (req, res) => {
  try {
    const { restaurantId, branchId } = req.params;

    const branchData = await restaurantService.getBranchById(
      restaurantId,
      branchId
    );

    res.status(200).json({
      success: true,
      data: branchData,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

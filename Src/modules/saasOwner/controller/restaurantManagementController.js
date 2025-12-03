import {
  getAllRestaurantsService,
  getRestaurantService,
  approveRestaurantService,
  rejectRestaurantService,
  blockRestaurantService,
  unblockRestaurantService,
} from "../service/restaurantManagement.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await getAllRestaurantsService();
    res.status(200).json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const restaurant = await getRestaurantService(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: "Restaurant not found" });
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await approveRestaurantService(req.params.id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await rejectRestaurantService(req.params.id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const blockRestaurant = async (req, res) => {
  try {
    const restaurant = await blockRestaurantService(req.params.id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const unblockRestaurant = async (req, res) => {
  try {
    const restaurant = await unblockRestaurantService(req.params.id);
    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

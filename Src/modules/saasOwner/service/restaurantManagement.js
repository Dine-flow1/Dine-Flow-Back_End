import Restaurant from "../../Restaurant/models/restaurantmodel.js";

export const getAllRestaurantsService = async () => {
  return await Restaurant.find().sort({ createdAt: -1 });
};

export const getRestaurantService = async (id) => {
  return await Restaurant.findById(id);
};

export const approveRestaurantService = async (id) => {
  return await Restaurant.findByIdAndUpdate(
    id,
    { isApproved: true, approvalStatus: "approved", approvedAt: new Date() },
    { new: true }
  );
};

export const rejectRestaurantService = async (id) => {
  return await Restaurant.findByIdAndUpdate(
    id,
    { isApproved: false, approvalStatus: "rejected" },
    { new: true }
  );
};

export const blockRestaurantService = async (id) => {
  return await Restaurant.findByIdAndUpdate(id, { status: "suspended" }, { new: true });
};

export const unblockRestaurantService = async (id) => {
  return await Restaurant.findByIdAndUpdate(id, { status: "active" }, { new: true });
};

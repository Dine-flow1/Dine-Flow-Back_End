import Restaurant from "../../Restaurant/models/restaurantmodel.js";

export const ownerDashboardService = async () => {
  const totalRestaurants = await Restaurant.countDocuments();
  const activeRestaurants = await Restaurant.countDocuments({ status: "active" });
  const suspendedRestaurants = await Restaurant.countDocuments({ status: "suspended" });
  const pendingRestaurants = await Restaurant.countDocuments({ status: "pending_verification" });

  const recentRestaurants = await Restaurant.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    restaurants: {
      total: totalRestaurants,
      active: activeRestaurants,
      suspended: suspendedRestaurants,
      pending: pendingRestaurants,
      recent: recentRestaurants,
    },
  };
};

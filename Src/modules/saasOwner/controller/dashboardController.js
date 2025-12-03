import { ownerDashboardService } from "../service/dashboardService.js";

export const ownerDashboard = async (req, res) => {
  try {
    const data = await ownerDashboardService();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
  
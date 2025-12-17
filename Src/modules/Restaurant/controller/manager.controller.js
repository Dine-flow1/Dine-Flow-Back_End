import {
  createManagerService,
  deleteManagerService,
  getAllManagersService,
  getManagerByIdService,
  toggleManagerStatusService,
  updateManagerService,
} from "../services/manager.service.js";

// CREATE
export const createManager = async (req, res) => {
  try {
    const manager = await createManagerService(
      req.body,
      req.user.userId // already correct 👍
    );
    console.log("REQ USER:", req.user);
    console.log("OWNER ID:", req.user.userId);

    res.status(201).json({
      success: true,
      data: manager,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

// UPDATE
export const updateManager = async (req, res) => {
  try {
    const { managerId } = req.params; // ✅ FIX
    console.log("Manager ID:", managerId);

    const updatedManager = await updateManagerService(managerId, req.body);

    res.status(200).json({
      success: true,
      data: updatedManager,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
// DELETE
export const deleteManager = async (req, res) => {
  const { id } = req.params;
  console.log("mangerid", id);

  try {
    await deleteManagerService(id, req.body);
    res.json({ success: true, message: "Manager deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
export const getAllManagers = async (req, res) => {
  try {
    const managers = await getAllManagersService();
    res.json({ success: true, data: managers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET BY ID
export const getManagerById = async (req, res) => {
  try {
    const manager = await getManagerByIdService(req.params.managerId);
    res.json({ success: true, data: manager });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleManagerStatus = async (req, res) => {
  try {
    const manager = await toggleManagerStatusService(req.params.managerId);

    res.json({
      success: true,
      message: `Manager ${manager.isActive ? "Activated" : "Deactivated"}`,
      data: manager,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

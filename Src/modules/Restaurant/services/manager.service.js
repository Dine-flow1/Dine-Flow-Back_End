
import bcrypt from "bcrypt";
import Restaurant from "../models/restaurantmodel.js";
import UserModel from "../../Users/Model/UsersSchema.js";

// CREATE MANAGER
export const createManagerService = async (data, ownerId) => {
  const { fullName, email, password, branchIds } = data;

  // 🔥 Find restaurant using ownerId (logged-in user)
  const restaurant = await Restaurant.findOne({ ownerId });

  if (!restaurant) {
    throw new Error("Restaurant not found for this owner");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Validate branches belong to this restaurant
  const validBranches = restaurant.branches
    .filter((b) => branchIds.includes(b._id.toString()))
    .map((b) => b._id);

  if (validBranches.length === 0) {
    throw new Error("No valid branches selected");
  }

  return UserModel.create({
    fullName,
    email,
    password: hashedPassword,
    role: "manager",
    managedRestaurant: restaurant._id,
    managedBranches: validBranches,
  });
};

// UPDATE MANAGER
export const updateManagerService = async (managerId, data) => {
  console.log("Service managerId:", managerId);

  const manager = await UserModel.findById(managerId);

  if (!manager) {
    throw new Error("Manager not found");
  }

  if (manager.role !== "manager") {
    throw new Error("User is not a manager");
  }

  if (data.fullName) {
    manager.fullName = data.fullName;
  }

  if (data.branchIds) {
    manager.managedBranches = data.branchIds;
  }

  await manager.save();
  return manager;
};
// DELETE MANAGER
export const deleteManagerService = async (id) => {
  console.log(id);
  
  return UserModel.findByIdAndDelete(id);
};

// GET ALL MANAGERS
export const getAllManagersService = async () => {
  const managers = await UserModel.find({ role: "manager" })
    .populate({
      path: "managedRestaurant",
      select: "restaurantName branches",
    })
    .lean();

  return managers.map((manager) => {
    // If no restaurant or no assigned branches
    if (
      !manager.managedRestaurant ||
      !manager.managedBranches ||
      manager.managedBranches.length === 0
    ) {
      return {
        ...manager,
        managedBranches: [],
      };
    }

    // Convert assigned branch IDs to actual branch objects
    const assignedBranches = manager.managedRestaurant.branches.filter(
      (branch) =>
        manager.managedBranches.some(
          (branchId) => branchId.toString() === branch._id.toString()
        )
    );

    return {
      ...manager,
      managedBranches: assignedBranches.map((branch) => ({
        _id: branch._id,
        branchName: branch.branchName,
      })),
    };
  });
};

// GET MANAGER BY ID
export const getManagerByIdService = async (id) => {
  return UserModel.findById(id).populate("managedRestaurant");
};

// TOGGLE MANAGER STATUS
export const toggleManagerStatusService = async (managerId) => {
  const manager = await UserModel.findOne({
    _id: managerId,
    role: "manager",
  });

  if (!manager) throw new Error("Manager not found");

  manager.isActive = !manager.isActive;
  await manager.save();

  return manager;
};

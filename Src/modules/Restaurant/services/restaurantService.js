import bcrypt from "bcrypt";
import Restaurant from "../models/restaurantmodel.js";
import UserModel from "../../Users/Model/UsersSchema.js";
import sendEmail from "../utils/email.js";

const restaurantService = {
  sendOtp: async (email, phone) => {
    let user = await UserModel.findOne({ email });

    if (user && user.isAccountVerified)
      throw new Error("Email already registered");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    if (user) {
      // Update existing unverified user
      user.verifyOtp = otp;
      user.verifyOtpExpireAt = otpExpires;
      user.contact = phone;
      await user.save();
    } else {
      // Create new temp user
      user = await UserModel.create({
        fullName: "Temp",
        email,
        contact: phone,
        role: "restaurant_owner",
        isAccountVerified: false,
        verifyOtp: otp,
        verifyOtpExpireAt: otpExpires,
      });
    }

    await sendEmail(
      email,
      "Your Verification OTP",
      `Your OTP is <b>${otp}</b>, valid for 5 minutes.`
    );

    return { message: "OTP sent successfully", userId: user._id };
  },

  register: async (data) => {
    const { restaurantData, ownerData } = data;

    if (!ownerData || !restaurantData)
      throw new Error("Missing ownerData or restaurantData");

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

    const restaurant = await Restaurant.create({
      ...restaurantData,
      ownerId: user._id,
      isVerified: false,
      status: "pending_verification",
    });

    return {
      message: "OTP sent to your email for verification.",
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      ownerEmail: ownerData.email,
      userId: user._id,
      role: user.role,
    };
  },
  // ---------------------- VERIFY OTP ----------------------
  verifyOtp: async (email, otp) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("OTP not requested");

    if (user.isAccountVerified) throw new Error("Already verified");

    if (user.verifyOtp !== otp) throw new Error("Invalid OTP");

    if (user.verifyOtpExpireAt < Date.now()) throw new Error("OTP expired");

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;

    await user.save();

    return {
      message: "Email verified successfully",
      email,
      userId: user._id,
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
addBranch: async (restaurantId, branchData) => {
    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    // Optional: Add defaults if missing
    const newBranch = {
      branchName: branchData.branchName,
      branchCode: branchData.branchCode || `BR-${Date.now()}`, // auto generate if missing
      branchType: branchData.branchType || "Restaurant",
      branchStatus: branchData.branchStatus || "active",
      address: branchData.address,
      city: branchData.city || "",
      state: branchData.state || "",
      pincode: branchData.pincode || "",
      landmark: branchData.landmark || "",
      geoLocation: branchData.geoLocation || { type: "Point", coordinates: [0, 0] },
      contactPhone: branchData.contactPhone,
      contactEmail: branchData.contactEmail || "",
      whatsappNumber: branchData.whatsappNumber || "",
      openingHours: branchData.openingHours || {},
      workingDays: branchData.workingDays || [],
      breakTime: branchData.breakTime || null,
      managerId: branchData.managerId || null,
      receptionistIds: branchData.receptionistIds || [],
      kitchenStaffIds: branchData.kitchenStaffIds || [],
      deliveryStaffIds: branchData.deliveryStaffIds || [],
      totalTables: branchData.totalTables || 0,
      totalSeats: branchData.totalSeats || 0,
      seatingType: branchData.seatingType || "",
      services: branchData.services || {},
      paymentMethods: branchData.paymentMethods || [],
      gstNumber: branchData.gstNumber || "",
      fssaiNumber: branchData.fssaiNumber || "",
      serviceCharge: branchData.serviceCharge || 0,
      taxPercentage: branchData.taxPercentage || 0,
      orderPrefix: branchData.orderPrefix || "",
      invoicePrefix: branchData.invoicePrefix || "",
      defaultPrinter: branchData.defaultPrinter || "",
      branchImage: branchData.branchImage || "",
      notes: branchData.notes || "",
    };

    // Push the new branch
    restaurant.branches.push(newBranch);
    await restaurant.save();

    // Return the newly added branch (last element)
    return restaurant.branches[restaurant.branches.length - 1];
  },

getAllBranchesByRole: async ({ role, userId, restaurantId }) => {
  let restaurant;

  // OWNER
  if (role === "restaurant_owner") {
    restaurant = await Restaurant.findOne({ ownerId: userId });
    if (!restaurant) throw new Error("Restaurant not found for owner");
  }

  // CUSTOMER
  if (role === "customer") {
    if (!restaurantId) throw new Error("Restaurant ID is required");
    restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");
  }

  // Map branches with full details
  const branches = await Promise.all(
    restaurant.branches.map(async (b) => {
      // Populate manager info
      const manager = b.managerId
        ? await User.findById(b.managerId).select("fullName email phone")
        : null;

      // Populate receptionists info
      

      return {
        branchId: b._id,
        branchName: b.branchName,
        branchCode: b.branchCode,
        branchType: b.branchType,
        branchStatus: b.branchStatus,
        address: b.address,
        city: b.city,
        state: b.state,
        pincode: b.pincode,
        landmark: b.landmark,
        geoLocation: b.geoLocation,
        contactPhone: b.contactPhone,
        contactEmail: b.contactEmail,
        whatsappNumber: b.whatsappNumber,
        openingHours: b.openingHours,
        workingDays: b.workingDays,
        breakTime: b.breakTime || null,
        manager: manager || null,
        totalTables: b.totalTables,
        totalSeats: b.totalSeats,
        seatingType: b.seatingType || null,
        services: b.services,
        paymentMethods: b.paymentMethods,
        gstNumber: b.gstNumber || null,
        fssaiNumber: b.fssaiNumber || null,
        serviceCharge: b.serviceCharge || 0,
        taxPercentage: b.taxPercentage || 0,
        orderPrefix: b.orderPrefix || "",
        invoicePrefix: b.invoicePrefix || "",
        defaultPrinter: b.defaultPrinter || "",
        branchImage: b.branchImage || null,
        notes: b.notes || "",
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
      };
    })
  );

  return {
    restaurantId: restaurant._id,
    restaurantName: restaurant.restaurantName,
    totalBranches: branches.length,
    branches,
  };
},



  getBranchById: async (restaurantId, branchId) => {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    const branch = restaurant.branches.id(branchId);

    if (!branch) {
      throw new Error("Branch not found");
    }

    return {
      restaurantId: restaurant._id,
      restaurantName: restaurant.restaurantName,
      branch,
    };
  },
};

export default restaurantService;

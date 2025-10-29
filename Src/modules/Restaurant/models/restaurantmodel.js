import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema({
  branchName: { type: String, required: true },
  address: { type: String, required: true },
  geoLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      required: true, 
    },
  },
  contactPhone: { type: String, required: true },
  openingHours: { type: Object }, 
});

const RestaurantSchema = new mongoose.Schema({
 
  restaurantName: { type: String, required: true },
  restaurantType: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  bannerImage: { type: String },
  website: { type: String },


  contactEmail: { type: String, required: true, unique: true },
  contactPhone: { type: String, required: true },

 
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },


ownerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "users", 
  required: true,
},


 
  panNumber: { type: String },  
  gstinNumber: { type: String },
  fssaiNumber: { type: String },
  registrationNumber: { type: String },


  branches: [BranchSchema],

  
  status: {
    type: String,
    enum: ["active", "suspended", "pending_verification"],
    default: "pending_verification",
  },

  isApproved: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
  },
  approvedAt: { type: Date },


  createdAt: { type: Date, default: Date.now },
});


RestaurantSchema.index({ "branches.geoLocation": "2dsphere" });

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;

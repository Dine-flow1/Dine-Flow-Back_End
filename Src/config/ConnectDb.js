import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ DB Connected: ${connection.connection.name}`);
  } catch (error) {
    console.error(`Db Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

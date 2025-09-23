import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.CLOUD_MONGO_URI);
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error(" DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectdb;

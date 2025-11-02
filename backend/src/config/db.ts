import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async (): Promise<void> => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("⚠️ DATABASE_URL is not defined - skipping MongoDB connection");
      return;
    }
    await mongoose.connect(dbUrl);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB", error);
    // Don't exit - let the server run without DB for development
    console.warn("⚠️ Continuing without database connection");
  }
};

export default connectDB;

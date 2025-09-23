import dotenv from "dotenv";
import Razorpay from "razorpay";

// Load environment variables
dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log("✅ Razorpay initialized with key:", process.env.RAZORPAY_KEY_ID);

export default razorpay;

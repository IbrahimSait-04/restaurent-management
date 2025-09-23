import { Payment } from "../models/payment.js";
import crypto from "crypto";
import razorpay from "../config/razorpay.js"; // ✅ use the config

// create payment
export const createPayment = async (req, res) => {
  const { reservation, amount, method } = req.body;

  try {
    let payment = new Payment({ reservation, amount, method });

    if (method === "online") {
      const options = {
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `receipt_${reservation}_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      payment.razorpayOrderId = order.id;
      await payment.save();

      return res.status(201).json({
        message: "Razorpay order created successfully",
        payment,
        order,
      });
    }

    // offline payment
    await payment.save();
    res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// verify payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    try {
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (!payment) return res.status(404).json({ message: "Payment not found" });

      payment.status = "paid";
      payment.razorpayPaymentId = razorpay_payment_id;
      await payment.save();

      return res.status(200).json({
        message: "Payment verified successfully",
        payment,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(400).json({ message: "Invalid signature, payment verification failed" });
  }
};

// get payment by id
export const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId).populate("reservation");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("reservation");
    res.status(200).json({ payments });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import express from 'express';
import { createPayment, getAllPayments, getPaymentById, verifyPayment } from '../controllers/paymentController.js';

const paymentRouter = express.Router();

// Create a payment (offline or online)
paymentRouter.post('/', createPayment);

// Verify online payment (Razorpay)
paymentRouter.post('/verify', verifyPayment);

// Get all payments (Staff/Admin)
paymentRouter.get('/', getAllPayments);

// Get payment by ID
paymentRouter.get('/:paymentId', getPaymentById);

export default paymentRouter;

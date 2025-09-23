import express from 'express';
import { createOrder, getAllOrders, getOrderById } from '../controllers/orderController.js';



const orderRouter = express.Router();

orderRouter.post('/', createOrder);
orderRouter.put('/:id', getOrderById);
orderRouter.get('/', getAllOrders);
orderRouter.get('/:id', getOrderById);

export default orderRouter;
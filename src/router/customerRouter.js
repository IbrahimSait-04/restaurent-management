import express from 'express';
import { customerLogin, customerRegister, deleteCustomer, getAllCustomers, getCustomerById, getCustomerProfile, updateCustomerProfile } from '../controllers/customerController.js';
import {protect} from '../middlewares/authMiddleware.js';

const customerRouter = express.Router();

//customer registeration

customerRouter.post('/', customerRegister);
customerRouter.post('/login', customerLogin);
customerRouter.put('/', updateCustomerProfile);
customerRouter.get("/profile", protect("customer"), getCustomerProfile);
customerRouter.get('/', protect("admin"), getAllCustomers);
customerRouter.get('/:id', protect("admin"), getCustomerById);
customerRouter.delete('/:id', protect("admin"), deleteCustomer);

export default customerRouter;
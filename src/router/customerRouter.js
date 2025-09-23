import express from 'express';
import { customerLogin, customerRegister, deleteCustomer, getCustomerProfile, updateCustomerProfile } from '../controllers/customerController.js';


const customerRouter = express.Router();

//customer registeration

customerRouter.post('/', customerRegister);
customerRouter.post('/login', customerLogin);
customerRouter.put('/', updateCustomerProfile);
customerRouter.get('/', getCustomerProfile);
customerRouter.get('/:id', getCustomerProfile);
customerRouter.delete('/:id', deleteCustomer);

export default customerRouter;
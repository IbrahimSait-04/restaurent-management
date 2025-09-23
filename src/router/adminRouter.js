import express from 'express';
import { adminLogin, createStaff, deleteStaff, getAllStaff, updateAdminProfile, updateStaff } from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';




const adminRouter = express.Router();
adminRouter.post('/login', adminLogin);
adminRouter.put('/', updateAdminProfile);
adminRouter.get('/staff', protect(["admin", "staff"], true), getAllStaff);

//  Only admins can create staff
adminRouter.post('/staff', protect("admin", true), createStaff);

//  Only admins can update staff
adminRouter.put('/staff/:id', protect("admin", true), updateStaff);

//  Only admins can delete staff
adminRouter.delete('/staff/:id', protect("admin", true), deleteStaff);

export default adminRouter;
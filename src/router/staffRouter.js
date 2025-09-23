import express from 'express';
import { getStaffProfile, staffLogin, updateStaffProfile } from '../controllers/staffController.js';
import { protect } from '../middlewares/authMiddleware.js';

const staffRouter = express.Router();


//  Staff login (public)
staffRouter.post('/login', staffLogin);

//get Staff Profile
staffRouter.get('/profile/:id', protect(["admin", "staff"], true), getStaffProfile);

//update Staff Profile
staffRouter.put('/profile/:id', protect(["admin", "staff"], true), updateStaffProfile);


export default staffRouter;

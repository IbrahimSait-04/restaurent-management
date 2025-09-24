import express from "express";
import { adminLogin, createStaff, deleteStaff, getAllStaff, updateAdminProfile, updateStaff, getAdminProfile } from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";

const adminRouter = express.Router();

// Login route (no middleware)
adminRouter.post("/login", adminLogin);

// Admin profile routes
adminRouter.get("/profile", protect("admin"), getAdminProfile);
adminRouter.put("/profile", protect("admin"), updateAdminProfile);

// Staff CRUD routes (only admin)
adminRouter.get("/staff", protect("admin"), getAllStaff);
adminRouter.post("/staff", protect("admin"), createStaff);
adminRouter.put("/staff/:id", protect("admin"), updateStaff);
adminRouter.delete("/staff/:id", protect("admin"), deleteStaff);

export default adminRouter;

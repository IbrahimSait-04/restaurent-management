import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.js";
import { Staff } from "../models/staff.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch =  bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // use generateToken (with role)
    const token = generateToken(admin._id, "admin");

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get Admin Profile
export const getAdminProfile = async (req, res) => {
  const admin = req.admin;
  res.status(200).json({
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
    },
  });
};

//update Admin Profile
export const updateAdminProfile = async (req, res) => {
  const admin = req.admin; // Assume admin is attached via auth middleware
  const { name, email, password } = req.body;

  if (name) admin.name = name;
  if (email) admin.email = email;
  if (password) admin.password = await bcrypt.hash(password, 10);

  await admin.save();
  res.status(200).json({ message: "Admin profile updated successfully" });
};

// Create Staff (only admin)
export const createStaff = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //  prevent duplicate staff
    const staffExists = await Staff.findOne({ email });
    if (staffExists) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = new Staff({ name, email, password: hashedPassword });
    await staff.save();

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update Staff (only admin)
export const updateStaff = async (req, res) => {
  const { staffId } = req.params;
    const { name, email, password } = req.body;
    try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    if (name) staff.name = name;
    if (email) staff.email = email;
    if (password) {
      staff.password = await bcrypt.hash(password, 10);
    }

    await staff.save();
    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Staff (only admin)
export const getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.status(200).json({ staff: staffList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Staff (only admin)
export const deleteStaff = async (req, res) => {
  const { staffId } = req.params;
  try {
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    await staff.remove();
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
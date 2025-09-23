import {Staff} from "../models/staff.js";
import jwt from "jsonwebtoken";


// Staff Login
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await staff.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: staff._id, role: "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: "staff",
      token,
    });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update Staff Profile
export const updateStaffProfile = async (req, res) => {
  const staff = req.staff;
  const { email, password } = req.body;

  try {
    if (email) staff.email = email;
    if (password) staff.password = password;

    await staff.save();

    res.status(200).json({
      message: "Staff profile updated successfully",
      staff: {
        id: staff._id,
        email: staff.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//get Staff Profile
export const getStaffProfile = async (req, res) => {
  const staff = req.staff;
  res.status(200).json({
    staff: {
      id: staff._id,
      email: staff.email,
    },
  });
};
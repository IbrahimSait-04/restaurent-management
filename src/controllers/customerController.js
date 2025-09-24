import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Customer Registration
export const customerRegister = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const customerExists = await Customer.findOne({ email });
    if (customerExists) return res.status(400).json({ message: "Customer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, phone, password: hashedPassword });
    await customer.save();

    const token = generateToken(customer._id, "customer");

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone },
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Customer Login
export const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(customer._id, "customer");

    res.status(200).json({
      message: "Customer logged in successfully",
      token,
      customer: { id: customer._id, name: customer.name, email: customer.email, phone: customer.phone },
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Customer Profile
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = req.user; // fetched by protect middleware

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const { password, ...customerData } = customer.toObject();

    res.status(200).json({ message: "Customer profile retrieved successfully", customer: customerData });
  } catch (error) {
    console.error("Error retrieving customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Update Customer Profile
export const updateCustomerProfile = async (req, res) => {
  try {
    const customer = req.user; // fetched by protect middleware

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const { name, email, phone, password } = req.body;

    // Check if new email is unique
    if (email && email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) return res.status(400).json({ message: "Email already in use" });
    }

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;
    if (password) customer.password = await bcrypt.hash(password, 10);

    await customer.save();

    const { password: _, ...customerData } = customer.toObject();

    res.status(200).json({ message: "Customer profile updated successfully", customer: customerData });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Delete Customer 
export const deleteCustomer = async (req, res) => {
  try {
    const customer = req.user; // fetched by middleware
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    await customer.remove();
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Customers (Admin/Staff) 
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password"); 
    res.status(200).json({ customers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//Get Customer By ID (Admin/Staff)
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id).select("-password");

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json({ customer });
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


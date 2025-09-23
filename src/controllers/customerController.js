import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Customer } from "../models/customer.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Customer Registration
export const customerRegister = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    // Prevent duplicate customer
    const customerExists = await Customer.findOne({ email });
    if (customerExists) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = new Customer({ name, email, phone, password: hashedPassword });
    await customer.save();

    const token = generateToken(customer._id, "customer");

    res.status(201).json({
      message: "Customer registered successfully",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Error registering customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Customer Login
export const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(customer._id, "customer");

    res.status(200).json({
      message: "Customer logged in successfully",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Customer Profile
export const updateCustomerProfile = async (req, res) => {
  const customer = req.customer;
  const { name, email, phone, password } = req.body;

  try {
    // Check if new email is unique
    if (email && email !== customer.email) {
      const emailExists = await Customer.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;

    if (password) {
      customer.password = await bcrypt.hash(password, 10);
    }

    await customer.save();

    // Exclude password from response
    const { password: _, ...customerData } = customer.toObject();

    res.status(200).json({
      message: "Customer profile updated successfully",
      customer: customerData,
    });
  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Customer Profile
export const getCustomerProfile = async (req, res) => {
  const customer = req.customer;
  try {
    // Exclude password from response
    const { password: _, ...customerData } = customer.toObject();

    res.status(200).json({
      message: "Customer profile retrieved successfully",
      customer: customerData,
    });
  } catch (error) {
    console.error("Error retrieving customer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Customer 
export const deleteCustomer = async (req, res) => {
  const customer = req.customer;
  try {
    await customer.remove();
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

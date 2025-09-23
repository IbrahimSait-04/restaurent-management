import { Reservation } from "../models/reservation.js";

// Create Reservation (Customer only)
export const createReservation = async (req, res) => {
  const { date, time, numberOfGuests, specialRequests } = req.body;
  try {
    const reservation = new Reservation({
      customerId: req.user._id, // Use logged-in customer from JWT
      date,
      time,
      numberOfGuests,
      specialRequests,
    });
    await reservation.save();

    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Reservations by Customer (Customer only)
export const getReservationsByCustomer = async (req, res) => {
  const customerId = req.params.customerId;

  // Ensure customer can only access their own reservations
  if (req.user.role === "customer" && req.user._id.toString() !== customerId) {
    return res.status(403).json({ message: "Access forbidden" });
  }

  try {
    const reservations = await Reservation.find({ customerId });
    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Reservation (Customer can update own, Staff/Admin can update status)
export const updateReservation = async (req, res) => {
  const { reservationId } = req.params;
  const { date, time, numberOfGuests, specialRequests, status } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    // Customer can only update their own reservation
    if (req.user.role === "customer" && reservation.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    // Customers cannot update status
    if (status && req.user.role === "customer") {
      return res.status(403).json({ message: "Customers cannot update status" });
    }

    // Update allowed fields
    if (date) reservation.date = date;
    if (time) reservation.time = time;
    if (numberOfGuests) reservation.numberOfGuests = numberOfGuests;
    if (specialRequests) reservation.specialRequests = specialRequests;
    if (status && (req.user.role === "admin" || req.user.role === "staff")) reservation.status = status;

    await reservation.save();
    res.status(200).json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Reservation (Customer can delete own, Admin/Staff can delete any)
export const deleteReservation = async (req, res) => {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    if (req.user.role === "customer" && reservation.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access forbidden" });
    }

    await reservation.remove();
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Reservations (Staff/Admin only)
export const getAllReservations = async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ message: "Access forbidden" });
  }

  try {
    const reservations = await Reservation.find();
    res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


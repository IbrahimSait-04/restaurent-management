import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true  },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    partySize: { type: Number, required: true, min: 1 , max: 12 },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    table: { type: String, },
  },{ timestamps: true });

export const Reservation = mongoose.model("Reservation", reservationSchema);
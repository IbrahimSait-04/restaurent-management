import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    
    name: { type : String, required: true , trim: true},
    email: { type : String, required: true , unique: true},
    phone: { type : String, required: true , maxlength: 10 },
    password: { type : String, required: true , minlength: 6},
} ,{timestamps: true});

export const Customer = mongoose.model("Customer", customerSchema);
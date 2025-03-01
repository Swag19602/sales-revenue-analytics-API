import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  location: String,
  gender: String,
});

export const Customer = mongoose.model("Customer", customerSchema);

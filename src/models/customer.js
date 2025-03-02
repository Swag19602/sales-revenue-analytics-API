import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  age: Number,
  location: String,
  gender: String,
});

export const Customer = mongoose.model("Customer", customerSchema);

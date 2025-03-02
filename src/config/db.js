import mongoose from "mongoose";
import "dotenv/config";
import csv from "csv-parser";
import fs from "fs";
import { Customer } from "../models/customer.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";
const { MONGODB_URL, DB_NAME } = process.env;
const connectDB = async () => {
  try {
    const connectoinInstance = await mongoose.connect(
      `${MONGODB_URL}/${DB_NAME}`
    );
    console.log({
      message: "MongoDB connection established",
      host: connectoinInstance.connection.host,
      port: connectoinInstance.connection.port,
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
export default connectDB;

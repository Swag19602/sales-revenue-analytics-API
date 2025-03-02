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
// **Fix: Use string-based IDs to prevent ObjectId conversion errors**
const transformCustomer = (row) => ({
  _id: row._id?.toString() || new mongoose.Types.ObjectId().toString(),
  name: row.name,
  email: row.email,
  age: parseInt(row.age, 10),
  location: row.location,
  gender: row.gender,
});

const transformProduct = (row) => ({
  _id: row._id?.toString() || new mongoose.Types.ObjectId().toString(),
  name: row.name,
  category: row.category,
  price: parseFloat(row.price),
  stock: parseInt(row.stock, 10),
});

const transformOrder = (row) => {
  try {
    return {
      _id: row._id?.toString() || new mongoose.Types.ObjectId().toString(),
      customerId: row.customerId.toString(), // **Fix: Keep as string**
      products: JSON.parse(row.products.replace(/'/g, '"')).map((product) => ({
        productId: product.productId.toString(), // **Fix: Keep as string**
        quantity: parseInt(product.quantity, 10),
        priceAtPurchase: parseFloat(product.priceAtPurchase),
      })),
      totalAmount: parseFloat(row.totalAmount),
      orderDate: new Date(row.orderDate),
      status: row.status,
    };
  } catch (error) {
    console.error(`❌ Error parsing order:`, row, error.message);
    return null;
  }
};

// **Helper Function: Upload CSV Data to MongoDB**
const uploadCSV = async (filePath, model, transformFn) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const bulkOps = [];
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      try {
        const transformed = transformFn(row);
        if (transformed) {
          bulkOps.push({
            updateOne: {
              filter: { _id: transformed._id }, // Check if the record exists
              update: { $set: transformed }, // Update or insert the new data
              upsert: true, // Insert if not found
            },
          });
        }
      } catch (error) {
        console.error(`❌ Error processing row:`, row, error.message);
      }
    })
    .on("end", async () => {
      try {
        if (bulkOps.length > 0) {
          await model.bulkWrite(bulkOps); // Perform bulk update or insert
          console.log(
            `✅ Successfully processed ${bulkOps.length} records for ${model.collection.name}`
          );
        } else {
          console.log(
            `ℹ️ No valid records to process for ${model.collection.name}`
          );
        }
      } catch (error) {
        console.error(`❌ Error uploading to ${model.collection.name}:`, error);
      }
      mongoose.connection.close();
    });
};

// **Connect to MongoDB & Upload Data**
connectDB().then(() => {
  // uploadCSV("./testing/customers.csv", Customer, transformCustomer);
  // uploadCSV("./testing/products.csv", Product, transformProduct);
  uploadCSV("./testing/orders.csv", Order, transformOrder);
});

export default connectDB;

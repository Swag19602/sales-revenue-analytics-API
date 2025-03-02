import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  _id: String,
  customerId: String,
  products: [
    {
      productId: String,
      quantity: Number,
      priceAtPurchase: Number,
    },
  ],
  totalAmount: Number,
  orderDate: Date,
  status: String,
});

export const Order = mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      quantity: Number,
      priceAtPurchase: Number,
    },
  ],
  totalAmount: Number,
  orderDate: Date,
  status: String,
});

export const Order = mongoose.model("Order", orderSchema);

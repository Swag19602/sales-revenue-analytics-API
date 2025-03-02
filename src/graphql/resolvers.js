import { Customer } from "../models/customer.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import mongoose from "mongoose";

const resolvers = {
  Query: {
    async getCustomerSpending(_, { customerId }) {
      try {
        const result = await Order.aggregate([
          { $match: { customerId, status: "completed" } },
          {
            $group: {
              _id: "$customerId",
              totalSpent: { $sum: "$totalAmount" },
              orderCount: { $sum: 1 },
              lastOrderDate: { $max: "$orderDate" },
            },
          },
          {
            $project: {
              customerId: "$_id",
              totalSpent: 1,
              averageOrderValue: { $divide: ["$totalSpent", "$orderCount"] },
              lastOrderDate: {
                $ifNull: ["$lastOrderDate", new Date(0).toISOString()],
              },
            },
          },
        ]);

        console.log("Aggregation Result:", result);
        return (
          result[0] || {
            customerId,
            totalSpent: 0,
            averageOrderValue: 0,
            lastOrderDate: new Date(0).toISOString(),
          }
        );
      } catch (error) {
        console.error("Error fetching customer spending:", error);
        return null;
      }
    },

    async getCustomerOrders(_, { customerId, page = 1, pageSize = 10 }) {
      const skip = (page - 1) * pageSize;

      const orders = await Order.find({ customerId })
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(); // Ensures we can modify the output object

      // Convert `orderDate` to ISO string
      return orders.map((order) => ({
        ...order,
        orderDate: new Date(order.orderDate).toISOString(), // Fix date format
      }));
    },

    async getTopSellingProducts(_, { limit }) {
      return await Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: { productId: "$_id", name: "$product.name", totalSold: 1 },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
      ]);
    },
    async getSalesAnalytics(_, { startDate, endDate }) {
      try {
        const result = await Order.aggregate([
          {
            $match: {
              orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
              status: "completed",
            },
          },
          {
            $group: {
              _id: "$products.productId",
              revenue: { $sum: "$totalAmount" },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "productDetails",
            },
          },
          { $unwind: "$productDetails" },
          {
            $group: {
              _id: "$productDetails.category",
              revenue: { $sum: "$revenue" },
            },
          },
          {
            $project: {
              category: "$_id",
              revenue: 1,
            },
          },
        ]);

        const totalRevenue = result.reduce(
          (acc, item) => acc + item.revenue,
          0
        );
        const completedOrders = await Order.countDocuments({
          orderDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
          status: "completed",
        });

        return { totalRevenue, completedOrders, categoryBreakdown: result };
      } catch (error) {
        console.error("Error fetching sales analytics:", error);
        return null;
      }
    },
  },
  Mutation: {
    async placeOrder(_, { orderInput }) {
      try {
        const newOrder = new Order({
          _id: new mongoose.Types.ObjectId().toString(),
          customerId: orderInput.customerId,
          products: orderInput.products,
          totalAmount: orderInput.totalAmount,
          orderDate: new Date().toISOString(),
          status: "pending",
        });

        await newOrder.save();
        return newOrder;
      } catch (error) {
        console.error("❌ Error placing order:", error);
        throw new Error("Failed to place order");
      }
    },
  },
};

export default resolvers;

import {Customer} from "../models/customer.js";
import {Order} from "../models/order.js";
import {Product} from "../models/product.js";

const resolvers = {
  Query: {
    async getCustomerSpending(_, { customerId }) {
      const result = await Order.aggregate([
        { $match: { customerId: customerId, status: "completed" } },
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
            lastOrderDate: 1,
          },
        },
      ]);
      return result[0] || null;
    },

    async getTopSellingProducts(_, { limit }) {
      const result = await Order.aggregate([
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
          $project: {
            productId: "$_id",
            name: "$product.name",
            totalSold: 1,
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: limit },
      ]);
      return result;
    },

    async getSalesAnalytics(_, { startDate, endDate }) {
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
            count: { $sum: 1 },
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
      return result;
    },
  },
};

export default resolvers;

import { gql } from "apollo-server-express";

const typeDefs = gql`
type Customer {
  _id: String!
  name: String!
  email: String!
  age: Int!
  location: String!
  gender: String!
}

type OrderProduct {
  productId: String!
  quantity: Int!
  priceAtPurchase: Float!
}

type Order {
  _id: String!
  customerId: String!
  products: [OrderProduct!]!
  totalAmount: Float!
  orderDate: String!
  status: String!
}

type CustomerSpending {
  customerId: String!
  totalSpent: Float!
  averageOrderValue: Float!
  lastOrderDate: String
}

type TopProduct {
  productId: String!
  name: String!
  totalSold: Int!
}

type SalesAnalytics {
  totalRevenue: Float!
  completedOrders: Int!
  categoryBreakdown: [CategoryRevenue!]!
}

type CategoryRevenue {
  category: String!
  revenue: Float!
}

type Query {
  getCustomerSpending(customerId: String!): CustomerSpending
  getCustomerOrders(customerId: String!, page: Int, pageSize: Int): [Order!]!
  getTopSellingProducts(limit: Int!): [TopProduct!]!
  getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
}

input OrderProductInput {
  productId: String!
  quantity: Int!
  priceAtPurchase: Float!
}

input OrderInput {
  customerId: String!
  products: [OrderProductInput!]!
  totalAmount: Float!
}

type Mutation {
  placeOrder(orderInput: OrderInput!): Order
}`;

export default typeDefs;

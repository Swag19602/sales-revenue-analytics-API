import { gql } from "apollo-server-express";

const typeDefs = gql`
  type CustomerSpending {
    customerId: ID!
    totalSpent: Float!
    averageOrderValue: Float!
    lastOrderDate: String!
  }

  type TopProduct {
    productId: ID!
    name: String!
    totalSold: Int!
  }

  type CategoryRevenue {
    category: String!
    revenue: Float!
  }

  type SalesAnalytics {
    totalRevenue: Float!
    completedOrders: Int!
    categoryBreakdown: [CategoryRevenue]
  }
  type Mutation {
    placeOrder(customerId: ID!, products: [OrderProductInput]!): OrderResponse
  }
  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }

  type OrderResponse {
    success: Boolean!
    message: String!
    orderId: ID
  }

  type Query {
    getCustomerSpending(customerId: ID!): CustomerSpending
    getTopSellingProducts(limit: Int!): [TopProduct]
    getSalesAnalytics(startDate: String!, endDate: String!): SalesAnalytics
  }
`;

export default typeDefs;

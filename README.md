## Sales & Revenue Analytics API

    - 📌 Overview
        - This project is a GraphQL API designed for an e-commerce platform to analyze revenue, customer spending behavior, and product sales trends. The API is built using Node.js, MongoDB, and Apollo Server and supports efficient data retrieval using MongoDB aggregation pipelines.
    - 🚀 Features
        - Customer Spending Analytics: Get total spending, last purchase date, and average order value for a customer.

        - Top Selling Products: Retrieve top-selling products based on quantity sold.

        - Sales Analytics: Get total revenue, completed orders, and revenue breakdown by product category.

        - Place Orders: Mutation to create a new order and update stock.

        - Paginated Customer Orders: Fetch customer orders with pagination support.

        - Redis Caching: Sales analytics queries are cached to improve performance.

# Technology Used
    - ✅ Node.js
    - ✅ Express.js
    - ✅ MongoDB & Mongoose
    - ✅ Apollo Server
    - ✅ GraphQL
    - ✅ Postman

# Performance Optimisation
    - Indexes added on customerId and productId fields for efficient lookups.
    - Aggregation Pipelines used for queries like getSalesAnalytics to enhance performance.

# POSTMAN API DOCUMENTATION
 - https://documenter.getpostman.com/view/26867551/2sAYdimUAo
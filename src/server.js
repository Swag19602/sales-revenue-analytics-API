import express from "express";
import { ApolloServer } from "apollo-server-express";
import connectDB from "./config/db.js";
import typeDefs from "./graphql/schema.js";
import resolvers from "./graphql/resolvers.js";

const app = express();
connectDB();

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(4000, () =>
    console.log("Server running on http://localhost:4000/graphql")
  );
});

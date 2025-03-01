import mongoose from "mongoose";
import "dotenv/config";
const { MONGODB_URL, DB_NAME } = process.env;

const connectDB = async () => {
  try {
    const connectoinInstance = await mongoose.connect(
      `${MONGODB_URL}/${DB_NAME}`
    );
    console.log("mongoDb connected", connectoinInstance.connection.host);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;

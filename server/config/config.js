require("dotenv").config();
const mongoose = require("mongoose")


const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("MONGO_URL is missing in .env file");
}

const connection = mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    throw err;
  });

module.exports = {connection}

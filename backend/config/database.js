const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/hrd-track";

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB terhubung");
  } catch (error) {
    console.error("Koneksi MongoDB gagal:", error.message);
    throw error;
  }
};

module.exports = connectDB;

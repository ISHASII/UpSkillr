const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB terhubung");
  } catch (error) {
    console.error("Koneksi MongoDB gagal:", error.message);
    throw error;
  }
};

module.exports = connectDB;

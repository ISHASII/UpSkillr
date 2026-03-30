const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Debug: print whether GOOGLE_CLIENT_ID is loaded (masked)
try {
  const gid = String(process.env.GOOGLE_CLIENT_ID || "").trim();
  if (gid) {
    const masked = "***" + gid.slice(-12);
    console.log("GOOGLE_CLIENT_ID loaded (masked):", masked);
  } else {
    console.log("GOOGLE_CLIENT_ID loaded (masked): NOT SET");
  }
} catch (e) {
  console.log("Error checking GOOGLE_CLIENT_ID:", e.message);
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const apiRoutes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Skill Matcher & Training Hub API berjalan",
  });
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error.message);
    process.exit(1);
  }
};

startServer();

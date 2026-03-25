const express = require("express");

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const trainingModuleRoutes = require("./trainingModuleRoutes");
const progressLogRoutes = require("./progressLogRoutes");
const skillRoutes = require("./skillRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/modules", trainingModuleRoutes);
router.use("/logs", progressLogRoutes);
router.use("/skills", skillRoutes);

module.exports = router;

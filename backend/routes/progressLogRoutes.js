const express = require("express");
const progressLogController = require("../controllers/progressLogController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(progressLogController.getProgressLogsForHR),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Karyawan"),
  asyncHandler(progressLogController.createProgressLogAsKaryawan),
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Karyawan"),
  asyncHandler(progressLogController.updateProgressLogStatusAsKaryawan),
);

module.exports = router;

const express = require("express");
const progressLogController = require("../controllers/progressLogController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");
const { uploadSubmissionFiles } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(progressLogController.getProgressLogsForHR),
);

router.get(
  "/me",
  authMiddleware,
  roleMiddleware("Karyawan"),
  asyncHandler(progressLogController.getProgressLogsForKaryawan),
);

router.get(
  "/module/:moduleId",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(progressLogController.getProgressLogsByModuleForHR),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("Karyawan"),
  asyncHandler(progressLogController.createProgressLogAsKaryawan),
);

router.put(
  "/:id/submission",
  authMiddleware,
  roleMiddleware("Karyawan"),
  uploadSubmissionFiles,
  asyncHandler(progressLogController.submitProgressLogAsKaryawan),
);

router.put(
  "/:id/validation",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(progressLogController.validateProgressLogByHR),
);

module.exports = router;

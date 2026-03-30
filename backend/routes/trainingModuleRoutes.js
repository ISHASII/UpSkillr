const express = require("express");
const trainingModuleController = require("../controllers/trainingModuleController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");
const { uploadModuleMaterials } = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware("HR", "Karyawan"),
  asyncHandler(trainingModuleController.getTrainingModules),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  uploadModuleMaterials,
  asyncHandler(trainingModuleController.createTrainingModule),
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("HR"),
  uploadModuleMaterials,
  asyncHandler(trainingModuleController.updateTrainingModule),
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(trainingModuleController.deleteTrainingModule),
);

module.exports = router;

const express = require("express");
const skillController = require("../controllers/skillController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

// Only HR can manage skills
router.get("/", asyncHandler(skillController.getSkills));
router.post(
  "/",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(skillController.createSkill),
);
router.get("/:id", asyncHandler(skillController.getSkillById));
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(skillController.updateSkill),
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("HR"),
  asyncHandler(skillController.deleteSkill),
);

module.exports = router;

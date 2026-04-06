const express = require("express");
const router = express.Router();
const {
  getMyRecommendation,
  getUserRecommendation,
  getRecommendedModulesForUser,
  getAITextRecommendation,
} = require("../controllers/recommendationController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * GET /api/recommendations/my-recommendation
 * Get AI recommendation untuk user yang login
 */
router.get("/my-recommendation", authMiddleware, getMyRecommendation);

/**
 * GET /api/recommendations/modules
 * Get list modul yang direkomendasikan
 */
router.get("/modules", authMiddleware, getRecommendedModulesForUser);

/**
 * POST /api/recommendations/text-only
 * Get AI text recommendation saja (untuk flexible usage)
 */
router.post("/text-only", authMiddleware, getAITextRecommendation);

/**
 * GET /api/recommendations/user/:userId
 * Get recommendation untuk user tertentu (for HR)
 */
router.get("/user/:userId", authMiddleware, getUserRecommendation);

module.exports = router;

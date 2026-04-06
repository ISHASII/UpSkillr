const User = require("../models/User");
const {
  getAIRecommendation,
  getRecommendedModules,
  getFullRecommendation,
} = require("../services/recommendationService");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * Get AI recommendation untuk user berdasarkan skill mereka
 * @route GET /api/recommendations/my-recommendation
 * @access Private
 */
const getMyRecommendation = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user data
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  // Get full recommendation (AI + modules)
  const recommendation = await getFullRecommendation(user);

  res.status(200).json(recommendation);
});

/**
 * Get AI recommendation untuk user lain (for HR)
 * @route GET /api/recommendations/user/:userId
 * @access Private (HR only)
 */
const getUserRecommendation = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Get user data
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  // Get full recommendation
  const recommendation = await getFullRecommendation(user);

  res.status(200).json({
    ...recommendation,
    userName: user.nama,
    userEmail: user.email,
    userDivision: user.divisi,
  });
});

/**
 * Get recommended modules untuk user
 * @route GET /api/recommendations/modules
 * @access Private
 */
const getRecommendedModulesForUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get user data
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User tidak ditemukan",
    });
  }

  // Get recommended modules
  const modules = await getRecommendedModules(user.skills, user.divisi);

  res.status(200).json({
    success: true,
    modules,
  });
});

/**
 * Get simple AI recommendation text saja (tanpa modules)
 * @route POST /api/recommendations/text-only
 * @access Private
 */
const getAITextRecommendation = asyncHandler(async (req, res) => {
  const { skills, division } = req.body;

  // Validasi input
  if (!skills || !Array.isArray(skills)) {
    return res.status(400).json({
      success: false,
      message: "Skills harus berupa array",
    });
  }

  // Get AI recommendation
  const recommendation = await getAIRecommendation(skills, division || "");

  res.status(200).json({
    success: true,
    recommendation,
    timestamp: new Date(),
  });
});

module.exports = {
  getMyRecommendation,
  getUserRecommendation,
  getRecommendedModulesForUser,
  getAITextRecommendation,
};

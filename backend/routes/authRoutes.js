const express = require("express");
const authController = require("../controllers/authController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/google", asyncHandler(authController.loginWithGoogle));
router.post(
  "/forgot-password/request-otp",
  asyncHandler(authController.requestForgotPasswordOtp),
);
router.post(
  "/forgot-password/verify-otp",
  asyncHandler(authController.verifyForgotPasswordOtp),
);
router.post(
  "/forgot-password/reset",
  asyncHandler(authController.resetPasswordWithOtp),
);

module.exports = router;

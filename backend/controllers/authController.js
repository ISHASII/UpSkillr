const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const authResult = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: authResult.requiresApproval
        ? "Registrasi berhasil. Menunggu persetujuan HRD"
        : "Registrasi berhasil",
      data: authResult,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] register error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

const login = async (req, res) => {
  try {
    const authResult = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: authResult,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] login error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const authResult = await authService.loginWithGoogle(req.body);

    res.status(200).json({
      success: true,
      message: "Login Google berhasil",
      data: authResult,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] loginWithGoogle error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

const requestForgotPasswordOtp = async (req, res) => {
  try {
    const result = await authService.requestForgotPasswordOtp(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] requestForgotPasswordOtp error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const result = await authService.verifyForgotPasswordOtp(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] verifyForgotPasswordOtp error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const result = await authService.resetPasswordWithOtp(req.body);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] resetPasswordWithOtp error", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Terjadi kesalahan pada server",
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    });
  }
};

module.exports = {
  register,
  login,
  loginWithGoogle,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithOtp,
};

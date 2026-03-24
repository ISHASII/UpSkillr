const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const authResult = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
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

module.exports = {
  register,
  login,
};

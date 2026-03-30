const mongoose = require("mongoose");
const userService = require("../services/userService");

const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User berhasil dibuat",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingRegistrations = async (req, res, next) => {
  try {
    const users = await userService.getPendingRegistrations();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID user tidak valid",
      });
    }

    const user = await userService.getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID user tidak valid",
      });
    }

    if (req.user?.role === "Karyawan" && String(req.user._id) !== String(id)) {
      return res.status(403).json({
        success: false,
        message: "Karyawan hanya bisa memperbarui profil sendiri",
      });
    }

    const payload =
      req.user?.role === "Karyawan"
        ? {
            nama: req.body?.nama,
            email: req.body?.email,
            divisi: req.body?.divisi,
          }
        : req.body;

    const user = await userService.updateUser(id, payload);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfileSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: "Field skills harus berupa array",
      });
    }

    const user = await userService.updateUserProfileSkills(
      req.user._id,
      skills,
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skills profil berhasil diperbarui",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const decideRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID user tidak valid",
      });
    }

    const user = await userService.decideRegistration(id, req.body, req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        req.body?.status === "approved"
          ? "Registrasi karyawan disetujui"
          : "Registrasi karyawan ditolak",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID user tidak valid",
      });
    }

    const user = await userService.deleteUser(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  getPendingRegistrations,
  getUserById,
  updateUser,
  updateProfileSkills,
  decideRegistration,
  deleteUser,
};

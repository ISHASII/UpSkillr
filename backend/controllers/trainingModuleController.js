const mongoose = require("mongoose");
const trainingModuleService = require("../services/trainingModuleService");

const createTrainingModule = async (req, res, next) => {
  try {
    const moduleData = await trainingModuleService.createTrainingModule(
      req.body,
      req.files,
    );

    res.status(201).json({
      success: true,
      message: "Training module berhasil dibuat",
      data: moduleData,
    });
  } catch (error) {
    next(error);
  }
};

const getTrainingModules = async (req, res, next) => {
  try {
    const modules = await trainingModuleService.getAllTrainingModules();

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};

const getRecommendedTrainingModules = async (req, res, next) => {
  try {
    const modules =
      await trainingModuleService.getRecommendedTrainingModulesForUser(
        req.user._id,
      );

    res.status(200).json({
      success: true,
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};

const getTrainingModuleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID training module tidak valid",
      });
    }

    const moduleData = await trainingModuleService.getTrainingModuleById(id);

    if (!moduleData) {
      return res.status(404).json({
        success: false,
        message: "Training module tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: moduleData,
    });
  } catch (error) {
    return next(error);
  }
};

const updateTrainingModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID training module tidak valid",
      });
    }

    const moduleData = await trainingModuleService.updateTrainingModule(
      id,
      req.body,
      req.files,
    );

    if (!moduleData) {
      return res.status(404).json({
        success: false,
        message: "Training module tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Training module berhasil diperbarui",
      data: moduleData,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteTrainingModule = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID training module tidak valid",
      });
    }

    const moduleData = await trainingModuleService.deleteTrainingModule(id);

    if (!moduleData) {
      return res.status(404).json({
        success: false,
        message: "Training module tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Training module berhasil dihapus",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createTrainingModule,
  getTrainingModules,
  getRecommendedTrainingModules,
  getTrainingModuleById,
  updateTrainingModule,
  deleteTrainingModule,
};

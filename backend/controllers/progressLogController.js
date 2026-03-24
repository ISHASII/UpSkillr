const mongoose = require("mongoose");
const progressLogService = require("../services/progressLogService");

const createProgressLog = async (req, res, next) => {
  try {
    const progressLog = await progressLogService.createProgressLog(req.body);

    res.status(201).json({
      success: true,
      message: "Progress log berhasil dibuat",
      data: progressLog,
    });
  } catch (error) {
    next(error);
  }
};

const createProgressLogAsKaryawan = async (req, res, next) => {
  try {
    const { module_id } = req.body;

    if (!module_id || !mongoose.Types.ObjectId.isValid(module_id)) {
      return res.status(400).json({
        success: false,
        message: "module_id wajib diisi dengan format ObjectId yang valid",
      });
    }

    const progressLog = await progressLogService.createProgressLogForUser(
      req.user._id,
      module_id,
    );

    return res.status(201).json({
      success: true,
      message: "Progress log berhasil dibuat",
      data: progressLog,
    });
  } catch (error) {
    return next(error);
  }
};

const getProgressLogs = async (req, res, next) => {
  try {
    const progressLogs = await progressLogService.getAllProgressLogs();

    res.status(200).json({
      success: true,
      data: progressLogs,
    });
  } catch (error) {
    next(error);
  }
};

const getProgressLogsForHR = async (req, res, next) => {
  try {
    const progressLogs = await progressLogService.getAllProgressLogs();

    return res.status(200).json({
      success: true,
      data: progressLogs,
    });
  } catch (error) {
    return next(error);
  }
};

const getProgressLogById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    const progressLog = await progressLogService.getProgressLogById(id);

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      data: progressLog,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProgressLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    const progressLog = await progressLogService.updateProgressLog(
      id,
      req.body,
    );

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress log berhasil diperbarui",
      data: progressLog,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProgressLogStatusAsKaryawan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    if (status !== "Selesai") {
      return res.status(400).json({
        success: false,
        message: "Status hanya boleh diupdate menjadi 'Selesai'",
      });
    }

    const progressLog = await progressLogService.updateProgressLogStatusForUser(
      id,
      req.user._id,
      status,
    );

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status progress log berhasil diperbarui",
      data: progressLog,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProgressLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    const progressLog = await progressLogService.deleteProgressLog(id);

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Progress log berhasil dihapus",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProgressLog,
  createProgressLogAsKaryawan,
  getProgressLogs,
  getProgressLogsForHR,
  getProgressLogById,
  updateProgressLog,
  updateProgressLogStatusAsKaryawan,
  deleteProgressLog,
};

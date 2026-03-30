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

const getProgressLogsForKaryawan = async (req, res, next) => {
  try {
    const progressLogs = await progressLogService.getProgressLogsByUser(
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      data: progressLogs,
    });
  } catch (error) {
    return next(error);
  }
};

const getProgressLogsByModuleForHR = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Format moduleId tidak valid",
      });
    }

    const progressLogs =
      await progressLogService.getProgressLogsByModule(moduleId);

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

const submitProgressLogAsKaryawan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submissionLink = req.body.submissionLink || "";
    const submissionFiles = (req.files || []).map(
      (file) => `/uploads/${file.filename}`,
    );

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    const progressLog = await progressLogService.submitProgressLogForUser(
      id,
      req.user._id,
      { submissionLink, submissionFiles },
    );

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Submission tugas berhasil dikirim dan menunggu validasi HR",
      data: progressLog,
    });
  } catch (error) {
    return next(error);
  }
};

const validateProgressLogByHR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Format ID progress log tidak valid",
      });
    }

    const progressLog = await progressLogService.validateProgressLogByHR(
      id,
      req.user._id,
      action,
      feedback,
    );

    if (!progressLog) {
      return res.status(404).json({
        success: false,
        message: "Progress log tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        action === "approve"
          ? "Submission disetujui, karyawan dinyatakan lulus"
          : "Submission dikembalikan ke karyawan untuk diperbaiki",
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
  getProgressLogsForKaryawan,
  getProgressLogsByModuleForHR,
  getProgressLogById,
  updateProgressLog,
  submitProgressLogAsKaryawan,
  validateProgressLogByHR,
  deleteProgressLog,
};

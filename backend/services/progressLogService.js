const ProgressLog = require("../models/ProgressLog");
const User = require("../models/User");
const TrainingModule = require("../models/TrainingModule");

const createProgressLog = async (payload) => {
  const user = await User.findById(payload.user_id);
  const moduleData = await TrainingModule.findById(payload.module_id);

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  if (!moduleData) {
    const error = new Error("Training module tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  const progressLog = await ProgressLog.create(payload);
  return ProgressLog.findById(progressLog._id)
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");
};

const createProgressLogForUser = async (userId, moduleId) => {
  const user = await User.findById(userId);
  const moduleData = await TrainingModule.findById(moduleId);

  if (!user) {
    const error = new Error("User tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  if (!moduleData) {
    const error = new Error("Training module tidak ditemukan");
    error.statusCode = 404;
    throw error;
  }

  const progressLog = await ProgressLog.create({
    user_id: userId,
    module_id: moduleId,
    status: "Sedang Berjalan",
  });

  return ProgressLog.findById(progressLog._id)
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");
};

const getAllProgressLogs = async () => {
  return ProgressLog.find()
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");
};

const getProgressLogById = async (id) => {
  return ProgressLog.findById(id)
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");
};

const updateProgressLog = async (id, payload) => {
  const progressLog = await ProgressLog.findById(id);

  if (!progressLog) return null;

  if (payload.user_id) {
    const user = await User.findById(payload.user_id);
    if (!user) {
      const error = new Error("User tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
  }

  if (payload.module_id) {
    const moduleData = await TrainingModule.findById(payload.module_id);
    if (!moduleData) {
      const error = new Error("Training module tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
  }

  const updated = await ProgressLog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");

  return updated;
};

const updateProgressLogStatusForUser = async (id, userId, status) => {
  const progressLog = await ProgressLog.findById(id);

  if (!progressLog) return null;

  if (String(progressLog.user_id) !== String(userId)) {
    const error = new Error(
      "Forbidden: Anda hanya bisa mengubah progress milik sendiri",
    );
    error.statusCode = 403;
    throw error;
  }

  progressLog.status = status;
  await progressLog.save();

  return ProgressLog.findById(progressLog._id)
    .populate("user_id", "nama email role divisi skills")
    .populate("module_id", "judul deskripsi linkMateri targetSkills");
};

const deleteProgressLog = async (id) => {
  return ProgressLog.findByIdAndDelete(id);
};

module.exports = {
  createProgressLog,
  createProgressLogForUser,
  getAllProgressLogs,
  getProgressLogById,
  updateProgressLog,
  updateProgressLogStatusForUser,
  deleteProgressLog,
};

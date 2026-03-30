const ProgressLog = require("../models/ProgressLog");
const User = require("../models/User");
const TrainingModule = require("../models/TrainingModule");
const Skill = require("../models/Skill");

const populateQuery = (query) =>
  query
    .populate("user_id", "nama email role divisi skills")
    .populate(
      "module_id",
      "judul deskripsi goalsModule linkMateri materiFiles targetSkills",
    )
    .populate("validatedBy", "nama email role");

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
  return populateQuery(ProgressLog.findById(progressLog._id));
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

  const existing = await ProgressLog.findOne({
    user_id: userId,
    module_id: moduleId,
  });
  if (existing) {
    const error = new Error("Anda sudah terdaftar pada modul ini");
    error.statusCode = 400;
    throw error;
  }

  const progressLog = await ProgressLog.create({
    user_id: userId,
    module_id: moduleId,
    status: "Sedang Berjalan",
  });

  return populateQuery(ProgressLog.findById(progressLog._id));
};

const getAllProgressLogs = async () => {
  return populateQuery(ProgressLog.find()).sort({ createdAt: -1 });
};

const getProgressLogsByModule = async (moduleId) => {
  return populateQuery(ProgressLog.find({ module_id: moduleId })).sort({
    createdAt: -1,
  });
};

const getProgressLogsByUser = async (userId) => {
  return populateQuery(ProgressLog.find({ user_id: userId })).sort({
    createdAt: -1,
  });
};

const getProgressLogById = async (id) => {
  return populateQuery(ProgressLog.findById(id));
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

  const updated = await populateQuery(
    ProgressLog.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }),
  );

  return updated;
};

const submitProgressLogForUser = async (
  id,
  userId,
  { submissionLink = "", submissionFiles = [] },
) => {
  const progressLog = await ProgressLog.findById(id);

  if (!progressLog) return null;

  if (String(progressLog.user_id) !== String(userId)) {
    const error = new Error(
      "Forbidden: Anda hanya bisa mengubah progress milik sendiri",
    );
    error.statusCode = 403;
    throw error;
  }

  const cleanLink = (submissionLink || "").trim();
  const files = (submissionFiles || []).filter(Boolean);

  if (!cleanLink && files.length === 0) {
    const error = new Error(
      "Tugas wajib diisi: link pengerjaan atau file pengerjaan",
    );
    error.statusCode = 400;
    throw error;
  }

  progressLog.submissionLink = cleanLink;
  progressLog.submissionFiles = files;
  progressLog.hrFeedback = "";
  progressLog.status = "Menunggu Validasi HR";
  await progressLog.save();

  return populateQuery(ProgressLog.findById(progressLog._id));
};

const validateProgressLogByHR = async (id, hrId, action, feedback = "") => {
  const progressLog = await ProgressLog.findById(id).populate(
    "module_id",
    "targetSkills",
  );
  if (!progressLog) return null;

  if (progressLog.status !== "Menunggu Validasi HR") {
    const error = new Error(
      "Progress log belum dalam status 'Menunggu Validasi HR'",
    );
    error.statusCode = 400;
    throw error;
  }

  if (!["approve", "reject"].includes(action)) {
    const error = new Error("Action validasi harus 'approve' atau 'reject'");
    error.statusCode = 400;
    throw error;
  }

  progressLog.validatedBy = hrId;
  progressLog.validatedAt = new Date();

  if (action === "approve") {
    progressLog.status = "Lulus";
    progressLog.hrFeedback = feedback || "Submission disetujui";
    progressLog.lulusAt = new Date();

    const user = await User.findById(progressLog.user_id);
    if (user) {
      const skillIds = (progressLog.module_id?.targetSkills || []).map(
        (idOrObj) => (idOrObj && idOrObj._id ? idOrObj._id : idOrObj),
      );
      const skills = await Skill.find({ _id: { $in: skillIds } }).select(
        "nama",
      );
      const earnedSkillNames = skills.map((item) => item.nama).filter(Boolean);
      user.skills = Array.from(
        new Set([...(user.skills || []), ...earnedSkillNames]),
      );
      await user.save();
    }
  } else {
    progressLog.status = "Perlu Revisi";
    progressLog.hrFeedback = feedback || "Perlu perbaikan sesuai catatan HR";
  }

  await progressLog.save();
  return populateQuery(ProgressLog.findById(progressLog._id));
};

const deleteProgressLog = async (id) => {
  return ProgressLog.findByIdAndDelete(id);
};

module.exports = {
  createProgressLog,
  createProgressLogForUser,
  getAllProgressLogs,
  getProgressLogsByModule,
  getProgressLogsByUser,
  getProgressLogById,
  updateProgressLog,
  submitProgressLogForUser,
  validateProgressLogByHR,
  deleteProgressLog,
};

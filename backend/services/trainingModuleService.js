const TrainingModule = require("../models/TrainingModule");

const normalizeTargetSkills = (rawTargetSkills) => {
  if (!rawTargetSkills) return [];

  if (Array.isArray(rawTargetSkills)) {
    return rawTargetSkills.filter(Boolean);
  }

  if (typeof rawTargetSkills === "string") {
    const trimmed = rawTargetSkills.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const createTrainingModule = async (payload, files = []) => {
  const materiFiles = (files || []).map((file) => `/uploads/${file.filename}`);
  const targetSkills = normalizeTargetSkills(payload.targetSkills);
  const linkMateri = (payload.linkMateri || "").trim();

  if (!linkMateri && materiFiles.length === 0) {
    const error = new Error(
      "Salah satu materi harus diisi: link materi atau file materi",
    );
    error.statusCode = 400;
    throw error;
  }

  return TrainingModule.create({
    judul: payload.judul,
    deskripsi: payload.deskripsi,
    goalsModule: payload.goalsModule,
    linkMateri,
    materiFiles,
    targetSkills,
  });
};

const getAllTrainingModules = async () => {
  return TrainingModule.find().populate("targetSkills");
};

const getTrainingModuleById = async (id) => {
  return TrainingModule.findById(id).populate("targetSkills");
};

const updateTrainingModule = async (id, payload, files = []) => {
  const moduleData = await TrainingModule.findById(id);
  if (!moduleData) return null;

  const newFiles = (files || []).map((file) => `/uploads/${file.filename}`);
  const targetSkills = normalizeTargetSkills(payload.targetSkills);

  moduleData.judul = payload.judul ?? moduleData.judul;
  moduleData.deskripsi = payload.deskripsi ?? moduleData.deskripsi;
  moduleData.goalsModule = payload.goalsModule ?? moduleData.goalsModule;

  if (payload.linkMateri !== undefined) {
    moduleData.linkMateri = (payload.linkMateri || "").trim();
  }

  if (payload.targetSkills !== undefined) {
    moduleData.targetSkills = targetSkills;
  }

  if (newFiles.length > 0) {
    moduleData.materiFiles = [...(moduleData.materiFiles || []), ...newFiles];
  }

  if (!moduleData.linkMateri && (moduleData.materiFiles || []).length === 0) {
    const error = new Error(
      "Salah satu materi harus diisi: link materi atau file materi",
    );
    error.statusCode = 400;
    throw error;
  }

  await moduleData.save();

  return TrainingModule.findById(id).populate("targetSkills");
};

const deleteTrainingModule = async (id) => {
  return TrainingModule.findByIdAndDelete(id);
};

module.exports = {
  createTrainingModule,
  getAllTrainingModules,
  getTrainingModuleById,
  updateTrainingModule,
  deleteTrainingModule,
};

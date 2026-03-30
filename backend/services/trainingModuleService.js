const TrainingModule = require("../models/TrainingModule");
const User = require("../models/User");

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

const normalizeTargetDivisions = (rawTargetDivisions) => {
  if (!rawTargetDivisions) return [];

  if (Array.isArray(rawTargetDivisions)) {
    return rawTargetDivisions
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof rawTargetDivisions === "string") {
    const trimmed = rawTargetDivisions.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item || "").trim()).filter(Boolean);
      }
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
  const targetDivisions = normalizeTargetDivisions(payload.targetDivisions);
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
    targetDivisions,
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
  const targetDivisions = normalizeTargetDivisions(payload.targetDivisions);

  moduleData.judul = payload.judul ?? moduleData.judul;
  moduleData.deskripsi = payload.deskripsi ?? moduleData.deskripsi;
  moduleData.goalsModule = payload.goalsModule ?? moduleData.goalsModule;

  if (payload.linkMateri !== undefined) {
    moduleData.linkMateri = (payload.linkMateri || "").trim();
  }

  if (payload.targetSkills !== undefined) {
    moduleData.targetSkills = targetSkills;
  }

  if (payload.targetDivisions !== undefined) {
    moduleData.targetDivisions = targetDivisions;
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

const getRecommendedTrainingModulesForUser = async (userId) => {
  const user = await User.findById(userId).select("divisi skills role");
  if (!user || user.role !== "Karyawan") return [];

  const userDivision = String(user.divisi || "")
    .trim()
    .toLowerCase();
  const userSkills = new Set(
    (user.skills || []).map((skill) =>
      String(skill || "")
        .trim()
        .toLowerCase(),
    ),
  );

  const modules = await TrainingModule.find().populate("targetSkills");

  const scored = modules
    .map((moduleItem) => {
      const targetDivisions = (moduleItem.targetDivisions || [])
        .map((division) =>
          String(division || "")
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean);

      const targetSkillNames = (moduleItem.targetSkills || [])
        .map((skill) =>
          String(skill?.nama || skill?.name || skill?._id || "")
            .trim()
            .toLowerCase(),
        )
        .filter(Boolean);

      const divisionMatched =
        userDivision.length > 0 && targetDivisions.includes(userDivision);

      const skillMatchCount = targetSkillNames.reduce((count, skillName) => {
        if (userSkills.has(skillName)) return count + 1;
        return count;
      }, 0);

      const score = (divisionMatched ? 3 : 0) + skillMatchCount * 2;

      return {
        ...moduleItem.toObject(),
        recommendation: {
          score,
          divisionMatched,
          skillMatchCount,
        },
      };
    })
    .filter((moduleItem) => moduleItem.recommendation.score > 0)
    .sort((a, b) => {
      if (b.recommendation.score !== a.recommendation.score) {
        return b.recommendation.score - a.recommendation.score;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return scored;
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
  getRecommendedTrainingModulesForUser,
};

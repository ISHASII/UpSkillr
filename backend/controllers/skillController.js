const mongoose = require("mongoose");
const skillService = require("../services/skillService");

const createSkill = async (req, res, next) => {
  try {
    console.log(
      "[skillController] createSkill called by user:",
      req.user ? req.user.email : "unauthenticated",
    );
    console.log("[skillController] payload:", req.body);
    const skill = await skillService.createSkill(req.body);
    res
      .status(201)
      .json({ success: true, message: "Skill dibuat", data: skill });
  } catch (error) {
    next(error);
  }
};

const getSkills = async (req, res, next) => {
  try {
    console.log(
      "[skillController] getSkills called by user:",
      req.user ? req.user.email : "unauthenticated",
    );
    const skills = await skillService.getAllSkills();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    next(error);
  }
};

const getSkillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Format ID tidak valid" });
    }

    const skill = await skillService.getSkillById(id);
    if (!skill)
      return res
        .status(404)
        .json({ success: false, message: "Skill tidak ditemukan" });

    return res.status(200).json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(
      "[skillController] updateSkill called by user:",
      req.user ? req.user.email : "unauthenticated",
    );
    console.log("[skillController] id, payload:", id, req.body);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Format ID tidak valid" });
    }

    const skill = await skillService.updateSkill(id, req.body);
    if (!skill)
      return res
        .status(404)
        .json({ success: false, message: "Skill tidak ditemukan" });

    return res
      .status(200)
      .json({ success: true, message: "Skill diperbarui", data: skill });
  } catch (error) {
    next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(
      "[skillController] deleteSkill called by user:",
      req.user ? req.user.email : "unauthenticated",
    );
    console.log("[skillController] id:", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Format ID tidak valid" });
    }

    const skill = await skillService.deleteSkill(id);
    if (!skill)
      return res
        .status(404)
        .json({ success: false, message: "Skill tidak ditemukan" });

    return res.status(200).json({ success: true, message: "Skill dihapus" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};

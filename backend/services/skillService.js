const Skill = require("../models/Skill");

const createSkill = async (payload) => {
  return Skill.create(payload);
};

const getAllSkills = async () => {
  return Skill.find();
};

const getSkillById = async (id) => {
  return Skill.findById(id);
};

const updateSkill = async (id, payload) => {
  const skill = await Skill.findById(id);
  if (!skill) return null;

  skill.nama = payload.nama ?? skill.nama;
  skill.deskripsi = payload.deskripsi ?? skill.deskripsi;

  await skill.save();
  return Skill.findById(id);
};

const deleteSkill = async (id) => {
  return Skill.findByIdAndDelete(id);
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};

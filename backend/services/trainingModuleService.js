const TrainingModule = require("../models/TrainingModule");

const createTrainingModule = async (payload) => {
  return TrainingModule.create(payload);
};

const getAllTrainingModules = async () => {
  return TrainingModule.find().populate("targetSkills");
};

const getTrainingModuleById = async (id) => {
  return TrainingModule.findById(id).populate("targetSkills");
};

const updateTrainingModule = async (id, payload) => {
  return TrainingModule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("targetSkills");
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

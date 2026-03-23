const TrainingModule = require("../models/TrainingModule");

const createTrainingModule = async (payload) => {
  return TrainingModule.create(payload);
};

const getAllTrainingModules = async () => {
  return TrainingModule.find();
};

const getTrainingModuleById = async (id) => {
  return TrainingModule.findById(id);
};

const updateTrainingModule = async (id, payload) => {
  return TrainingModule.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
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

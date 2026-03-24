const mongoose = require("mongoose");

const trainingModuleSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      required: true,
      trim: true,
    },
    linkMateri: {
      type: String,
      required: true,
      trim: true,
    },
    targetSkills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("TrainingModule", trainingModuleSchema);

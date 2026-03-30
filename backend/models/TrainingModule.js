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
    goalsModule: {
      type: String,
      required: true,
      trim: true,
    },
    linkMateri: {
      type: String,
      trim: true,
      default: "",
    },
    materiFiles: [
      {
        type: String,
        trim: true,
      },
    ],
    targetSkills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    targetDivisions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("TrainingModule", trainingModuleSchema);

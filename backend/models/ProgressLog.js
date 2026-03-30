const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    module_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingModule",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Sedang Berjalan",
        "Menunggu Validasi HR",
        "Perlu Revisi",
        "Lulus",
      ],
      default: "Sedang Berjalan",
      required: true,
    },
    submissionLink: {
      type: String,
      trim: true,
      default: "",
    },
    submissionFiles: [
      {
        type: String,
        trim: true,
      },
    ],
    hrFeedback: {
      type: String,
      trim: true,
      default: "",
    },
    validatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    validatedAt: {
      type: Date,
    },
    lulusAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

progressLogSchema.index({ user_id: 1, module_id: 1 }, { unique: true });

module.exports = mongoose.model("ProgressLog", progressLogSchema);

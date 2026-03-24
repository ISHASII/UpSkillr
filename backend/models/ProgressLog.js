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
      enum: ["Sedang Berjalan", "Selesai"],
      default: "Sedang Berjalan",
      required: true,
    },
  },
  { timestamps: true },
);

progressLogSchema.index({ user_id: 1, module_id: 1 }, { unique: true });

module.exports = mongoose.model("ProgressLog", progressLogSchema);

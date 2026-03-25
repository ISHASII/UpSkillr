const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama skill harus diisi"],
      trim: true,
    },
    deskripsi: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Skill", skillSchema);

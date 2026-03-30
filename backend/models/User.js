const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["HR", "Karyawan"],
      required: true,
    },
    registrationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        return this.role === "Karyawan" ? "pending" : "approved";
      },
    },
    registrationReviewedAt: {
      type: Date,
      default: null,
    },
    registrationReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    registrationRejectionReason: {
      type: String,
      trim: true,
      default: "",
    },
    divisi: {
      type: String,
      default: "",
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    forgotPasswordOtpHash: {
      type: String,
      select: false,
      default: null,
    },
    forgotPasswordOtpExpiresAt: {
      type: Date,
      default: null,
    },
    forgotPasswordOtpRequestedAt: {
      type: Date,
      default: null,
    },
    forgotPasswordOtpAttempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

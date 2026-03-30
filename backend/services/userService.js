const User = require("../models/User");
const authService = require("./authService");

const createUser = async (payload) => {
  return User.create({
    ...payload,
    registrationStatus: payload?.registrationStatus || "approved",
  });
};

const getAllUsers = async () => {
  return User.find().select("-password");
};

const getPendingRegistrations = async () => {
  return User.find({ role: "Karyawan", registrationStatus: "pending" })
    .select("-password")
    .sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

const updateUser = async (id, payload) => {
  const user = await User.findById(id).select("+password");

  if (!user) return null;

  user.nama = payload.nama ?? user.nama;
  user.email = payload.email ?? user.email;
  user.password = payload.password ?? user.password;
  user.role = payload.role ?? user.role;
  user.divisi = payload.divisi ?? user.divisi;
  user.skills = payload.skills ?? user.skills;

  await user.save();

  return User.findById(id).select("-password");
};

const updateUserProfileSkills = async (id, skills) => {
  return User.findByIdAndUpdate(
    id,
    { skills },
    {
      new: true,
      runValidators: true,
    },
  ).select("-password");
};

const decideRegistration = async (id, payload, reviewer) => {
  const { status, divisi, reason } = payload;

  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Status keputusan harus approved atau rejected");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(id).select("-password");
  if (!user) return null;

  if (user.role !== "Karyawan") {
    const error = new Error("Hanya registrasi Karyawan yang bisa diproses");
    error.statusCode = 400;
    throw error;
  }

  if (user.registrationStatus !== "pending") {
    const error = new Error("Registrasi ini sudah pernah diproses");
    error.statusCode = 400;
    throw error;
  }

  if (status === "approved") {
    if (!String(divisi || "").trim()) {
      const error = new Error("Divisi wajib diisi saat approve registrasi");
      error.statusCode = 400;
      throw error;
    }

    user.registrationStatus = "approved";
    user.divisi = String(divisi || "").trim();
    user.registrationRejectionReason = "";
  } else {
    user.registrationStatus = "rejected";
    user.divisi = "";
    user.registrationRejectionReason = String(reason || "").trim();
  }

  user.registrationReviewedAt = new Date();
  user.registrationReviewedBy = reviewer?._id || null;

  await user.save();

  await authService.sendRegistrationDecisionEmail({
    email: user.email,
    nama: user.nama,
    status,
    divisi: user.divisi,
    reason: user.registrationRejectionReason,
  });

  return User.findById(id).select("-password");
};

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserProfileSkills,
  getPendingRegistrations,
  decideRegistration,
  deleteUser,
};

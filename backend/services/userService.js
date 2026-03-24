const User = require("../models/User");

const createUser = async (payload) => {
  return User.create(payload);
};

const getAllUsers = async () => {
  return User.find().select("-password");
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

const deleteUser = async (id) => {
  return User.findByIdAndDelete(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserProfileSkills,
  deleteUser,
};

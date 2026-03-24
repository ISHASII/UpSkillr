const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (user) => {
  const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn },
  );
};

const register = async (payload) => {
  const { nama, email, password, role, divisi, skills = [] } = payload;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error("Email sudah terdaftar");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    nama,
    email,
    password,
    role,
    divisi,
    skills,
  });

  const token = createToken(user);

  return {
    token,
    user: {
      id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      divisi: user.divisi,
      skills: user.skills,
    },
  };
};

const login = async (payload) => {
  const { email, password } = payload;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    const error = new Error("Email atau password salah");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    const error = new Error("Email atau password salah");
    error.statusCode = 401;
    throw error;
  }

  const token = createToken(user);

  return {
    token,
    user: {
      id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      divisi: user.divisi,
      skills: user.skills,
    },
  };
};

module.exports = {
  register,
  login,
};

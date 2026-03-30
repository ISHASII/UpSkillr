const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 10);
const OTP_COOLDOWN_SECONDS = Number(
  process.env.OTP_RESEND_COOLDOWN_SECONDS || 60,
);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 5);

let transporter = null;

const getMailerTransporter = () => {
  if (transporter) return transporter;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  if (!smtpHost || !smtpUser || !smtpPass) {
    const error = new Error(
      "Konfigurasi SMTP belum lengkap. Isi SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS di .env",
    );
    error.statusCode = 500;
    throw error;
  }

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  return transporter;
};

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const generateOtpCode = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(crypto.randomInt(min, max + 1));
};

const sendForgotPasswordOtpEmail = async ({ email, nama, otpCode }) => {
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const mailer = getMailerTransporter();

  await mailer.sendMail({
    from: fromAddress,
    to: email,
    subject: "OTP Reset Password UpSkillr",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Reset Password UpSkillr</h2>
        <p>Halo ${nama || "User"},</p>
        <p>Berikut OTP untuk reset password akun kamu:</p>
        <div style="display: inline-block; padding: 10px 16px; border-radius: 8px; background: #e2e8f0; font-size: 22px; font-weight: 700; letter-spacing: 4px;">
          ${otpCode}
        </div>
        <p style="margin-top: 12px;">OTP berlaku selama ${OTP_EXPIRY_MINUTES} menit.</p>
        <p>Jangan bagikan OTP ini ke siapa pun.</p>
      </div>
    `,
    text: `Halo ${nama || "User"}, OTP reset password kamu adalah ${otpCode}. OTP berlaku ${OTP_EXPIRY_MINUTES} menit.`,
  });
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

const requestForgotPasswordOtp = async (payload) => {
  const email = String(payload?.email || "")
    .trim()
    .toLowerCase();

  if (!email) {
    const error = new Error("Email wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });

  if (!user) {
    return {
      emailExists: false,
      message: "Email tidak terdaftar",
    };
  }

  const now = new Date();
  if (user.forgotPasswordOtpRequestedAt) {
    const elapsedSeconds =
      (now.getTime() - user.forgotPasswordOtpRequestedAt.getTime()) / 1000;

    if (elapsedSeconds < OTP_COOLDOWN_SECONDS) {
      const retrySeconds = Math.ceil(OTP_COOLDOWN_SECONDS - elapsedSeconds);
      const error = new Error(
        `Terlalu sering meminta OTP. Coba lagi dalam ${retrySeconds} detik`,
      );
      error.statusCode = 429;
      throw error;
    }
  }

  const otpCode = generateOtpCode();
  user.forgotPasswordOtpHash = hashOtp(otpCode);
  user.forgotPasswordOtpExpiresAt = new Date(
    now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000,
  );
  user.forgotPasswordOtpRequestedAt = now;
  user.forgotPasswordOtpAttempts = 0;
  await user.save();

  await sendForgotPasswordOtpEmail({
    email: user.email,
    nama: user.nama,
    otpCode,
  });

  return {
    emailExists: true,
    message: "OTP reset password berhasil dikirim ke email",
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  };
};

const verifyForgotPasswordOtp = async (payload) => {
  const email = String(payload?.email || "")
    .trim()
    .toLowerCase();
  const otp = String(payload?.otp || "").trim();

  if (!email || !otp) {
    const error = new Error("Email dan OTP wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select("+forgotPasswordOtpHash");

  if (
    !user ||
    !user.forgotPasswordOtpHash ||
    !user.forgotPasswordOtpExpiresAt
  ) {
    const error = new Error("OTP tidak valid atau sudah kedaluwarsa");
    error.statusCode = 400;
    throw error;
  }

  if (user.forgotPasswordOtpExpiresAt.getTime() < Date.now()) {
    user.forgotPasswordOtpHash = null;
    user.forgotPasswordOtpExpiresAt = null;
    user.forgotPasswordOtpRequestedAt = null;
    user.forgotPasswordOtpAttempts = 0;
    await user.save();

    const error = new Error("OTP sudah kedaluwarsa, silakan minta OTP baru");
    error.statusCode = 400;
    throw error;
  }

  const incomingOtpHash = hashOtp(otp);
  if (incomingOtpHash !== user.forgotPasswordOtpHash) {
    user.forgotPasswordOtpAttempts = (user.forgotPasswordOtpAttempts || 0) + 1;

    if (user.forgotPasswordOtpAttempts >= OTP_MAX_ATTEMPTS) {
      user.forgotPasswordOtpHash = null;
      user.forgotPasswordOtpExpiresAt = null;
      user.forgotPasswordOtpRequestedAt = null;
      user.forgotPasswordOtpAttempts = 0;
      await user.save();

      const error = new Error(
        "OTP salah terlalu banyak. Silakan minta OTP baru",
      );
      error.statusCode = 400;
      throw error;
    }

    await user.save();
    const error = new Error("OTP tidak valid");
    error.statusCode = 400;
    throw error;
  }

  return {
    verified: true,
    message: "OTP valid, silakan masukkan password baru",
  };
};

const resetPasswordWithOtp = async (payload) => {
  const email = String(payload?.email || "")
    .trim()
    .toLowerCase();
  const otp = String(payload?.otp || "").trim();
  const newPassword = String(payload?.newPassword || "");

  if (!email || !otp || !newPassword) {
    const error = new Error("Email, OTP, dan password baru wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Password baru minimal 6 karakter");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select(
    "+password +forgotPasswordOtpHash",
  );

  if (
    !user ||
    !user.forgotPasswordOtpHash ||
    !user.forgotPasswordOtpExpiresAt
  ) {
    const error = new Error("OTP tidak valid atau sudah kedaluwarsa");
    error.statusCode = 400;
    throw error;
  }

  if (user.forgotPasswordOtpExpiresAt.getTime() < Date.now()) {
    user.forgotPasswordOtpHash = null;
    user.forgotPasswordOtpExpiresAt = null;
    user.forgotPasswordOtpRequestedAt = null;
    user.forgotPasswordOtpAttempts = 0;
    await user.save();

    const error = new Error("OTP sudah kedaluwarsa, silakan minta OTP baru");
    error.statusCode = 400;
    throw error;
  }

  const incomingOtpHash = hashOtp(otp);
  if (incomingOtpHash !== user.forgotPasswordOtpHash) {
    user.forgotPasswordOtpAttempts = (user.forgotPasswordOtpAttempts || 0) + 1;

    if (user.forgotPasswordOtpAttempts >= OTP_MAX_ATTEMPTS) {
      user.forgotPasswordOtpHash = null;
      user.forgotPasswordOtpExpiresAt = null;
      user.forgotPasswordOtpRequestedAt = null;
      user.forgotPasswordOtpAttempts = 0;
      await user.save();

      const error = new Error(
        "OTP salah terlalu banyak. Silakan minta OTP baru",
      );
      error.statusCode = 400;
      throw error;
    }

    await user.save();
    const error = new Error("OTP tidak valid");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.forgotPasswordOtpHash = null;
  user.forgotPasswordOtpExpiresAt = null;
  user.forgotPasswordOtpRequestedAt = null;
  user.forgotPasswordOtpAttempts = 0;
  await user.save();

  return {
    message: "Password berhasil direset. Silakan login dengan password baru",
  };
};

module.exports = {
  register,
  login,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithOtp,
};

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");
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
let googleOauthClient = null;

const buildAuthResponse = (user) => ({
  token: createToken(user),
  user: {
    id: user._id,
    nama: user.nama,
    email: user.email,
    role: user.role,
    divisi: user.divisi,
    skills: user.skills,
    registrationStatus: user.registrationStatus,
  },
});

const assertKaryawanApprovalStatus = (user) => {
  if (user.role === "Karyawan" && user.registrationStatus !== "approved") {
    if (user.registrationStatus === "pending") {
      const error = new Error(
        "Akun kamu masih menunggu persetujuan HRD. Cek email untuk notifikasi.",
      );
      error.statusCode = 403;
      throw error;
    }

    const error = new Error(
      "Registrasi akun kamu ditolak HRD. Cek email untuk detail atau hubungi HRD.",
    );
    error.statusCode = 403;
    throw error;
  }
};

const getGoogleOauthClient = () => {
  const googleClientId = String(process.env.GOOGLE_CLIENT_ID || "").trim();
  if (!googleClientId) {
    const error = new Error(
      "GOOGLE_CLIENT_ID belum diatur di environment backend",
    );
    error.statusCode = 500;
    throw error;
  }

  if (!googleOauthClient) {
    googleOauthClient = new OAuth2Client(googleClientId);
  }

  return { googleOauthClient, googleClientId };
};

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

const sendRegistrationDecisionEmail = async ({
  email,
  nama,
  status,
  divisi,
  reason,
}) => {
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const mailer = getMailerTransporter();

  const isApproved = status === "approved";
  const subject = isApproved
    ? "Registrasi UpSkillr Disetujui"
    : "Registrasi UpSkillr Ditolak";

  const html = isApproved
    ? `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Registrasi Disetujui</h2>
        <p>Halo ${nama || "Karyawan"},</p>
        <p>Registrasi akun UpSkillr kamu telah <b>disetujui</b> oleh HRD.</p>
        <p>Divisi kamu telah diatur ke: <b>${divisi || "-"}</b>.</p>
        <p>Silakan login dan mulai pelatihan yang direkomendasikan sistem.</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #0f172a;">
        <h2 style="margin-bottom: 8px;">Registrasi Ditolak</h2>
        <p>Halo ${nama || "Karyawan"},</p>
        <p>Mohon maaf, registrasi akun UpSkillr kamu <b>belum dapat disetujui</b>.</p>
        <p>Alasan: ${reason || "Tidak ada alasan tambahan"}</p>
        <p>Silakan hubungi HRD untuk informasi lebih lanjut.</p>
      </div>
    `;

  const text = isApproved
    ? `Halo ${nama || "Karyawan"}, registrasi UpSkillr kamu disetujui. Divisi: ${divisi || "-"}. Silakan login.`
    : `Halo ${nama || "Karyawan"}, registrasi UpSkillr kamu ditolak. Alasan: ${reason || "Tidak ada alasan tambahan"}.`;

  await mailer.sendMail({
    from: fromAddress,
    to: email,
    subject,
    html,
    text,
  });
};

const register = async (payload) => {
  const { nama, email, password, skills = [], role, divisi } = payload;

  const normalizedRoleInput = String(role || "Karyawan")
    .trim()
    .toUpperCase();
  const requestedRole =
    normalizedRoleInput === "HRD"
      ? "HR"
      : normalizedRoleInput === "HR"
        ? "HR"
        : normalizedRoleInput === "KARYAWAN"
          ? "Karyawan"
          : null;

  if (!requestedRole) {
    const error = new Error("Role tidak valid");
    error.statusCode = 400;
    throw error;
  }

  const requiresApproval = requestedRole === "Karyawan";

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
    role: requestedRole,
    registrationStatus: requiresApproval ? "pending" : "approved",
    divisi: requestedRole === "HR" ? divisi || "HR" : "",
    skills,
  });

  return {
    user: {
      id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      divisi: user.divisi,
      skills: user.skills,
      registrationStatus: user.registrationStatus,
    },
    requiresApproval,
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

  assertKaryawanApprovalStatus(user);

  return buildAuthResponse(user);
};

const loginWithGoogle = async (payload) => {
  const credential = String(
    payload?.credential || payload?.idToken || "",
  ).trim();

  if (!credential) {
    const error = new Error("Credential Google wajib diisi");
    error.statusCode = 400;
    throw error;
  }

  const { googleOauthClient, googleClientId } = getGoogleOauthClient();

  let googlePayload;
  try {
    const ticket = await googleOauthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    googlePayload = ticket.getPayload();
  } catch {
    const error = new Error("Token Google tidak valid");
    error.statusCode = 401;
    throw error;
  }

  const googleEmail = String(googlePayload?.email || "")
    .trim()
    .toLowerCase();

  if (!googleEmail || googlePayload?.email_verified !== true) {
    const error = new Error(
      "Email Google tidak valid atau belum terverifikasi",
    );
    error.statusCode = 401;
    throw error;
  }

  let user = await User.findOne({ email: googleEmail }).select("+password");

  if (!user) {
    user = await User.create({
      nama: String(googlePayload?.name || "Google User").trim(),
      email: googleEmail,
      password: crypto.randomBytes(24).toString("hex"),
      role: "Karyawan",
      registrationStatus: "pending",
      divisi: "",
      skills: [],
    });
  }

  assertKaryawanApprovalStatus(user);

  return buildAuthResponse(user);
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
  loginWithGoogle,
  requestForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPasswordWithOtp,
  sendRegistrationDecisionEmail,
};

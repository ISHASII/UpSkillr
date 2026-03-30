import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AuthPage from "./pages/AuthPage";
import HRLayout from "./pages/hr/HRLayout";
import HRDashboard from "./pages/hr/HRDashboard";
import HRModulIndex from "./pages/hr/modul/Index";
import HRModulCreate from "./pages/hr/modul/Create";
import HRModulEdit from "./pages/hr/modul/Edit";
import HRModulParticipants from "./pages/hr/modul/Participants";
import HRKaryawanIndex from "./pages/hr/karyawan/Index";
import HRKaryawanCreate from "./pages/hr/karyawan/Create";
import HRKaryawanEdit from "./pages/hr/karyawan/Edit";
import HRProfile from "./pages/hr/Profile";
import HRSkillIndex from "./pages/hr/skill/Index";
import HRSkillCreate from "./pages/hr/skill/Create";
import HRSkillEdit from "./pages/hr/skill/Edit";
import KaryawanLayout from "./pages/karyawan/Layout";
import KaryawanDashboardPage from "./pages/karyawan/Index";
import KaryawanModulPage from "./pages/karyawan/Modul";
import KaryawanProfile from "./pages/karyawan/Profile";
import {
  authApi,
  logApi,
  moduleApi,
  setUnauthorizedHandler,
  userApi,
  skillApi,
} from "./services/api";

const emptyRegister = {
  nama: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Karyawan",
  divisi: "General",
  skills: "",
};

const emptyLogin = {
  email: "",
  password: "",
};

const emptyForgotPassword = {
  email: "",
  otp: "",
  newPassword: "",
  confirmNewPassword: "",
};

const OTP_RESEND_COOLDOWN_SECONDS = 60;

const emptyModule = {
  judul: "",
  deskripsi: "",
  goalsModule: "",
  linkMateri: "",
  materiFiles: [],
  existingMateriFiles: [],
  targetSkills: [],
};

const parseStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const parseJwtPayload = (token) => {
  try {
    const base64 = token.split(".")[1];
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const payload = decodeURIComponent(
      atob(normalized)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  if (!token) return true;

  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;

  return Date.now() >= payload.exp * 1000;
};

const RequireAuth = ({ isAuthenticated, children }) =>
  isAuthenticated ? children : <Navigate to="/login" replace />;

const RequireRole = ({ isAuthenticated, userRole, allowedRoles, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole))
    return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(parseStoredUser);

  const [activeAuthTab, setActiveAuthTab] = useState("login");
  const [registerForm, setRegisterForm] = useState(emptyRegister);
  const [loginForm, setLoginForm] = useState(emptyLogin);
  const [forgotPasswordForm, setForgotPasswordForm] =
    useState(emptyForgotPassword);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("email");

  const [modules, setModules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);

  const [newModuleForm, setNewModuleForm] = useState(emptyModule);
  const [newUserForm, setNewUserForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "Karyawan",
    divisi: "General",
  });
  const [editUserId, setEditUserId] = useState("");
  const [editUserForm, setEditUserForm] = useState({
    nama: "",
    email: "",
    role: "Karyawan",
    divisi: "",
    password: "",
  });
  const [profileForm, setProfileForm] = useState({
    nama: "",
    email: "",
    divisi: "",
    role: "Karyawan",
  });
  const [editModuleId, setEditModuleId] = useState("");
  const [editModuleForm, setEditModuleForm] = useState(emptyModule);

  const [skills, setSkills] = useState([]);
  const [newSkillForm, setNewSkillForm] = useState({ nama: "", deskripsi: "" });
  const [editSkillId, setEditSkillId] = useState("");
  const [editSkillForm, setEditSkillForm] = useState({
    nama: "",
    deskripsi: "",
  });

  const [selectedModuleForValidation, setSelectedModuleForValidation] =
    useState(null);
  const [moduleParticipants, setModuleParticipants] = useState([]);

  const [loading, setLoading] = useState(false);

  const isFullBleedRoute =
    location.pathname === "/login" ||
    location.pathname.startsWith("/dashboard/");

  const isAuthenticated = Boolean(token && user);
  const role = user?.role || null;

  const canAccessModules = useMemo(
    () => role === "HR" || role === "Karyawan",
    [role],
  );
  const canManageLogsHR = role === "HR";

  // SweetAlert2 will handle all notifications and confirmations

  const clearAuthData = (message) => {
    setToken("");
    setUser(null);
    setModules([]);
    setLogs([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (message) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonText: "OK",
        width: 420,
      });
    }
  };

  const setAuthData = (authData) => {
    setToken(authData.token);
    // Normalize user object to always include _id for compatibility
    const normalizedUser = { ...(authData.user || {}) };
    if (!normalizedUser._id && normalizedUser.id) {
      normalizedUser._id = normalizedUser.id;
    }

    setUser(normalizedUser);
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    navigate(
      authData.user?.role === "HR" ? "/dashboard/hr" : "/dashboard/karyawan",
    );
  };

  const showError = (error, fallbackMessage) => {
    const message = error?.response?.data?.message || fallbackMessage;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
      confirmButtonText: "OK",
      width: 420,
    });
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Sukses",
      text: message,
      confirmButtonText: "OK",
      width: 420,
    });
  };

  useEffect(() => {
    if (!token) return;

    if (isTokenExpired(token)) {
      clearAuthData("Sesi login berakhir, silakan login ulang");
      return;
    }

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        clearAuthData("Sesi login berakhir, silakan login ulang");
      }
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuthData("Token tidak valid atau sudah kedaluwarsa");
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  useEffect(() => {
    if (activeAuthTab !== "forgot-password") {
      setForgotPasswordStep("email");
      setForgotPasswordForm(emptyForgotPassword);
    }
  }, [activeAuthTab]);

  const fetchModules = async () => {
    if (!isAuthenticated || !canAccessModules) return;

    try {
      const response = await moduleApi.getAll();
      setModules(response.data.data || []);
    } catch (error) {
      showError(error, "Gagal mengambil data modul");
    }
  };

  const fetchLogs = async () => {
    if (!isAuthenticated) return;

    try {
      const response = canManageLogsHR
        ? await logApi.getAll()
        : await logApi.getMine();
      setLogs(response.data.data || []);

      if (!canManageLogsHR && user?._id) {
        const meResponse = await userApi.getById(user._id);
        const latestUser = meResponse.data.data;
        if (latestUser) {
          setUser(latestUser);
          localStorage.setItem("user", JSON.stringify(latestUser));
        }
      }
    } catch (error) {
      showError(error, "Gagal mengambil data progress log");
    }
  };

  const fetchUsers = async () => {
    if (!isAuthenticated || role !== "HR") return;

    try {
      const response = await userApi.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      showError(error, "Gagal mengambil data karyawan");
    }
  };
  const fetchSkills = async () => {
    if (!isAuthenticated || role !== "HR") return;

    try {
      const response = await skillApi.getAll();
      setSkills(response.data.data || []);
    } catch (error) {
      console.error("[App] fetchSkills error", error, error?.response?.data);
      showError(error, "Gagal mengambil data skill");
    }
  };
  useEffect(() => {
    fetchModules();
    fetchLogs();
    fetchUsers();
    fetchSkills();
  }, [isAuthenticated, role]);

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      nama: user.nama || "",
      email: user.email || "",
      divisi: user.divisi || "",
      role: user.role || "Karyawan",
    });
  }, [user]);

  const handleRegister = async (event) => {
    event.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      showError(null, "Password dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nama: registerForm.nama,
        email: registerForm.email,
        password: registerForm.password,
        role: "Karyawan",
        divisi: "General",
        skills: [],
      };

      const response = await authApi.register(payload);
      setAuthData(response.data.data);
      showSuccess("Registrasi berhasil dan kamu langsung login");
      setRegisterForm(emptyRegister);
    } catch (error) {
      showError(error, "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(loginForm);
      setAuthData(response.data.data);
      showSuccess("Login berhasil");
      setLoginForm(emptyLogin);
    } catch (error) {
      showError(error, "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestForgotPasswordOtp = async (event) => {
    if (event?.preventDefault) event.preventDefault();

    const email = (forgotPasswordForm.email || "").trim();
    if (!email) {
      showError(null, "Email wajib diisi untuk kirim OTP");
      return;
    }

    const requestOtpForEmail = async (targetEmail) => {
      const response = await authApi.requestForgotPasswordOtp({
        email: targetEmail,
      });
      const emailExists = response?.data?.data?.emailExists;
      return { emailExists };
    };

    const openOtpVerificationModal = async (targetEmail) => {
      while (true) {
        let countdown = OTP_RESEND_COOLDOWN_SECONDS;
        let countdownInterval = null;

        const otpPrompt = await Swal.fire({
          title: "Masukkan OTP",
          text: "OTP sudah dikirim ke email kamu",
          input: "text",
          inputLabel: "Kode OTP",
          inputPlaceholder: "Masukkan 6 digit OTP",
          inputAttributes: {
            inputmode: "numeric",
            maxlength: 6,
            autocapitalize: "off",
            autocomplete: "one-time-code",
          },
          showCancelButton: true,
          showDenyButton: true,
          confirmButtonText: "Verifikasi OTP",
          cancelButtonText: "Batal",
          denyButtonText: `Kirim Ulang (${countdown}s)`,
          width: 420,
          didOpen: () => {
            const otpInput = Swal.getInput();
            if (otpInput) {
              otpInput.focus();
              otpInput.addEventListener("input", () => {
                otpInput.value = otpInput.value.replace(/\D/g, "").slice(0, 6);
              });
            }

            const denyButton = Swal.getDenyButton();
            if (denyButton) {
              denyButton.disabled = true;
              countdownInterval = setInterval(() => {
                countdown -= 1;
                if (countdown <= 0) {
                  clearInterval(countdownInterval);
                  denyButton.disabled = false;
                  denyButton.textContent = "Kirim Ulang OTP";
                } else {
                  denyButton.textContent = `Kirim Ulang (${countdown}s)`;
                }
              }, 1000);
            }
          },
          willClose: () => {
            if (countdownInterval) clearInterval(countdownInterval);
          },
          preConfirm: async (otpInput) => {
            const otp = (otpInput || "").trim();
            if (!/^\d{6}$/.test(otp)) {
              Swal.showValidationMessage("OTP harus 6 digit angka");
              return null;
            }

            try {
              await authApi.verifyForgotPasswordOtp({
                email: targetEmail,
                otp,
              });
              return otp;
            } catch (error) {
              const message =
                error?.response?.data?.message || "OTP tidak valid";
              Swal.showValidationMessage(message);
              return null;
            }
          },
        });

        if (otpPrompt.isConfirmed) {
          setForgotPasswordForm((prev) => ({
            ...prev,
            email: targetEmail,
            otp: otpPrompt.value,
          }));
          setForgotPasswordStep("reset");
          showSuccess("OTP valid, sekarang isi password baru");
          return;
        }

        if (otpPrompt.isDenied) {
          try {
            const resendResponse = await requestOtpForEmail(targetEmail);
            if (!resendResponse.emailExists) {
              showError(null, "Email tidak terdaftar di sistem");
              return;
            }
            continue;
          } catch (error) {
            showError(error, "Gagal mengirim ulang OTP");
            return;
          }
        }

        return;
      }
    };

    setLoading(true);
    try {
      const response = await requestOtpForEmail(email);
      if (!response.emailExists) {
        showError(null, "Email tidak terdaftar di sistem");
        return;
      }
    } catch (error) {
      showError(error, "Gagal mengirim OTP reset password");
      return;
    } finally {
      setLoading(false);
    }

    await openOtpVerificationModal(email);
  };

  const handleResetPasswordWithOtp = async (event) => {
    event.preventDefault();

    const email = (forgotPasswordForm.email || "").trim();
    const otp = (forgotPasswordForm.otp || "").trim();
    const newPassword = forgotPasswordForm.newPassword || "";
    const confirmNewPassword = forgotPasswordForm.confirmNewPassword || "";

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      showError(null, "Lengkapi email, OTP, dan password baru");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      showError(null, "Password baru dan konfirmasi password tidak cocok");
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.resetPasswordWithOtp({
        email,
        otp,
        newPassword,
      });

      showSuccess(
        response?.data?.message ||
          "Password berhasil direset, silakan login kembali",
      );

      setForgotPasswordForm(emptyForgotPassword);
      setForgotPasswordStep("email");
      setActiveAuthTab("login");
      setLoginForm((prev) => ({ ...prev, email, password: "" }));
    } catch (error) {
      showError(error, "Gagal reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForgotEmailStep = () => {
    setForgotPasswordForm((prev) => ({
      ...prev,
      otp: "",
      newPassword: "",
      confirmNewPassword: "",
    }));
    setForgotPasswordStep("email");
  };

  const handleCreateModule = async (event) => {
    event.preventDefault();

    if (
      !(newModuleForm.linkMateri || "").trim() &&
      !(newModuleForm.materiFiles || []).length
    ) {
      showError(null, "Isi Link Materi atau upload minimal 1 file materi");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("judul", newModuleForm.judul || "");
      formData.append("deskripsi", newModuleForm.deskripsi || "");
      formData.append("goalsModule", newModuleForm.goalsModule || "");
      formData.append("linkMateri", newModuleForm.linkMateri || "");
      formData.append(
        "targetSkills",
        JSON.stringify(newModuleForm.targetSkills || []),
      );

      (newModuleForm.materiFiles || []).forEach((file) => {
        formData.append("materiFiles", file);
      });

      await moduleApi.create(formData);
      showSuccess("Modul berhasil dibuat");
      setNewModuleForm(emptyModule);
      await fetchModules();
      navigate("/dashboard/hr/modul");
    } catch (error) {
      showError(error, "Gagal membuat modul");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async (event) => {
    event.preventDefault();
    if (!editModuleId.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Isi Module ID terlebih dahulu",
        confirmButtonText: "OK",
        width: 420,
      });
      return;
    }

    if (
      !(editModuleForm.linkMateri || "").trim() &&
      !(editModuleForm.materiFiles || []).length &&
      !(editModuleForm.existingMateriFiles || []).length
    ) {
      showError(null, "Isi Link Materi atau upload minimal 1 file materi");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("judul", editModuleForm.judul || "");
      formData.append("deskripsi", editModuleForm.deskripsi || "");
      formData.append("goalsModule", editModuleForm.goalsModule || "");
      formData.append("linkMateri", editModuleForm.linkMateri || "");
      formData.append(
        "targetSkills",
        JSON.stringify(editModuleForm.targetSkills || []),
      );

      (editModuleForm.materiFiles || []).forEach((file) => {
        formData.append("materiFiles", file);
      });

      await moduleApi.update(editModuleId, formData);
      showSuccess("Modul berhasil diperbarui");
      await fetchModules();
      navigate("/dashboard/hr/modul");
    } catch (error) {
      showError(error, "Gagal memperbarui modul");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus modul ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      width: 420,
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await moduleApi.remove(moduleId);
      showSuccess("Modul berhasil dihapus");
      await fetchModules();
    } catch (error) {
      showError(error, "Gagal menghapus modul");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollModule = async (moduleId) => {
    setLoading(true);
    try {
      await logApi.create(moduleId);
      showSuccess("Berhasil daftar modul");
      await fetchLogs();
    } catch (error) {
      showError(error, "Gagal mendaftar modul");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (logId, submissionData) => {
    const link = (submissionData?.submissionLink || "").trim();
    const files = submissionData?.files || [];

    if (!link && !files.length) {
      showError(null, "Isi link tugas atau upload minimal 1 file tugas");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("submissionLink", link);
      files.forEach((file) => formData.append("submissionFiles", file));

      await logApi.submitTask(logId, formData);
      showSuccess("Tugas berhasil disubmit, menunggu validasi HR");
      await fetchLogs();
    } catch (error) {
      showError(error, "Gagal submit tugas");
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleParticipants = async (moduleId) => {
    setLoading(true);
    try {
      const response = await logApi.getByModule(moduleId);
      setModuleParticipants(response.data.data || []);
    } catch (error) {
      showError(error, "Gagal mengambil peserta modul");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModuleParticipants = async (moduleItem) => {
    setSelectedModuleForValidation(moduleItem);
    await fetchModuleParticipants(moduleItem._id);
    navigate("/dashboard/hr/modul/participants");
  };

  const handleValidateSubmission = async (logId, action, feedback) => {
    setLoading(true);
    try {
      await logApi.validate(logId, { action, feedback });
      showSuccess(
        action === "approve"
          ? "Karyawan dinyatakan lulus"
          : "Submission dikembalikan ke karyawan",
      );
      if (selectedModuleForValidation?._id) {
        await fetchModuleParticipants(selectedModuleForValidation._id);
      }
      await fetchLogs();
    } catch (error) {
      showError(error, "Gagal memvalidasi submission");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.create(newUserForm);
      showSuccess("Karyawan berhasil ditambahkan");
      setNewUserForm({
        nama: "",
        email: "",
        password: "",
        role: "Karyawan",
        divisi: "General",
      });
      await fetchUsers();
      navigate("/dashboard/hr/karyawan");
    } catch (error) {
      showError(error, "Gagal menambahkan karyawan");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        nama: newSkillForm.nama,
        deskripsi: newSkillForm.deskripsi,
      };

      await skillApi.create(payload);
      showSuccess("Skill berhasil dibuat");
      setNewSkillForm({ nama: "", deskripsi: "" });
      await fetchSkills();
      navigate("/dashboard/hr/skills");
    } catch (error) {
      console.error(
        "[App] handleCreateSkill error",
        error,
        error?.response?.data,
      );
      showError(error, "Gagal membuat skill");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSkill = async (event) => {
    event.preventDefault();
    if (!editSkillId.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Pilih skill terlebih dahulu",
        confirmButtonText: "OK",
        width: 420,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nama: editSkillForm.nama,
        deskripsi: editSkillForm.deskripsi,
      };
      const response = await skillApi.update(editSkillId, payload);
      console.log("[App] handleUpdateSkill response", response?.data);
      showSuccess("Skill berhasil diperbarui");
      setEditSkillId("");
      setEditSkillForm({ nama: "", deskripsi: "" });
      await fetchSkills();
      navigate("/dashboard/hr/skills");
    } catch (error) {
      console.error(
        "[App] handleUpdateSkill error",
        error,
        error?.response?.data,
      );
      showError(error, "Gagal memperbarui skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus skill ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      width: 420,
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const response = await skillApi.remove(skillId);
      console.log("[App] handleDeleteSkill response", response?.data);
      showSuccess("Skill berhasil dihapus");
      await fetchSkills();
    } catch (error) {
      console.error(
        "[App] handleDeleteSkill error",
        error,
        error?.response?.data,
      );
      showError(error, "Gagal menghapus skill");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (!editUserId.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Pilih karyawan terlebih dahulu",
        confirmButtonText: "OK",
        width: 420,
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nama: editUserForm.nama,
        email: editUserForm.email,
        role: editUserForm.role,
        divisi: editUserForm.divisi,
      };
      // If HR provided a new password, include it in the update payload
      if (editUserForm.password && editUserForm.password.trim() !== "") {
        payload.password = editUserForm.password;
      }
      await userApi.update(editUserId, payload);
      showSuccess("Data karyawan berhasil diperbarui");
      setEditUserId("");
      setEditUserForm({
        nama: "",
        email: "",
        role: "Karyawan",
        divisi: "",
        password: "",
      });
      await fetchUsers();
      navigate("/dashboard/hr/karyawan");
    } catch (error) {
      showError(error, "Gagal memperbarui karyawan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user?._id) {
      showError(null, "User tidak ditemukan");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nama: profileForm.nama,
        email: profileForm.email,
        divisi: profileForm.divisi,
        role: role === "Karyawan" ? "Karyawan" : profileForm.role,
      };

      const response = await userApi.update(user._id, payload);
      const updatedUser = response.data.data;
      // normalize id field if backend returns `id` instead of `_id`
      const normalized = { ...(updatedUser || {}) };
      if (!normalized._id && normalized.id) normalized._id = normalized.id;

      setUser(normalized);
      localStorage.setItem("user", JSON.stringify(normalized));
      // update profile form so UI reflects latest data immediately
      setProfileForm({
        nama: normalized.nama || "",
        email: normalized.email || "",
        divisi: normalized.divisi || "",
        role: normalized.role || "Karyawan",
      });
      showSuccess("Profil berhasil diperbarui");
    } catch (error) {
      showError(error, "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus karyawan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
      width: 420,
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await userApi.remove(userId);
      showSuccess("Karyawan berhasil dihapus");
      await fetchUsers();
    } catch (error) {
      showError(error, "Gagal menghapus karyawan");
    } finally {
      setLoading(false);
    }
  };

  const renderKaryawanDashboard = () => <KaryawanDashboardPage logs={logs} />;

  return (
    <main
      className={`min-h-screen ${
        isFullBleedRoute
          ? "bg-transparent p-0 text-slate-900"
          : "bg-slate-900 px-4 py-6 text-slate-100 sm:px-6 lg:px-8"
      }`}
    >
      {/* Notifications handled by SweetAlert2 */}

      <div
        className={`mx-auto w-full ${isFullBleedRoute ? "max-w-none" : "max-w-7xl"}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? role === "HR"
                      ? "/dashboard/hr"
                      : "/dashboard/karyawan"
                    : "/login"
                }
                replace
              />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={role === "HR" ? "/dashboard/hr" : "/dashboard/karyawan"}
                  replace
                />
              ) : (
                <AuthPage
                  activeAuthTab={activeAuthTab}
                  setActiveAuthTab={setActiveAuthTab}
                  loading={loading}
                  registerForm={registerForm}
                  setRegisterForm={setRegisterForm}
                  loginForm={loginForm}
                  setLoginForm={setLoginForm}
                  forgotPasswordForm={forgotPasswordForm}
                  setForgotPasswordForm={setForgotPasswordForm}
                  forgotPasswordStep={forgotPasswordStep}
                  onBackToEmailStep={handleBackToForgotEmailStep}
                  onRegister={handleRegister}
                  onLogin={handleLogin}
                  onRequestOtp={handleRequestForgotPasswordOtp}
                  onResetPassword={handleResetPasswordWithOtp}
                />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth isAuthenticated={isAuthenticated}>
                <Navigate
                  to={role === "HR" ? "/dashboard/hr" : "/dashboard/karyawan"}
                  replace
                />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/hr"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRDashboard logs={logs} />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/modul"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRModulIndex
                    modules={modules}
                    onDeleteModule={handleDeleteModule}
                    setEditModuleId={setEditModuleId}
                    setEditModuleForm={setEditModuleForm}
                    onOpenParticipants={handleOpenModuleParticipants}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/modul/participants"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRModulParticipants
                    selectedModule={selectedModuleForValidation}
                    participants={moduleParticipants}
                    onValidateSubmission={handleValidateSubmission}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/modul/create"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRModulCreate
                    newModuleForm={newModuleForm}
                    setNewModuleForm={setNewModuleForm}
                    onCreateModule={handleCreateModule}
                    loading={loading}
                    skills={skills}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/modul/edit"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRModulEdit
                    editModuleId={editModuleId}
                    editModuleForm={editModuleForm}
                    setEditModuleForm={setEditModuleForm}
                    onUpdateModule={handleUpdateModule}
                    loading={loading}
                    skills={skills}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/karyawan"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRKaryawanIndex
                    users={users}
                    onDeleteUser={handleDeleteUser}
                    setEditUserId={setEditUserId}
                    setEditUserForm={setEditUserForm}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/karyawan/create"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRKaryawanCreate
                    newUserForm={newUserForm}
                    setNewUserForm={setNewUserForm}
                    onCreateUser={handleCreateUser}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/karyawan/edit"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRKaryawanEdit
                    editUserId={editUserId}
                    editUserForm={editUserForm}
                    setEditUserForm={setEditUserForm}
                    onUpdateUser={handleUpdateUser}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/skills"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRSkillIndex
                    skills={skills}
                    onDeleteSkill={handleDeleteSkill}
                    setEditSkillId={setEditSkillId}
                    setEditSkillForm={setEditSkillForm}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/skills/create"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRSkillCreate
                    newSkillForm={newSkillForm}
                    setNewSkillForm={setNewSkillForm}
                    onCreateSkill={handleCreateSkill}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/skills/edit"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRSkillEdit
                    editSkillForm={editSkillForm}
                    setEditSkillForm={setEditSkillForm}
                    onUpdateSkill={handleUpdateSkill}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/hr/profile"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["HR"]}
              >
                <HRLayout user={user} onLogout={clearAuthData}>
                  <HRProfile
                    user={user}
                    editUserForm={profileForm}
                    setEditUserForm={setProfileForm}
                    onUpdateUser={handleUpdateProfile}
                    loading={loading}
                  />
                </HRLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/karyawan"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["Karyawan"]}
              >
                <KaryawanLayout user={user} onLogout={clearAuthData}>
                  {renderKaryawanDashboard()}
                </KaryawanLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/karyawan/modul"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["Karyawan"]}
              >
                <KaryawanLayout user={user} onLogout={clearAuthData}>
                  <KaryawanModulPage
                    modules={modules}
                    logs={logs}
                    loading={loading}
                    onEnrollModule={handleEnrollModule}
                    onSubmitTask={handleSubmitTask}
                  />
                </KaryawanLayout>
              </RequireRole>
            }
          />
          <Route
            path="/dashboard/karyawan/profile"
            element={
              <RequireRole
                isAuthenticated={isAuthenticated}
                userRole={role}
                allowedRoles={["Karyawan"]}
              >
                <KaryawanLayout user={user} onLogout={clearAuthData}>
                  <KaryawanProfile
                    user={user}
                    profileForm={profileForm}
                    setProfileForm={setProfileForm}
                    onUpdateProfile={handleUpdateProfile}
                    loading={loading}
                  />
                </KaryawanLayout>
              </RequireRole>
            }
          />
          <Route
            path="*"
            element={
              <Navigate
                to={
                  isAuthenticated
                    ? role === "HR"
                      ? "/dashboard/hr"
                      : "/dashboard/karyawan"
                    : "/login"
                }
                replace
              />
            }
          />
        </Routes>
      </div>
    </main>
  );
}

export default App;

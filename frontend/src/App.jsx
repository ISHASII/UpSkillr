import { useEffect, useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Toast from "./components/Toast";
import AuthPage from "./pages/AuthPage";
import HRLayout from "./pages/hr/HRLayout";
import HRDashboard from "./pages/hr/HRDashboard";
import HRModulIndex from "./pages/hr/modul/Index";
import HRModulCreate from "./pages/hr/modul/Create";
import HRModulEdit from "./pages/hr/modul/Edit";
import HRKaryawanIndex from "./pages/hr/karyawan/Index";
import HRKaryawanCreate from "./pages/hr/karyawan/Create";
import HRKaryawanEdit from "./pages/hr/karyawan/Edit";
import HRProfile from "./pages/hr/Profile";
import KaryawanDashboardPage from "./pages/KaryawanDashboardPage";
import {
  authApi,
  logApi,
  moduleApi,
  setUnauthorizedHandler,
  userApi,
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

const emptyModule = {
  judul: "",
  deskripsi: "",
  linkMateri: "",
  targetSkills: "",
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

  const [modules, setModules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);

  const [newModuleForm, setNewModuleForm] = useState(emptyModule);
  const [newUserForm, setNewUserForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "Karyawan",
  });
  const [editUserId, setEditUserId] = useState("");
  const [editUserForm, setEditUserForm] = useState({
    nama: "",
    email: "",
    role: "Karyawan",
  });
  const [profileForm, setProfileForm] = useState({
    nama: "",
    email: "",
    divisi: "",
    role: "Karyawan",
  });
  const [editModuleId, setEditModuleId] = useState("");
  const [editModuleForm, setEditModuleForm] = useState(emptyModule);

  const [skillsInput, setSkillsInput] = useState("");
  const [createLogModuleId, setCreateLogModuleId] = useState("");
  const [completeLogId, setCompleteLogId] = useState("");

  const [toast, setToast] = useState({ type: "", message: "" });
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

  useEffect(() => {
    if (!toast.message) return undefined;

    const timer = setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  const clearAuthData = (message) => {
    setToken("");
    setUser(null);
    setModules([]);
    setLogs([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (message) {
      setToast({ type: "error", message });
    }
  };

  const setAuthData = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    navigate(
      authData.user?.role === "HR" ? "/dashboard/hr" : "/dashboard/karyawan",
    );
  };

  const showError = (error, fallbackMessage) => {
    const message = error?.response?.data?.message || fallbackMessage;
    setToast({ type: "error", message });
  };

  const showSuccess = (message) => {
    setToast({ type: "success", message });
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
    if (!isAuthenticated || !canManageLogsHR) return;

    try {
      const response = await logApi.getAll();
      setLogs(response.data.data || []);
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
  useEffect(() => {
    fetchModules();
    fetchLogs();
    fetchUsers();
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

  const handleCreateModule = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...newModuleForm,
        targetSkills: newModuleForm.targetSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      await moduleApi.create(payload);
      showSuccess("Modul berhasil dibuat");
      setNewModuleForm(emptyModule);
      await fetchModules();
    } catch (error) {
      showError(error, "Gagal membuat modul");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateModule = async (event) => {
    event.preventDefault();
    if (!editModuleId.trim()) {
      setToast({ type: "error", message: "Isi Module ID terlebih dahulu" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        judul: editModuleForm.judul,
        deskripsi: editModuleForm.deskripsi,
        linkMateri: editModuleForm.linkMateri,
        targetSkills: editModuleForm.targetSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      Object.keys(payload).forEach((key) => {
        if (Array.isArray(payload[key])) {
          if (payload[key].length === 0) delete payload[key];
        } else if (!payload[key]) {
          delete payload[key];
        }
      });

      await moduleApi.update(editModuleId, payload);
      showSuccess("Modul berhasil diperbarui");
      await fetchModules();
    } catch (error) {
      showError(error, "Gagal memperbarui modul");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Yakin ingin menghapus modul ini?")) return;

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

  const handleUpdateSkills = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const skills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await userApi.updateProfileSkills(skills);
      const nextUser = { ...user, ...response.data.data };
      setUser(nextUser);
      localStorage.setItem("user", JSON.stringify(nextUser));
      showSuccess("Skills profile berhasil diperbarui");
    } catch (error) {
      showError(error, "Gagal memperbarui skills");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = async (event) => {
    event.preventDefault();

    if (!createLogModuleId.trim()) {
      setToast({ type: "error", message: "Pilih module terlebih dahulu" });
      return;
    }

    setLoading(true);
    try {
      const response = await logApi.create(createLogModuleId);
      const newLog = response.data.data;
      setLogs((prev) => [newLog, ...prev]);
      setCompleteLogId(newLog?._id || "");
      showSuccess("Progress log berhasil dibuat");
      await fetchModules();
    } catch (error) {
      showError(error, "Gagal membuat progress log");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLog = async (event) => {
    event.preventDefault();
    if (!completeLogId.trim()) {
      setToast({ type: "error", message: "Isi Log ID terlebih dahulu" });
      return;
    }

    setLoading(true);
    try {
      const response = await logApi.complete(completeLogId);
      const updatedLog = response.data.data;
      setLogs((prev) => {
        const exists = prev.some((item) => item._id === updatedLog._id);
        if (exists) {
          return prev.map((item) =>
            item._id === updatedLog._id ? updatedLog : item,
          );
        }
        return [updatedLog, ...prev];
      });
      showSuccess("Status log berhasil diubah ke Selesai");
      await fetchModules();
    } catch (error) {
      showError(error, "Gagal mengubah status log");
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
      setNewUserForm({ nama: "", email: "", password: "", role: "Karyawan" });
      await fetchUsers();
    } catch (error) {
      showError(error, "Gagal menambahkan karyawan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (!editUserId.trim()) {
      setToast({ type: "error", message: "Pilih karyawan terlebih dahulu" });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nama: editUserForm.nama,
        email: editUserForm.email,
        role: editUserForm.role,
      };
      await userApi.update(editUserId, payload);
      showSuccess("Data karyawan berhasil diperbarui");
      setEditUserId("");
      setEditUserForm({ nama: "", email: "", role: "Karyawan" });
      await fetchUsers();
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
        role: profileForm.role,
      };

      const response = await userApi.update(user._id, payload);
      const updatedUser = response.data.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      showSuccess("Profil berhasil diperbarui");
    } catch (error) {
      showError(error, "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Yakin ingin menghapus karyawan ini?")) return;

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

  const renderKaryawanDashboard = () => (
    <KaryawanDashboardPage
      user={user}
      loading={loading}
      modules={modules}
      logs={logs}
      onLogout={clearAuthData}
      skillsInput={skillsInput}
      setSkillsInput={setSkillsInput}
      onUpdateSkills={handleUpdateSkills}
      createLogModuleId={createLogModuleId}
      setCreateLogModuleId={setCreateLogModuleId}
      completeLogId={completeLogId}
      setCompleteLogId={setCompleteLogId}
      onCreateLog={handleCreateLog}
      onCompleteLog={handleCompleteLog}
    />
  );

  return (
    <main
      className={`min-h-screen ${
        isFullBleedRoute
          ? "bg-transparent p-0 text-slate-900"
          : "bg-slate-900 px-4 py-6 text-slate-100 sm:px-6 lg:px-8"
      }`}
    >
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ type: "", message: "" })}
      />

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
                  onRegister={handleRegister}
                  onLogin={handleLogin}
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
                {renderKaryawanDashboard()}
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

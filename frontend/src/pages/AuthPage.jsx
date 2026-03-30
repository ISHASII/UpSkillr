import { GoogleLogin } from "@react-oauth/google";

function AuthPage({
  activeAuthTab,
  setActiveAuthTab,
  loading,
  registerForm,
  setRegisterForm,
  loginForm,
  setLoginForm,
  forgotPasswordForm,
  setForgotPasswordForm,
  forgotPasswordStep,
  onBackToEmailStep,
  onRegister,
  onLogin,
  onGoogleLoginSuccess,
  onGoogleLoginError,
  googleLoginEnabled,
  onRequestOtp,
  onResetPassword,
}) {
  return (
    <section className="auth-bg relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />
      <div className="auth-grid" />

      <div className="glass-card relative z-10 w-full max-w-md rounded-3xl border border-slate-300/45 bg-white/35 px-6 py-7 shadow-2xl sm:px-8">
        <div className="mb-5 text-center">
          <img
            src="/Upskillr.png"
            alt="Upskillr logo"
            className="mx-auto mb-3 h-40 w-auto"
          />
          <p className="mt-1 text-sm text-slate-700">
            Employee Skill Matcher & Training Hub
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-400/25 p-1">
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeAuthTab === "login"
                ? "bg-white text-slate-900"
                : "bg-transparent text-slate-700"
            }`}
            type="button"
            onClick={() => setActiveAuthTab("login")}
          >
            Login
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeAuthTab === "register"
                ? "bg-white text-slate-900"
                : "bg-transparent text-slate-700"
            }`}
            type="button"
            onClick={() => setActiveAuthTab("register")}
          >
            Register
          </button>
        </div>

        {activeAuthTab === "login" ? (
          <form className="space-y-4" onSubmit={onLogin}>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Email</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="email"
                placeholder="Masukkan email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Password</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="password"
                placeholder="Masukkan password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                required
              />
            </div>

            <button
              className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? "Memproses..." : "Login"}
            </button>

            <button
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
              type="button"
              onClick={() => setActiveAuthTab("forgot-password")}
            >
              Lupa Password?
            </button>

            {googleLoginEnabled ? (
              <>
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-400/40" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white/50 px-3 text-xs text-slate-700">
                      atau
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={onGoogleLoginSuccess}
                    onError={onGoogleLoginError}
                    width="320"
                    text="signin_with"
                    shape="pill"
                  />
                </div>
              </>
            ) : null}
          </form>
        ) : activeAuthTab === "register" ? (
          <form className="space-y-3.5" onSubmit={onRegister}>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Nama</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="text"
                placeholder="Masukkan nama"
                value={registerForm.nama}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    nama: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Email</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="email"
                placeholder="Masukkan email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Password</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="password"
                placeholder="Masukkan password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Confirm Password</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="password"
                placeholder="Ulangi password"
                value={registerForm.confirmPassword}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }))
                }
                required
              />
            </div>

            <button
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? "Memproses..." : "Register"}
            </button>

            <p className="text-xs text-slate-700">
              Registrasi karyawan akan menunggu persetujuan HRD. Status
              persetujuan dikirim via email.
            </p>
          </form>
        ) : forgotPasswordStep === "email" ? (
          <form className="space-y-3.5" onSubmit={onRequestOtp}>
            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Email</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="email"
                placeholder="Masukkan email akun terdaftar"
                value={forgotPasswordForm.email}
                onChange={(event) =>
                  setForgotPasswordForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
              />
            </div>

            <button
              className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? "Memproses..." : "Kirim OTP ke Email"}
            </button>

            <button
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
              type="button"
              onClick={() => setActiveAuthTab("login")}
            >
              Kembali ke Login
            </button>
          </form>
        ) : (
          <form className="space-y-3.5" onSubmit={onResetPassword}>
            <div className="rounded-xl border border-emerald-300/60 bg-emerald-100/70 px-4 py-2 text-sm font-medium text-emerald-800">
              OTP terverifikasi. Silakan buat password baru.
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Email</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="email"
                placeholder="Masukkan email akun"
                value={forgotPasswordForm.email}
                onChange={(event) =>
                  setForgotPasswordForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                required
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">Password Baru</label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="password"
                placeholder="Masukkan password baru"
                value={forgotPasswordForm.newPassword}
                onChange={(event) =>
                  setForgotPasswordForm((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-800">
                Konfirmasi Password Baru
              </label>
              <input
                className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white outline-none placeholder:text-white"
                type="password"
                placeholder="Ulangi password baru"
                value={forgotPasswordForm.confirmNewPassword}
                onChange={(event) =>
                  setForgotPasswordForm((prev) => ({
                    ...prev,
                    confirmNewPassword: event.target.value,
                  }))
                }
                required
              />
            </div>

            <button
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={loading}
              type="submit"
            >
              {loading ? "Memproses..." : "Reset Password"}
            </button>

            <button
              className="w-full rounded-xl bg-transparent px-4 py-2 text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
              type="button"
              onClick={onBackToEmailStep}
            >
              Ganti Email / OTP
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default AuthPage;

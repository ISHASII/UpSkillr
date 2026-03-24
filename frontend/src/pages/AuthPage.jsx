function AuthPage({
  activeAuthTab,
  setActiveAuthTab,
  loading,
  registerForm,
  setRegisterForm,
  loginForm,
  setLoginForm,
  onRegister,
  onLogin,
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
          </form>
        ) : (
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
          </form>
        )}
      </div>
    </section>
  );
}

export default AuthPage;

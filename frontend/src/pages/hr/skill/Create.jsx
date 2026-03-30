import { useNavigate } from "react-router-dom";

function HRSkillCreate({
  newSkillForm,
  setNewSkillForm,
  onCreateSkill,
  loading,
}) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6 max-w-lg mx-auto">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Tambah Skill
      </h2>
      <form className="space-y-4" onSubmit={onCreateSkill}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Nama Skill"
          value={newSkillForm.nama}
          onChange={(e) =>
            setNewSkillForm((prev) => ({ ...prev, nama: e.target.value }))
          }
          required
        />
        <textarea
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Deskripsi (opsional)"
          value={newSkillForm.deskripsi}
          onChange={(e) =>
            setNewSkillForm((prev) => ({ ...prev, deskripsi: e.target.value }))
          }
          rows={4}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/skills")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            disabled={loading}
          >
            Tambah
          </button>
        </div>
      </form>
    </div>
  );
}

export default HRSkillCreate;

import { useNavigate } from "react-router-dom";

function HRSkillEdit({
  editSkillForm,
  setEditSkillForm,
  onUpdateSkill,
  loading,
}) {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6 max-w-lg mx-auto">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit Skill</h2>
      <form className="space-y-4" onSubmit={onUpdateSkill}>
        <input
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Nama Skill"
          value={editSkillForm.nama}
          onChange={(e) =>
            setEditSkillForm((prev) => ({ ...prev, nama: e.target.value }))
          }
          required
        />
        <textarea
          className="glass-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300"
          placeholder="Deskripsi (opsional)"
          value={editSkillForm.deskripsi}
          onChange={(e) =>
            setEditSkillForm((prev) => ({ ...prev, deskripsi: e.target.value }))
          }
          rows={4}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/dashboard/hr/skill")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300"
          >
            Back
          </button>

          <button
            type="submit"
            className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            disabled={loading}
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}

export default HRSkillEdit;

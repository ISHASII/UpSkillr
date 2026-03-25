const resolveSkillName = (skill) => {
  if (!skill) return "";
  if (typeof skill === "string") return skill;
  return skill.nama || skill._id || "";
};

function ModuleCards({ modules }) {
  return (
    <section className="glass-card rounded-2xl border border-slate-300/45 bg-white/35 p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Daftar Modul
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.length ? (
          modules.map((moduleItem) => (
            <article
              key={moduleItem._id}
              className="rounded-xl border border-slate-300/40 bg-white/45 p-4"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {moduleItem.judul}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-700">
                {moduleItem.deskripsi}
              </p>
              <a
                className="mt-3 inline-flex text-sm font-medium text-blue-700 underline-offset-2 hover:underline"
                href={moduleItem.linkMateri}
                rel="noreferrer"
                target="_blank"
              >
                Buka Materi
              </a>
              <p className="mt-3 text-xs text-slate-700">
                Target Skills:{" "}
                {(moduleItem.targetSkills || [])
                  .map(resolveSkillName)
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-slate-300/40 bg-white/45 p-4 text-sm text-slate-700">
            Belum ada modul tersedia.
          </div>
        )}
      </div>
    </section>
  );
}

export default ModuleCards;

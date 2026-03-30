import ModuleCards from "./components/ModuleCards";

function KaryawanModulPage({
  modules,
  recommendedModules,
  logs,
  loading,
  onEnrollModule,
  onSubmitTask,
}) {
  return (
    <ModuleCards
      modules={modules}
      recommendedModules={recommendedModules}
      logs={logs}
      loading={loading}
      onEnrollModule={onEnrollModule}
      onSubmitTask={onSubmitTask}
    />
  );
}

export default KaryawanModulPage;

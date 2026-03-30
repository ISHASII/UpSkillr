import ModuleCards from "./components/ModuleCards";

function KaryawanModulPage({
  modules,
  logs,
  loading,
  onEnrollModule,
  onSubmitTask,
}) {
  return (
    <ModuleCards
      modules={modules}
      logs={logs}
      loading={loading}
      onEnrollModule={onEnrollModule}
      onSubmitTask={onSubmitTask}
    />
  );
}

export default KaryawanModulPage;

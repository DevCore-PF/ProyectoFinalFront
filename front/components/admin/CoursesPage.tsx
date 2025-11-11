import { HiBookOpen } from "react-icons/hi";

import { FaPlus } from "react-icons/fa";
const CoursesPage = () => {
  return (
    <div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-font-light">
            Gestión de Cursos
          </h2>
          <button className="cursor-pointer bg-button hover:bg-button/80 text-font-light px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <FaPlus className="w-5 h-5" />
            Crear Curso
          </button>
        </div>

        <div className="grid gap-4">
          {/* Ejemplo placeholder ya que courses está comentado */}
          <div className="text-center py-12 bg-background2/40 border border-slate-700/50 rounded-xl">
            <HiBookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No hay cursos para mostrar</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;

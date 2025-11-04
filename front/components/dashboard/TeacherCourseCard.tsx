import { HiEye, HiEyeOff, HiStar, HiUsers } from "react-icons/hi";
import { Course } from "@/types/course.types";

interface TeacherCourseCardProps {
  course: Course;
  viewDetails: (id: string) => void;
}

const TeacherCourseCard = ({ course, viewDetails }: TeacherCourseCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLICADO":
        return "text-green-600 border-green-500/30";
      case "EN REVISION":
        return "text-yellow-600 border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "PUBLICADO":
        return "Publicado";
      case "EN REVISION":
        return "En revisión";
      default:
        return "Borrador";
    }
  };

  const formatPrice = (price: number | string | undefined): string => {
    try {
      const numPrice = typeof price === 'number' ? price : parseFloat(price || '0');
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Mock data for demo - valores determinísticos basados en el ID del curso
  const seedFromId = course.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const mockStudents = (seedFromId % 50) + 1;
  const mockRating = ((seedFromId % 20) / 10 + 3).toFixed(1); // Entre 3.0 y 5.0
  const isPublic = course.status === "PUBLICADO";

  return (
    <div className="group bg-slate-900/50 backdrop-blur-xs border border-slate-700/30 rounded-xl p-4 sm:p-5">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-200 mb-2">
            {course.title || "Título no disponible"}
          </h3>

          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <HiUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="font-medium">{mockStudents} alumnos</span>
            </div>
            | <span className="hidden xs:inline">|</span>
            <div className="flex items-center gap-1.5">
              <HiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="font-medium">{mockRating}</span>
            </div>
            |<span className="hidden xs:inline">|</span>
            <div className="flex gap-1">
              <span className="font-bold text-slate-400">
                ${formatPrice(course.price)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex justify-center items-center border whitespace-nowrap self-start ${getStatusColor(
            course.status
          )}`}
        >
          {getStatusDisplay(course.status)}
        </div>
      </div>

      <div className=" flex justify-between items-center gap-3 sm:gap-4 mb-4 text-xs sm:text-sm pb-4 border-b border-slate-700/30">
        <div>
          <span className="text-slate-500 text-xs font-medium block mb-1">
            Creado:
          </span>
          <p className=" text-slate-300 font-semibold">{formatDate(course.createdAt)}</p>
        </div>
        <div>
          <span className="text-slate-500 text-xs font-medium block mb-1">
            Actualizado:
          </span>
          <p className="text-slate-300 font-semibold">{formatDate(course.updatedAt)}</p>
        </div>
      </div>

      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 mb-4">
        <div className="text-xs sm:text-sm">
          <span className="text-slate-500 font-medium">Duración: </span>
          <span className="text-slate-300 font-bold">
            {course.duration || "No especificado"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {isPublic ? (
            <>
              <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
              <span className="text-green-600">Público</span>
            </>
          ) : (
            <>
              <HiEyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <span className="text-slate-400">En revisión</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 mb-4">
        <div className="text-xs sm:text-sm flex-1">
          <span className="text-slate-500 font-medium">Categoría: </span>
          <span className="text-slate-300 font-semibold">{course.category || "Sin categoría"}</span>
        </div>
        <div className="text-xs sm:text-sm">
          <span className="text-slate-500 font-medium">Dificultad: </span>
          <span className="text-slate-300 font-semibold">{course.difficulty || "No especificado"}</span>
        </div>
      </div>

      <div className="text-xs sm:text-sm mb-4">
        <span className="text-slate-500 font-medium">Lecciones: </span>
        <span className="text-slate-300 font-semibold">{course.lessons?.length || 0}</span>
      </div>

      <button
        onClick={() => viewDetails(course.id)}
        className="w-full bg-button/30 hover:bg-button/40 active:bg-button/50 cursor-pointer text-purple-100 py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
      >
        Ver detalles
      </button>
    </div>
  );
};

export default TeacherCourseCard;
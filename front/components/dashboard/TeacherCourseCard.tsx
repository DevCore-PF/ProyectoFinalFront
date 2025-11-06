import { HiEye, HiEyeOff, HiBookOpen, HiClock, HiTag, HiAcademicCap } from "react-icons/hi";
import { Course, CourseCategory } from "@/types/course.types";
import { categoryConfig } from "@/helpers/course.helpers";
import { useRouter } from "next/navigation";

interface TeacherCourseCardProps {
  course: Course;
  viewDetails?: (id: string) => void; 
}

const TeacherCourseCard = ({ course }: TeacherCourseCardProps) => {
  const router = useRouter();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLICADO":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "EN REVISION":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
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

  // Función para obtener colores de dificultad
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'principiante':
      case 'beginner':
      case 'básico':
        return 'bg-green-500/10 border border-green-500/30 text-green-400';
      case 'intermedio':
      case 'intermediate':
        return 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400';
      case 'avanzado':
      case 'advanced':
        return 'bg-red-500/10 border border-red-500/30 text-red-400';
      default:
        return 'bg-slate-700/50 text-slate-300';
    }
  };

  // Obtener configuración de categoría para iconos y colores
  const config = categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
  const Icon = config.icon;
  
  const isPublic = course.status === "PUBLICADO";
  const lessonsCount = course.lessons?.length || 0;

  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/30">
      {/* Header con ícono y estado */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className={`bg-gradient-to-br ${config.iconGradient} p-3 rounded-xl shadow-lg w-12 h-12 flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">
              {course.title || "Título no disponible"}
            </h3>
            <p className="text-slate-300 text-sm line-clamp-2">
              {course.description || "Sin descripción"}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap ${getStatusColor(course.status)}`}>
          {getStatusDisplay(course.status)}
        </div>
      </div>

      {/* Tags informativos */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-lg text-xs">
          <HiClock className="w-3 h-3" />
          <span className="font-medium">{course.duration || "No especificado"}</span>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${getDifficultyColors(course.difficulty)}`}>
          <HiAcademicCap className="w-3 h-3" />
          <span className="font-medium">{course.difficulty || "No especificado"}</span>
        </div>
        <div className={`flex items-center gap-2 ${config.badgeColor} border px-3 py-1.5 rounded-lg text-xs font-semibold`}>
          <HiTag className="w-3 h-3" />
          <span className={config.textColor}>{course.category || "Sin categoría"}</span>
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span>${formatPrice(course.price)}</span>
        </div>
      </div>

      {/* Información de lecciones y estado */}
      <div className="flex items-center justify-between mb-4 p-3 bg-slate-800/30 rounded-lg">
        <div className="flex items-center gap-2">
          <HiBookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-slate-300">
            {lessonsCount} {lessonsCount === 1 ? 'lección' : 'lecciones'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isPublic ? (
            <>
              <HiEye className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">Visible</span>
            </>
          ) : (
            <>
              <HiEyeOff className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium">En proceso</span>
            </>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="bg-slate-800/30 rounded-lg p-3">
          <span className="text-slate-500 font-medium block mb-1">Creado:</span>
          <p className="text-slate-300 font-semibold">{formatDate(course.createdAt)}</p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-3">
          <span className="text-slate-500 font-medium block mb-1">Actualizado:</span>
          <p className="text-slate-300 font-semibold">{formatDate(course.updatedAt)}</p>
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={() => router.push(`/course/${course.id}`)}
        className="w-full bg-gradient-to-r from-[#7e4bde] to-[#6d3dc4] hover:from-[#6d3dc4] hover:to-[#5c2db3] text-white py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 transform hover:scale-[1.02]"
      >
        Ver detalles del curso
      </button>
    </div>
  );
};

export default TeacherCourseCard;
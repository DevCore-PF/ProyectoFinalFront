import { HiBookOpen, HiClock, HiTag, HiAcademicCap } from "react-icons/hi";
import {
  Course,
  CourseCategory,
  CourseVisibility,
  CourseStatus,
} from "@/types/course.types";
import { categoryConfig } from "@/helpers/course.helpers";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import VisibilityToggle from "./VisibilityToggle";

interface TeacherCourseCardProps {
  course: Course;
  viewDetails?: (id: string) => void;
  onVisibilityChange?: (
    courseId: string,
    newVisibility: CourseVisibility
  ) => void;
}

const TeacherCourseCard = ({
  course,
  onVisibilityChange,
}: TeacherCourseCardProps) => {
  const router = useRouter();

  // Usar la visibilidad real del curso que viene del backend
  const [currentVisibility, setCurrentVisibility] = useState<CourseVisibility>(
    course.visibility
  );

  // Sincronizar la visibilidad cuando cambie la prop del curso
  useEffect(() => {
    console.log(`🔍 Curso ${course.id}:`);
    console.log(`   Status: "${course.status}"`);
    console.log(`   Visibilidad actual: ${currentVisibility}`);
    console.log(`   Visibilidad del curso: ${course.visibility}`);

    if (course.visibility !== currentVisibility) {
      setCurrentVisibility(course.visibility);
      console.log(`✅ Visibilidad actualizada a: ${course.visibility}`);
    } else {
      console.log(`ℹ️  No hay cambios en la visibilidad`);
    }
  }, [course.visibility, course.id, course.updatedAt, currentVisibility]);

  const handleVisibilityChange = (newVisibility: CourseVisibility) => {
    setCurrentVisibility(newVisibility);
    onVisibilityChange?.(course.id, newVisibility);
  };
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
      const numPrice =
        typeof price === "number" ? price : parseFloat(price || "0");
      return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
    } catch {
      return "0.00";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Función para obtener colores de dificultad
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "principiante":
      case "beginner":
      case "básico":
        return "bg-green-400/10 border border-green-400/30 text-green-400";
      case "intermedio":
      case "intermediate":
        return "bg-yellow-400/10 border border-yellow-400/30 text-yellow-400";
      case "avanzado":
      case "advanced":
        return "bg-amber-400/10 border border-amber-400/30 text-amber-400";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  // Obtener configuración de categoría para iconos y colores
  const config =
    categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
  const Icon = config.icon;

  const isPublic = course.status === "PUBLICADO";
  const lessonsCount = course.lessons?.length || 0;

  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/30">
      {/* Header con ícono y estado */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          <div
            className={`bg-gradient-to-br ${config.iconGradient} p-2.5 sm:p-3 rounded-xl shadow-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0`}
          >
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-font-light" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-font-light mb-1 line-clamp-2 break-words">
              {course.title || "Título no disponible"}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 break-words">
              {course.description || "Sin descripción"}
            </p>
          </div>
        </div>
        <div
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap self-start ${getStatusColor(
            course.status
          )}`}
        >
          {getStatusDisplay(course.status)}
        </div>
      </div>

      {/* Tags informativos */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-700/50 text-slate-300 px-2 sm:px-3 py-1.5 rounded-lg text-xs">
          <HiClock className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium truncate">
            {course.duration || "No especificado"}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold ${getDifficultyColors(
            course.difficulty
          )}`}
        >
          <HiAcademicCap className="w-3 h-3 flex-shrink-0" />
          <span className="font-medium truncate">
            {course.difficulty || "No especificado"}
          </span>
        </div>
        <div
          className={`flex items-center gap-1.5 sm:gap-2 ${config.badgeColor} border px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold`}
        >
          <HiTag className="w-3 h-3 flex-shrink-0" />
          <span className="text-slate-100 truncate">
            {course.category || "Sin categoría"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span>${formatPrice(course.price)}</span>
        </div>
      </div>

      {/* Información de lecciones y estado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 p-3 bg-slate-800/30 rounded-lg">
        <div className="flex items-center gap-2">
          <HiBookOpen className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            {lessonsCount} {lessonsCount === 1 ? "lección" : "lecciones"}
          </span>
        </div>

        {/* Visibility Toggle */}
        <div className="flex justify-start sm:justify-end">
          <VisibilityToggle
            courseId={course.id}
            courseStatus={course.status}
            currentVisibility={currentVisibility}
            onVisibilityChange={handleVisibilityChange}
          />
        </div>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 text-xs">
        <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
          <span className="text-slate-300 font-medium block mb-1">Creado:</span>
          <p className="text-slate-100 font-semibold break-words">
            {formatDate(course.createdAt)}
          </p>
        </div>
        <div className="bg-slate-800/30 rounded-lg p-2 sm:p-3">
          <span className="text-slate-300 font-medium block mb-1">
            Actualizado:
          </span>
          <p className="text-slate-100 font-semibold break-words">
            {formatDate(course.updatedAt)}
          </p>
        </div>
      </div>

      {/* Botón de acción */}
      <button
        onClick={() => router.push(`/course/${course.id}`)}
        className="w-full bg-button/80  cursor-pointer  hover:bg-button  text-font-light py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg  transform hover:scale-[1.02]"
      >
        Ver detalles del curso
      </button>
    </div>
  );
};

export default TeacherCourseCard;

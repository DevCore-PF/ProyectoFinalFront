"use client";
import React, { useState, useEffect } from "react";
import { HiEye, HiLockClosed } from "react-icons/hi";
import { CourseVisibility, CourseStatus } from "@/types/course.types";
import { courseVisibilityService } from "@/services/course-visibility.service";
import { useAuth } from "@/context/UserContext";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";

interface VisibilityToggleProps {
  courseId: string;
  currentVisibility: CourseVisibility;
  courseStatus?: string;
  onVisibilityChange?: (newVisibility: CourseVisibility) => void;
  disabled?: boolean;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  courseId,
  currentVisibility,
  courseStatus,
  onVisibilityChange,
  disabled = false,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [visibility, setVisibility] = useState(currentVisibility);
  const { token } = useAuth();

  const isPublic = visibility === CourseVisibility.PUBLIC;

  // Solo cursos PUBLICADOS pueden cambiar de visibilidad
  const canToggleVisibility =
    courseStatus === "PUBLICADO" || courseStatus === CourseStatus.PUBLISHED;
  const isActuallyDisabled = disabled || !canToggleVisibility;

  // Función para obtener el estado del curso para mostrar al usuario
  const getCourseStatusDisplay = () => {
    const statusStr = courseStatus as string;
    if (statusStr === "PUBLICADO" || statusStr === CourseStatus.PUBLISHED) {
      return null; // No mostrar nada, usar textos normales
    }
    if (statusStr === "RECHAZADO" || statusStr === CourseStatus.REJECT) {
      return "Rechazado";
    }
    return "En revisión"; // EN REVISION y otros estados
  };

  // Función para obtener el mensaje del tooltip
  const getTooltipMessage = () => {
    if (canToggleVisibility) return "";

    const statusStr = courseStatus as string;
    if (statusStr === "RECHAZADO" || statusStr === CourseStatus.REJECT) {
      return "Los cursos rechazados no pueden cambiar de visibilidad";
    }
    return "Solo los cursos publicados pueden cambiar de visibilidad";
  };

  // Función para obtener el color del texto según el estado
  const getTextColor = () => {
    if (canToggleVisibility) {
      return isPublic ? "text-green-300" : "text-amber-300";
    }

    const statusStr = courseStatus as string;
    if (statusStr === "RECHAZADO" || statusStr === CourseStatus.REJECT) {
      return "text-amber-300"; // Rojo para rechazado
    }
    return "text-slate-300"; // Gris para en revisión
  };

  // Sincronizar la visibilidad cuando cambie la prop currentVisibility
  useEffect(() => {
    console.log(
      `🔄 VisibilityToggle - Sincronizando visibilidad del curso ${courseId}:`
    );
    console.log(`   Visibilidad actual: ${visibility}`);
    console.log(`   Nueva visibilidad prop: ${currentVisibility}`);

    if (currentVisibility !== visibility) {
      setVisibility(currentVisibility);
      console.log(`✅ Visibilidad actualizada: ${currentVisibility}`);
    }
  }, [currentVisibility, courseId, visibility]);

  const handleToggleVisibility = async () => {
    if (isActuallyDisabled || !token || isChanging) return;

    // Calcular la nueva visibilidad antes de hacer la petición
    const newVisibility =
      visibility === CourseVisibility.PUBLIC
        ? CourseVisibility.PRIVATE
        : CourseVisibility.PUBLIC;

    try {
      setIsChanging(true);

      // Actualización optimista: cambiar inmediatamente la UI
      setVisibility(newVisibility);
      onVisibilityChange?.(newVisibility);

      // Hacer la petición al backend
      const response = await courseVisibilityService.toggleVisibility(
        courseId,
        token
      );

      console.log("📥 Respuesta del servicio de visibilidad:", response);

      // Verificar que el backend confirmó el cambio
      const backendVisibility =
        response.visibility === "PUBLICO"
          ? CourseVisibility.PUBLIC
          : CourseVisibility.PRIVATE;

      // Solo actualizar si hay discrepancia (rollback en caso de error)
      if (backendVisibility !== newVisibility) {
        console.warn("🔄 Rollback: Discrepancia entre frontend y backend");
        setVisibility(backendVisibility);
        onVisibilityChange?.(backendVisibility);
      }

      console.log(`✅ Visibilidad confirmada: ${backendVisibility}`);
      toastSuccess(`Curso ahora es ${backendVisibility.toLowerCase()}`);
    } catch (error) {
      console.error("Error changing visibility:", error);

      // Rollback en caso de error
      const rollbackVisibility =
        newVisibility === CourseVisibility.PUBLIC
          ? CourseVisibility.PRIVATE
          : CourseVisibility.PUBLIC;

      setVisibility(rollbackVisibility);
      onVisibilityChange?.(rollbackVisibility);

      toastError("Error al cambiar la visibilidad del curso");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Estado actual texto */}
      <span
        className={`text-xs font-medium ${
          isPublic ? "text-green-400" : "text-amber-400"
        }`}
      >
        {isPublic ? "Público" : "Privado"}
      </span>

      {/* Toggle switch */}
      <button
        onClick={handleToggleVisibility}
        disabled={isActuallyDisabled || isChanging}
        title={getTooltipMessage()}
        className={`
          relative inline-flex items-center h-6 w-11 sm:w-12 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0
          ${
            isPublic
              ? "bg-gradient-to-r from-green-400 to-blue-500"
              : "bg-gradient-to-r from-gray-600 to-amber-500"
          }
          ${!canToggleVisibility ? "opacity-60" : ""}
        `}
      >
        <span
          className={`
            inline-flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ease-in-out
            ${isPublic ? "translate-x-5 sm:translate-x-6" : "translate-x-0.5"}
          `}
        >
          {isChanging ? (
            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : isPublic ? (
            <HiEye className="w-3 h-3 text-green-600 mx-auto" />
          ) : (
            <HiLockClosed className="w-3 h-3 text-amber-600 mx-auto" />
          )}
        </span>
      </button>

      {/* Tooltip/helper text - oculto en móvil */}
      <span className={`hidden sm:inline text-xs font-medium ${getTextColor()}`}>
        {!canToggleVisibility
          ? getCourseStatusDisplay()
          : isPublic
          ? "Visible para todos"
          : "Solo tú puedes verlo"}
      </span>
    </div>
  );
};

export default VisibilityToggle;

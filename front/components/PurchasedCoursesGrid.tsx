"use client";

import React from "react";
import Link from "next/link";
import { PurchasedCourse } from "@/services/purchased-courses.service";
import { usePurchasedCourses } from "@/hooks/usePurchasedCourses";
import { categoryConfig } from "@/helpers/course.helpers";
import { CourseCategory } from "@/types/course.types";
import { HiBookOpen, HiCheckCircle, HiClock, HiAcademicCap, HiPlay } from "react-icons/hi";

interface PurchasedCourseCardProps {
  course: PurchasedCourse;
}

const PurchasedCourseCard: React.FC<PurchasedCourseCardProps> = ({ course }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
      case "principiante":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "intermediate":
      case "intermedio":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "advanced":
      case "avanzado":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const getCategoryConfig = (category: string) => {
    const categoryMapping: Record<string, CourseCategory> = {
      Frontend: CourseCategory.FRONTEND,
      "Front End": CourseCategory.FRONTEND,
      Backend: CourseCategory.BACKEND,
      "Mobile Development": CourseCategory.MOBILE_DEVELOPMENT,
      "Data Science": CourseCategory.DATA_SCIENCE,
      Database: CourseCategory.DATABASE,
      "Video Games": CourseCategory.VIDEO_GAMES,
    };

    const mappedCategory = categoryMapping[category] || CourseCategory.FRONTEND;
    return categoryConfig[mappedCategory];
  };

  const config = getCategoryConfig(course.category);
  const Icon = config.icon;

  const isCompleted = course.progress >= 100 || course.completed;

  const totalLessons = course.totalLessons || 0;
  const completedLessons = course.completedLessons || 0;
  const lessonsProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : course.progress;

  return (
    <div className="bg-[#1e1e2e] border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#3f4273]/20">
      {/* Header con ícono de categoría - SIN espacio para imagen */}
      <div className="relative p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`bg-gradient-to-br ${config.iconGradient} p-3 rounded-xl shadow-lg w-14 h-14 flex items-center justify-center`}
          >
            <Icon className="w-7 h-7 text-font-light" />
          </div>

          {isCompleted && (
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30 flex items-center gap-1">
              <HiCheckCircle className="w-3 h-3" />
              Completado
            </div>
          )}
        </div>

        {/* Título y descripción */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-font-light mb-2 line-clamp-2">{course.title}</h3>
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{course.description}</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-6 pb-6 space-y-4">
        {/* Tags de categoría y dificultad */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${config.badgeColor} ${config.textColor}`}
          >
            {course.category}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
              course.difficulty
            )}`}
          >
            {course.difficulty}
          </span>
        </div>

        {/* Progreso de lecciones - Siempre visible */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <HiBookOpen className="w-4 h-4" />
              <span>Lecciones</span>
            </div>
            <span className="text-white font-medium">
              {completedLessons}/{totalLessons}
            </span>
          </div>

          {/* Barra de progreso de lecciones */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${lessonsProgress}%` }}
            />
          </div>

          {/* Lista de lecciones (máximo 3 visibles) */}
          {course.lessons && course.lessons.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-gray-400 mb-2">Últimas lecciones:</div>
              {course.lessons.slice(0, 3).map((lesson) => (
                <div key={lesson.id} className="flex items-center gap-2 text-xs">
                  {lesson.completed ? (
                    <HiCheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-gray-600 flex-shrink-0" />
                  )}
                  <span className={`line-clamp-1 ${lesson.completed ? "text-gray-300" : "text-gray-500"}`}>
                    {lesson.title}
                  </span>
                </div>
              ))}
              {course.lessons.length > 3 && (
                <div className="text-xs text-gray-500 ml-5">+{course.lessons.length - 3} lecciones más</div>
              )}
            </div>
          )}
        </div>

        {/* Progreso general */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progreso general</span>
            <span className="text-font-light font-medium">{Math.round(lessonsProgress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${lessonsProgress}%` }}
            />
          </div>
        </div>

        {/* Información adicional */}
        <div className="flex justify-between items-center text-sm text-gray-400 pt-2 border-t border-gray-700/50">
          <div className="flex items-center gap-1">
            <HiClock className="w-4 h-4" />
            <span>Comprado: {formatDate(course.purchaseDate)}</span>
          </div>
          <span className="text-green-400 font-medium">${course.priceAtPurchase}</span>
        </div>

        {/* Botón de acción dinámico */}
        <Link
          href={`/course/${course.id}`}
          className={`block w-full text-center py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
            isCompleted
              ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-font-light"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isCompleted ? (
              <>
                <HiAcademicCap className="w-5 h-5" />
                Curso completado
              </>
            ) : (
              <>
                <HiPlay className="w-5 h-5" />
                Continuar aprendiendo
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

interface PurchasedCoursesGridProps {
  className?: string;
}

export const PurchasedCoursesGrid: React.FC<PurchasedCoursesGridProps> = ({ className = "" }) => {
  const { purchasedCourses, loading, error } = usePurchasedCourses();

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Cargando cursos comprados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-12">
          <div className="text-amber-400 mb-4">❌ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-font-light transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (purchasedCourses.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-16 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
          <h3 className="text-xl font-bold text-font-light mb-2">
            <HiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            No has comprado cursos aún
          </h3>
          <p className="text-gray-400 mb-6">Explora nuestro catálogo y encuentra el curso perfecto para ti</p>
          <Link
            href="/courses"
            className="inline-block bg-button/80 hover:bg-button cursor-pointer px-6 py-3 rounded-lg text-font-light font-medium transition-all duration-300"
          >
            Explorar cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-font-light">
          Mis Cursos Comprados ({purchasedCourses.length})
        </h3>
        <div className="text-sm text-gray-400">
          {purchasedCourses.filter((course) => course.completed || course.progress >= 100).length} completados
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedCourses.map((course) => (
          <PurchasedCourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

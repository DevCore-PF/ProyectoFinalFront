"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/course.types";
import { getCourseByIdService } from "@/services/course.services";
import { categoryConfig } from "@/helpers/course.helpers";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { CourseCompletionFeedback } from "@/components/CourseCompletionFeedback";
import CourseReviews from "@/components/CourseReviews";
import { ProgressBar } from "@/components/ProgressBar";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import { courseFeedbackService } from "@/services/course-feedback.service";
import { purchasedCoursesService } from "@/services/purchased-courses.service";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/UserContext";
import {
  CourseCategory,
  CourseDifficulty,
  CourseType,
} from "@/types/course.types";
import {
  HiArrowLeft,
  HiPlay,
  HiDocumentText,
  HiChevronDown,
  HiChevronUp,
  HiClock,
  HiAcademicCap,
  HiTag,
  HiCheckCircle,
  HiLockClosed,
} from "react-icons/hi";
import Loader from "@/components/Loaders/Loader";

// Helper function para extraer el nombre del archivo de la URL de Cloudinary
const getFileNameFromCloudinaryUrl = (url: string): string => {
  try {
    // Extraer el nombre del archivo de la URL
    // Formato típico: https://res.cloudinary.com/.../upload/v.../nombreArchivo.ext
    const urlParts = url.split("/");
    const fileNameWithExtension = urlParts[urlParts.length - 1];

    // Si tiene parámetros de query, removerlos
    const fileName = fileNameWithExtension.split("?")[0];

    // Decodificar caracteres especiales si existen
    return decodeURIComponent(fileName);
  } catch (error) {
    console.error("Error extracting filename from URL:", error);
    return "Archivo";
  }
};

// Helper function para obtener solo el nombre sin extensión (para mostrar más limpio)
const getCleanFileName = (url: string): string => {
  const fullName = getFileNameFromCloudinaryUrl(url);
  const nameWithoutExtension = fullName.replace(/\.[^/.]+$/, ""); // Remover extensión

  // Si el nombre es muy largo, truncarlo pero mantener el inicio y final
  if (nameWithoutExtension.length > 50) {
    return (
      nameWithoutExtension.substring(0, 25) +
      "..." +
      nameWithoutExtension.substring(nameWithoutExtension.length - 20)
    );
  }

  return nameWithoutExtension;
};

// Helper function para capitalizar la primera letra
const capitalizeFileName = (fileName: string): string => {
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
};

const CourseDetailPage: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  const [completingLessons, setCompletingLessons] = useState<Set<string>>(
    new Set()
  );
  const [showingFeedback, setShowingFeedback] = useState(false);
  const [hasProvidedFeedback, setHasProvidedFeedback] = useState(false);
  const [hasAccessToCourse, setHasAccessToCourse] = useState<boolean>(false);
  const [checkingAccess, setCheckingAccess] = useState<boolean>(true);

  const { courseId } = useParams();
  const router = useRouter();
  const { token, user } = useAuth();

  // Verificar si el usuario es el creador del curso
  const isCourseCreator =
    user?.professorProfile &&
    typeof user.professorProfile === "object" &&
    course?.professor?.id === user.professorProfile.id;

  // Usar nuestro nuevo hook para manejar el progreso
  const {
    totalCompleted,
    loading: progressLoading,
    error: progressError,
    markLessonCompleted,
    isLessonCompleted,
    isLessonEnabled,
    isCourseCompleted,
    setError: setProgressError,
  } = useLessonProgress(courseId as string, isCourseCreator, hasAccessToCourse);

  // Cart hooks
  const { cart } = useCart();
  const { handleAddToCart } = useAddToCart();
  const { handleRemoveFromCart } = useRemoveFromCart();
  const isInCart = cart.some((item) => item.id === course?.id);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const courseData = await getCourseByIdService(
          courseId as string,
          token || undefined
        );
        setCourse(courseData);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Verificar si el usuario tiene acceso al curso (lo compró o es el profesor)
  useEffect(() => {
    const checkCourseAccess = async () => {
      if (!user || !token || !course) {
        setHasAccessToCourse(false);
        setCheckingAccess(false);
        return;
      }

      try {
        setCheckingAccess(true);

        // Verificar si es el profesor del curso
        const isOwner =
          user?.professorProfile &&
          typeof user.professorProfile === "object" &&
          course.professor?.id === user.professorProfile.id;

        if (isOwner) {
          setHasAccessToCourse(true);
          setCheckingAccess(false);
          return;
        }

        // Verificar si compró el curso
        const purchasedCourses =
          await purchasedCoursesService.getMyPurchasedCourses(token);
        const hasPurchased = purchasedCourses.some(
          (purchasedCourse) => purchasedCourse.id === course.id
        );

        setHasAccessToCourse(hasPurchased);
      } catch (error) {
        console.error("Error verificando acceso al curso:", error);
        setHasAccessToCourse(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkCourseAccess();
  }, [user, token, course]);

  // Verificar cuando se completa el curso y si ya tiene feedback
  useEffect(() => {
    const checkCourseCompletionAndFeedback = async () => {
      if (course && course.lessons && !progressLoading && user && token) {
        const totalLessons = course.lessons.length;

        if (isCourseCompleted(totalLessons)) {
          // Verificar si el usuario ya envió feedback
          try {
            const hasFeedback = await courseFeedbackService.hasUserFeedback(
              courseId as string,
              token
            );
            setHasProvidedFeedback(hasFeedback);
          } catch (error) {
            console.error("Error verificando feedback:", error);
            // En caso de error, asumir que no ha enviado feedback
            setHasProvidedFeedback(false);
          }
        }
      }
    };

    checkCourseCompletionAndFeedback();
  }, [
    course,
    totalCompleted,
    progressLoading,
    isCourseCompleted,
    courseId,
    user,
    token,
  ]);

  // Función para manejar cuando se envía el feedback
  const handleFeedbackSubmitted = async () => {
    setHasProvidedFeedback(true);
    setShowingFeedback(false);

    // Verificar nuevamente desde el backend para asegurar consistencia
    if (user && token) {
      try {
        const hasFeedback = await courseFeedbackService.hasUserFeedback(
          courseId as string,
          token
        );
        setHasProvidedFeedback(hasFeedback);
      } catch (error) {
        console.error("Error verificando feedback post-envío:", error);
      }
    }
  };

  // Función para manejar la finalización de lección
  const handleLessonCompletion = async (lessonId: string) => {
    try {
      setProgressError(null);
      setCompletingLessons((prev) => new Set(prev).add(lessonId));

      const success = await markLessonCompleted(lessonId);

      if (success) {
        // Mostrar notificación de éxito
        const lessonIndex = course?.lessons.findIndex((l) => l.id === lessonId);
        const lessonNumber = lessonIndex !== undefined ? lessonIndex + 1 : "";
        const successMessage = `¡Excelente! Has completado la lección ${lessonNumber}`;
        toastSuccess(successMessage);
      }
    } catch (error) {
      console.error("Error handling lesson completion:", error);
      setProgressError(
        "Error al marcar lección como completada. Inténtalo de nuevo."
      );
      toastError("Error al marcar lección como completada");
    } finally {
      setCompletingLessons((prev) => {
        const newSet = new Set(prev);
        newSet.delete(lessonId);
        return newSet;
      });
    }
  };

  // Función para verificar si una lección está disponible
  const isLessonAvailable = (lessonIndex: number): boolean => {
    if (!course?.lessons) return false;

    // Si no tiene acceso al curso, no puede acceder a las lecciones
    if (!hasAccessToCourse) return false;

    return isLessonEnabled(lessonIndex, course.lessons);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  if (loading || progressLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-400 text-lg mb-4">
            {error || "Curso no encontrado"}
          </p>
          {progressError && (
            <p className="text-yellow-400 text-sm mb-4">{progressError}</p>
          )}
          <button
            onClick={() => router.back()}
            className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-4 py-2 rounded-lg text-font-light font-semibold transition-all duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Obtener configuración de categoría
  const config =
    categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
  const Icon = config.icon;

  // Mapear dificultades y tipos
  const difficultyMap = {
    [CourseDifficulty.BEGINNER]: "Principiante",
    [CourseDifficulty.INTERMEDIATE]: "Intermedio",
    [CourseDifficulty.ADVANCED]: "Avanzado",
  };

  const typeMap = {
    [CourseType.COURSE]: "Curso",
    [CourseType.CAREER]: "Carrera",
  };

  // Función para obtener colores de dificultad
  const getDifficultyColors = (difficulty: CourseDifficulty) => {
    const difficultyText = difficultyMap[difficulty] || difficulty;
    switch (difficultyText?.toLowerCase()) {
      case "principiante":
      case "beginner":
      case "básico":
        return "bg-green-400/10 border border-green-400/30 text-green-400";
      case "intermedio":
      case "intermediate":
        return "bg-blue-400/10 border border-blue-400/30 text-blue-400";
      case "avanzado":
      case "advanced":
        return "bg-amber-400/10 border border-amber-400/30 text-amber-400";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex cursor-pointer items-center gap-2 text-slate-300 hover:text-font-light mb-6 transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>

        {/* Información del curso */}
        <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ícono del curso */}
            <div className="flex-shrink-0">
              <div
                className={`bg-gradient-to-br ${config.iconGradient} p-6 rounded-xl shadow-lg w-24 h-24 flex items-center justify-center`}
              >
                <Icon className="w-12 h-12 text-font-light" />
              </div>
            </div>

            {/* Detalles del curso */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-font-light mb-4">
                  {course.title}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Tags del curso */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg">
                  <HiClock className="w-4 h-4" />
                  <span className="text-sm font-medium">{course.duration}</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getDifficultyColors(
                    course.difficulty
                  )}`}
                >
                  <HiAcademicCap className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {difficultyMap[course.difficulty]}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 ${config.badgeColor} border px-4 py-2 rounded-lg`}
                >
                  <HiTag className="w-4 h-4" />
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    {course.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">
                    {typeMap[course.type]}
                  </span>
                </div>
              </div>

              {/* Precio e instructor */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-2xl font-bold text-green-400">
                  ${course.price}
                </div>
                <div className="text-slate-400">
                  <span className="text-sm">Instructor: </span>
                  <span className="text-font-light font-light">
                    {course.professor?.user?.name || "Instructor"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-font-light mb-4 sm:mb-6">
            Contenido del curso
          </h2>

          {/* Barra de progreso */}
          {!progressLoading && course.lessons && course.lessons.length > 0 && (
            <ProgressBar
              current={totalCompleted}
              total={course.lessons.length}
              className="mb-8"
            />
          )}

          {/* Error de progreso */}
          {progressError && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-font-light text-xs font-bold">!</span>
                </div>
                <div className="flex-1">
                  <p className="text-amber-400 font-medium">
                    Error de progreso
                  </p>
                  <p className="text-amber-300 text-sm">{progressError}</p>
                </div>
                <button
                  onClick={() => setProgressError(null)}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {course.lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isAvailable = isLessonAvailable(index);
                const isLocked = !isAvailable && !isCompleted;

                return (
                  <div
                    key={lesson.id}
                    className={`border rounded-lg overflow-hidden ${
                      isLocked
                        ? "border-slate-700/30 opacity-70"
                        : isCompleted
                        ? "border-green-500/50"
                        : "border-slate-600/50"
                    }`}
                  >
                    {/* Header de la lección */}
                    <button
                      onClick={() => isAvailable && toggleLesson(lesson.id)}
                      disabled={isLocked}
                      className={`w-full p-3 sm:p-4 transition-colors flex items-center justify-between text-left ${
                        isLocked
                          ? "bg-slate-800/10 cursor-not-allowed"
                          : "bg-slate-800/30 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold text-sm">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          {isCompleted && (
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {isLocked && (
                            <HiLockClosed className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <h3
                          className={`font-semibold ${
                            isLocked ? "text-slate-500" : "text-font-light"
                          }`}
                        >
                          {lesson.title}
                          {isLocked && " (Bloqueada)"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">
                          {lesson.urlVideos.length + lesson.urlPdfs.length}{" "}
                          recursos
                        </span>
                        {!isLocked &&
                          (expandedLessons.has(lesson.id) ? (
                            <HiChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <HiChevronDown className="w-5 h-5 text-slate-400" />
                          ))}
                      </div>
                    </button>

                    {/* Contenido de la lección (expandible) */}
                    {expandedLessons.has(lesson.id) && (
                      <div className="p-4 bg-slate-900/20 border-t border-slate-600/30">
                        {/* Si el usuario no tiene acceso al curso, mostrar mensaje de bloqueo */}
                        {!hasAccessToCourse ? (
                          <div className="text-center py-8">
                            <HiLockClosed className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                            <h4 className="text-slate-300 font-semibold mb-2">
                              Contenido Bloqueado
                            </h4>
                            <p className="text-slate-400 mb-4">
                              {!user
                                ? "Debes iniciar sesión y comprar este curso para acceder al contenido."
                                : "Este contenido está disponible solo para usuarios que han comprado el curso."}
                            </p>
                            <div className="inline-flex gap-3">
                              {!user ? (
                                <button
                                  onClick={() => router.push("/auth/login")}
                                  className="px-6 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-font-light"
                                >
                                  Iniciar Sesión
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (isInCart) {
                                      handleRemoveFromCart(course);
                                    } else {
                                      handleAddToCart(course);
                                    }
                                  }}
                                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                                    isInCart
                                      ? "bg-amber-500 hover:bg-amber-600 text-font-light"
                                      : "bg-button hover:bg-button/80 text-font-light"
                                  }`}
                                >
                                  {isInCart
                                    ? "Quitar del carrito"
                                    : "Agregar al carrito"}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Videos */}
                            {lesson.urlVideos.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                  <HiPlay className="w-4 h-4" />
                                  Videos ({lesson.urlVideos.length})
                                </h4>
                                <div className="space-y-2">
                                  {lesson.urlVideos.map(
                                    (videoUrl, videoIndex) => {
                                      const fileName =
                                        getCleanFileName(videoUrl);
                                      const fullFileName =
                                        getFileNameFromCloudinaryUrl(videoUrl);
                                      return (
                                        <a
                                          key={videoIndex}
                                          href={videoUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          title={fullFileName} // Tooltip con nombre completo
                                          className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                        >
                                          <HiPlay className="w-4 h-4 text-blue-400" />
                                          <span className="text-slate-300 group-hover:text-font-light transition-colors">
                                            {capitalizeFileName(fileName)}
                                          </span>
                                        </a>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}

                            {/* PDFs */}
                            {lesson.urlPdfs.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                  <HiDocumentText className="w-4 h-4" />
                                  Documentos ({lesson.urlPdfs.length})
                                </h4>
                                <div className="space-y-2">
                                  {lesson.urlPdfs.map((pdfUrl, pdfIndex) => {
                                    const fileName = getCleanFileName(pdfUrl);
                                    const fullFileName =
                                      getFileNameFromCloudinaryUrl(pdfUrl);
                                    return (
                                      <a
                                        key={pdfIndex}
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={fullFileName} // Tooltip con nombre completo
                                        className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                      >
                                        <HiDocumentText className="w-4 h-4 text-amber-400" />
                                        <span className="text-slate-300 group-hover:text-font-light transition-colors">
                                          {capitalizeFileName(fileName)}
                                        </span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Contenido Adicional */}
                            {lesson.aditionalData &&
                              lesson.aditionalData.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Contenido Adicional (
                                    {lesson.aditionalData.length})
                                  </h4>
                                  <div className="space-y-2">
                                    {lesson.aditionalData.map(
                                      (urlData: string, urlIndex: number) => {
                                        // Validar que la URL es válida
                                        const isValidUrl = (url: string) => {
                                          try {
                                            new URL(url);
                                            return true;
                                          } catch {
                                            return false;
                                          }
                                        };

                                        if (!isValidUrl(urlData)) {
                                          return (
                                            <div
                                              key={urlIndex}
                                              className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                                            >
                                              <svg
                                                className="w-4 h-4 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                              <span className="text-yellow-300 text-sm">
                                                URL inválida: {urlData}
                                              </span>
                                            </div>
                                          );
                                        }

                                        // Obtener el dominio para mostrar una descripción amigable
                                        const getDomainDisplay = (
                                          url: string
                                        ) => {
                                          try {
                                            const urlObj = new URL(url);
                                            const hostname =
                                              urlObj.hostname.toLowerCase();

                                            // Casos especiales para dominios conocidos
                                            if (hostname.includes("github.com"))
                                              return "GitHub";
                                            if (
                                              hostname.includes(
                                                "youtube.com"
                                              ) ||
                                              hostname.includes("youtu.be")
                                            )
                                              return "YouTube";
                                            if (
                                              hostname.includes(
                                                "docs.google.com"
                                              )
                                            )
                                              return "Google Docs";
                                            if (
                                              hostname.includes(
                                                "drive.google.com"
                                              )
                                            )
                                              return "Google Drive";
                                            if (
                                              hostname.includes("dropbox.com")
                                            )
                                              return "Dropbox";
                                            if (
                                              hostname.includes("notion.so") ||
                                              hostname.includes("notion.site")
                                            )
                                              return "Notion";
                                            if (hostname.includes("figma.com"))
                                              return "Figma";
                                            if (hostname.includes("codepen.io"))
                                              return "CodePen";
                                            if (
                                              hostname.includes(
                                                "stackoverflow.com"
                                              )
                                            )
                                              return "Stack Overflow";
                                            if (hostname.includes("medium.com"))
                                              return "Medium";

                                            // Para otros dominios, mostrar el hostname sin www
                                            return hostname.replace("www.", "");
                                          } catch {
                                            return "Enlace externo";
                                          }
                                        };

                                        const displayName =
                                          getDomainDisplay(urlData);

                                        return (
                                          <a
                                            key={urlIndex}
                                            href={urlData}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                          >
                                            <svg
                                              className="w-4 h-4 text-purple-400"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                                                clipRule="evenodd"
                                              />
                                            </svg>
                                            <div className="flex-1">
                                              <span className="text-slate-300 group-hover:text-font-light transition-colors block">
                                                {displayName}
                                              </span>
                                              <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate block">
                                                {urlData}
                                              </span>
                                            </div>
                                            <svg
                                              className="w-4 h-4 text-slate-400 group-hover:text-slate-300"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                              />
                                            </svg>
                                          </a>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Si no hay recursos */}
                            {lesson.urlVideos.length === 0 &&
                              lesson.urlPdfs.length === 0 &&
                              (!lesson.aditionalData ||
                                lesson.aditionalData.length === 0) && (
                                <p className="text-slate-500 text-sm">
                                  No hay recursos disponibles para esta lección.
                                </p>
                              )}
                          </>
                        )}

                        {/* Checkbox de finalización - solo si tiene acceso Y NO es el profesor */}
                        {hasAccessToCourse &&
                          !(
                            user?.professorProfile &&
                            typeof user.professorProfile === "object" &&
                            course?.professor?.id === user.professorProfile.id
                          ) && (
                            <div className="mt-6 pt-4 border-t border-slate-600/30">
                              <button
                                onClick={() =>
                                  handleLessonCompletion(lesson.id)
                                }
                                disabled={
                                  isCompleted ||
                                  completingLessons.has(lesson.id)
                                }
                                className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                                  isCompleted
                                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                    : completingLessons.has(lesson.id)
                                    ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 cursor-not-allowed"
                                    : "bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                    isCompleted
                                      ? "border-green-500 bg-green-500"
                                      : completingLessons.has(lesson.id)
                                      ? "border-blue-500 bg-blue-500/20"
                                      : "border-slate-400"
                                  }`}
                                >
                                  {isCompleted && (
                                    <HiCheckCircle className="w-3 h-3 text-font-light" />
                                  )}
                                  {completingLessons.has(lesson.id) && (
                                    <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                  )}
                                </div>
                                <span className="font-medium">
                                  {isCompleted
                                    ? "✓ Lección completada"
                                    : completingLessons.has(lesson.id)
                                    ? "Marcando como completada..."
                                    : "Marcar lección como completada"}
                                </span>
                              </button>
                              {isCompleted &&
                                index < course.lessons.length - 1 && (
                                  <p className="text-green-400/70 text-sm mt-2 ml-8">
                                    🎉 ¡Excelente! Ahora puedes acceder a la
                                    siguiente lección.
                                  </p>
                                )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">
                Este curso aún no tiene lecciones disponibles.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sección de feedback del curso */}
      {course &&
        course.lessons &&
        isCourseCompleted(course.lessons.length) &&
        !hasProvidedFeedback &&
        !showingFeedback && (
          <div className="mt-8 p-6 bg-gradient-to-br from-slate-800/30 to-slate-700/30 border border-slate-600/30 rounded-2xl">
            <div className="text-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-400/20">
                <img
                  src="/icons/logo.png"
                  alt="Logo"
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-2">
                Felicitaciones!
              </h3>
              <p className="text-slate-300">
                Has completado todas las lecciones del curso "{course?.title}"
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowingFeedback(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-font-light px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Comparte tu experiencia
              </button>
            </div>
          </div>
        )}

      {/* Componente de feedback inline */}
      {showingFeedback && !hasProvidedFeedback && (
        <div className="mt-8">
          <CourseCompletionFeedback
            courseId={courseId as string}
            courseTitle={course?.title || ""}
            onFeedbackSubmitted={handleFeedbackSubmitted}
            onCancel={() => setShowingFeedback(false)}
          />
        </div>
      )}

      {/* Mensaje de agradecimiento por feedback enviado */}
      {course &&
        course.lessons &&
        isCourseCompleted(course.lessons.length) &&
        hasProvidedFeedback && (
          <div className="mt-8 p-6 bg-gradient-to-br from-green-800/20 to-emerald-700/20 border border-green-600/30 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-400/20">
                <img
                  src="/icons/logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-green-200 mb-2">
                ¡Gracias por enviar tu feedback!
              </h3>
              <p className="text-green-300/80">
                Tu opinión es muy valiosa para nosotros y nos ayuda a mejorar
                nuestros cursos.
              </p>
            </div>
          </div>
        )}

      {/* Reseñas del curso */}
      <CourseReviews courseId={courseId as string} />
    </div>
  );
};

export default CourseDetailPage;

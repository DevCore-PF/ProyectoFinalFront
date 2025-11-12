"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import {
  HiArrowLeft,
  HiBookOpen,
  HiCheckCircle,
  HiBan,
  HiStar,
  HiClock,
  HiCalendar,
  HiCurrencyDollar,
  HiAcademicCap,
  HiChevronDown,
  HiChevronUp,
  HiPlay,
  HiDocumentText,
} from "react-icons/hi";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import Loader from "../Loaders/Loader";
import { changeVisivilityService } from "@/services/admin.services";
import { useAuth } from "@/context/UserContext";
import { Visibility } from "@/types/course.types";
import TinyLoader from "../Loaders/TinyLoader";

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
}

const CourseDetails = ({ courseId, onBack }: CourseDetailsProps) => {
  const {
    courses,
    activateDeactivateCourse,
    changeVisibility,
    fetchFeedback,
    feedbacks,
    isLoadingFeedbacks,
    feedbacksError,
  } = useAdmin();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [courseId, courses]);

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      const fileName = fileNameWithExtension.split("?")[0];
      return decodeURIComponent(fileName);
    } catch (error) {
      return "Archivo";
    }
  };

  const getCleanFileName = (url: string): string => {
    const fullName = getFileNameFromUrl(url);
    const nameWithoutExtension = fullName.replace(/\.[^/.]+$/, "");

    if (nameWithoutExtension.length > 50) {
      return (
        nameWithoutExtension.substring(0, 25) +
        "..." +
        nameWithoutExtension.substring(nameWithoutExtension.length - 20)
      );
    }

    return nameWithoutExtension;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <HiStar
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-300 fill-yellow-300"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };
  const getAverageRating = () => {
    if (!course?.feedback || course.feedback.length === 0) return 0;
    const sum = course.feedback.reduce(
      (acc: number, f: any) => acc + f.rating,
      0
    );
    return (sum / course.feedback.length).toFixed(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleActive = async () => {
    setLoadingAction(true);
    try {
      await activateDeactivateCourse(courseId);
      toastSuccess(course.isActive ? "Curso desactivado" : "Curso activado");
    } catch (error) {
      console.log(error);
      toastError("Error al cambiar estado del curso");
    } finally {
      setLoadingAction(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    const config = {
      Backend: "bg-blue-400/10 text-blue-300 border-blue-500/20",
      Frontend: "bg-purple-400/10 text-purple-300 border-purple-500/20",
      FullStack: "bg-green-400/10 text-green-300 border-green-500/20",
      DevOps: "bg-orange-400/10 text-orange-300 border-orange-500/20",
    };
    return config[category as keyof typeof config] || config.Backend;
  };

  const handleChangeVisibility = async (courseId: string) => {
    try {
      // Guardar el estado actual ANTES del cambio
      const currentCourse = courses.find((c) => c.id === courseId);
      const wasPublic = currentCourse?.visibility === Visibility.PUBLICO;

      await changeVisibility(courseId);

      toastSuccess(
        wasPublic ? "Curso cambiado a privado" : "Curso cambiado a público"
      );
    } catch (error) {
      console.error(error);
    }
  };

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length
        ).toFixed(1)
      : "0.0";
  useEffect(() => {
    fetchFeedback(courseId);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HiBookOpen className="w-24 h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-font-light mb-2">
            Curso no encontrado
          </h2>
          <p className="text-slate-400 mb-6">
            No se pudo cargar la información del curso
          </p>
          <button
            onClick={onBack}
            className="bg-button/80 cursor-pointer hover:bg-button text-font-light px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header con navegación */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-font-light transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver a cursos
          </button>

          {/* Banner si está inactivo */}
          {!course.isActive && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <HiBan className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <p className="text-amber-200 font-semibold text-lg">
                    Curso Inactivo
                  </p>
                  <p className="text-amber-300/80 text-sm">
                    Este curso no está visible para los estudiantes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header principal */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-button/40 border border-accent-light/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HiBookOpen className="w-10 h-10 text-font-light" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-font-light mb-1">
                    {course.title}
                  </h1>
                  <p className="text-slate-400 mb-3">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryBadge(
                        course.category
                      )}`}
                    >
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-400/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                      {course.difficulty}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        course.isActive
                          ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {course.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleToggleActive}
                disabled={loadingAction}
                className={`flex items-center cursor-pointer gap-2 bg-slate-700/50 hover:bg-slate-700/90 border px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex-shrink-0 ${
                  course.isActive
                    ? "border-amber-300/50 text-amber-300"
                    : "border-emerald-400/50 text-emerald-200"
                }`}
              >
                {loadingAction ? (
                  <>
                    <TinyLoader />
                    Procesando...
                  </>
                ) : course.isActive ? (
                  <>
                    <HiBan className="w-5 h-5" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-5 h-5" />
                    Activar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info general */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información básica */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiBookOpen className="w-6 h-6" />
                Información del Curso
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">ID del Curso</p>
                  <p className="text-font-light font-mono text-sm bg-slate-800/50 px-3 py-2 rounded">
                    {course.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Tipo</p>
                  <p className="text-font-light">{course.type}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Duración</p>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-slate-400" />
                    <p className="text-font-light">{course.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Precio</p>
                  <div className="flex items-center gap-2">
                    <p className="text-emerald-300 text-xl ">
                      $ {course.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Profesor</p>
                  <div className="flex items-center gap-2">
                    <HiAcademicCap className="w-4 h-4 text-slate-400" />
                    <p className="text-font-light">
                      {course.professor?.user?.name || "Sin asignar"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Estado de revisión
                  </p>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                    {course.status}
                  </span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Visibilidad</p>
                  {/*  */}
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                      course.visibility === "PRIVADO"
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {course.visibility}
                  </span>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiCalendar className="w-6 h-6" />
                Fechas
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Creación</p>
                  <p className="text-font-light text-sm">
                    {formatDate(course.createdAt)}
                  </p>
                </div>

                {course.updatedAt && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      Última actualización
                    </p>
                    <p className="text-font-light text-sm">
                      {formatDate(course.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4">
                Estadísticas
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Lecciones</span>
                  <span className="text-font-light font-bold">
                    {course.lessons?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Rating</span>
                  <span className="text-yellow-400 font-bold">
                    {getAverageRating() || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Reviews</span>
                  <span className="text-font-light font-bold">
                    {course.feedback?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Lecciones y Feedback */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lecciones con acordeón */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center mb-4 justify-between">
                <h2 className="text-xl font-bold text-font-light flex items-center gap-2">
                  <HiBookOpen className="w-6 h-6" />
                  Contenido del Curso
                  <span className="text-sm font-normal text-slate-400">
                    ({course.lessons?.length || 0} lecciones)
                  </span>
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-300">
                    {course.visibility === "PRIVADO" ? "Privado" : "Público"}
                  </span>
                  <button
                    onClick={() => handleChangeVisibility(course.id)}
                    className={`relative inline-flex h-7 w-14 border cursor-pointer items-center rounded-full transition-colors duration-300 ${
                      course.visibility === Visibility.PRIVADO
                        ? "bg-amber-500/80 border-amber-300"
                        : "bg-emerald-400/80 border-emerald-300"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-font-light shadow-md transition-transform duration-300 ${
                        course.visibility === Visibility.PUBLICO
                          ? "translate-x-[30px]"
                          : "translate-x-[2px]"
                      }`}
                    >
                      {course.visibility === Visibility.PRIVADO ? (
                        <HiLockClosed className="w-4 h-4 text-amber-800" />
                      ) : (
                        <HiLockOpen className="w-4 h-4 text-emerald-800" />
                      )}
                    </span>
                  </button>
                </div>
              </div>

              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className="border border-slate-600/50 rounded-lg overflow-hidden transition-all"
                    >
                      {/* Header de la lección */}
                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className="w-full p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <span className="text-slate-400 font-bold text-sm flex-shrink-0">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-semibold text-font-light truncate">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-slate-400 text-sm">
                            {lesson.urlVideos.length + lesson.urlPdfs.length}{" "}
                            recursos
                          </span>
                          {expandedLessons.has(lesson.id) ? (
                            <HiChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <HiChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Contenido expandible */}
                      {expandedLessons.has(lesson.id) && (
                        <div className="p-4 bg-slate-900/20 border-t border-slate-600/30">
                          {/* Videos */}
                          {lesson.urlVideos.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                <HiPlay className="w-4 h-4" />
                                Videos ({lesson.urlVideos.length})
                              </h4>
                              <div className="space-y-2">
                                {/* {lesson.urlVideos.map(
                                  (videoUrl: string, videoIndex: number) => {
                                    const fileName = getCleanFileName(videoUrl);
                                    return (
                                      
                                        key={videoIndex}
                                        href={videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                      >
                                        <HiPlay className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                        <span className="text-slate-300 group-hover:text-font-light transition-colors truncate">
                                          {fileName}
                                        </span>
                                      </a>
                                    );
                                  }
                                )} */}
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
                                {/* {lesson.urlPdfs.map(
                                  (pdfUrl: string, pdfIndex: number) => {
                                    const fileName = getCleanFileName(pdfUrl);
                                    return (
                                      
                                        key={pdfIndex}
                                        href={pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                      >
                                        <HiDocumentText className="w-4 h-4 text-red-400 flex-shrink-0" />
                                        <span className="text-slate-300 group-hover:text-font-light transition-colors truncate">
                                          {fileName}
                                        </span>
                                      </a>
                                    );
                                  }
                                )} */}
                              </div>
                            </div>
                          )}

                          {/* Sin recursos */}
                          {lesson.urlVideos.length === 0 &&
                            lesson.urlPdfs.length === 0 && (
                              <p className="text-slate-500 text-sm">
                                No hay recursos disponibles para esta lección.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiBookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    Este curso no tiene lecciones todavía
                  </p>
                </div>
              )}
            </div>

            {/* Feedback */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiStar className="w-6 h-6" />
                Reviews y Feedback
                <span className="text-sm font-normal text-slate-400">
                  ({course.feedback?.length || 0})
                </span>
              </h2>
              {/* export interface CourseReview {
  id: string;
  rating: number; /////del 1 al 5 porque son estrellitas
  feedback: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
} */}
              {/* {feedbacks.length > 0 ? (
                feedbacks.map((f) => {
                  return <p>{f.user.name} </p>;
                })
              ) : (
                <div className="text-center py-12">
                  <HiStar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    Este curso no tiene reviews todavía
                  </p>
                </div>
              )} */}
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-font-light flex items-center gap-2">
                    <HiStar className="w-6 h-6 text-yellow-400" />
                    Reviews y Feedback
                    <span className="text-sm font-normal text-slate-400">
                      (2)
                    </span>
                  </h2>

                  {/* Promedio de ratings */}
                  <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg">
                    <HiStar className="w-5 h-5 fill-yellow-300" />
                    <span className="text-xl font-bold text-yellow-300">
                      4.5
                      {/* aca va el promedio */}
                    </span>
                    <span className="text-slate-400 text-sm">/ 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Review 1 */}
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-button/80 flex items-center justify-center flex-shrink-0">
                        <span className="text-font-light font-bold text-lg">
                          MP
                        </span>
                      </div>

                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-font-light">
                              María Pérez
                            </h4>
                            <p className="text-slate-400 text-xs">
                              {new Date(
                                "2024-10-15T14:30:00"
                              ).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {renderStars(5)}
                        </div>

                        {/* Feedback */}
                        <p className="text-slate-300 text-sm leading-relaxed">
                          Excelente curso, muy bien explicado y con ejemplos
                          prácticos. El profesor tiene mucha experiencia y se
                          nota. Los materiales están muy completos y las
                          lecciones son fáciles de seguir. Totalmente
                          recomendado para quien quiera aprender sobre este
                          tema.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-button/80 flex items-center justify-center flex-shrink-0">
                        <span className="text-font-light font-bold text-lg">
                          CG
                        </span>
                      </div>

                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-font-light">
                              Carlos González
                            </h4>
                            <p className="text-slate-400 text-xs">
                              {new Date(
                                "2024-11-02T09:15:00"
                              ).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {renderStars(4)}
                        </div>

                        {/* Feedback */}
                        <p className="text-slate-300 text-sm leading-relaxed">
                          Muy buen contenido y estructura del curso. Me hubiera
                          gustado que algunos temas tuvieran más ejemplos
                          avanzados, pero en general cumple muy bien con lo
                          prometido. La calidad de los videos es excelente y el
                          material de apoyo es útil.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

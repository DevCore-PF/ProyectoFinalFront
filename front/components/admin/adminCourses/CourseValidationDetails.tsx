"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toastSuccess, toastError, toastConfirm } from "@/helpers/alerts.helper";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiUser,
  HiMail,
  HiBookOpen,
  HiAcademicCap,
  HiClock,
  HiExclamation,
  HiCurrencyDollar,
  HiEye,
  HiChartBar,
  HiCalendar,
  HiShieldCheck,
  HiChevronDown,
  HiChevronRight,
  HiPlay,
  HiDocumentText,
  HiLockClosed,
  HiLockOpen,
} from "react-icons/hi";

import Loader from "../../Loaders/Loader";
import TinyLoader from "../../Loaders/TinyLoader";
import { Course, CourseStatus, CourseVisibility } from "@/types/course.types";
import RejectedReasonModal from "../RejectedReasonModal";
import { useAuth } from "@/context/UserContext";

interface CourseValidationDetailsProps {
  courseId: string;
  onBack: () => void;
}

const CourseValidationDetails = ({ courseId, onBack }: CourseValidationDetailsProps) => {
  const { courses, refreshCourses } = useAdmin();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const { changeVisibility, approveCourse, rejectCourse } = useAdmin();

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
      } else {
        newSet.add(lessonId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === courseId);


    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [courseId, courses]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      "EN REVISION": "bg-blue-500/10 text-blue-300 border-blue-500/20",
      PUBLICADO: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      RECHAZADO: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };
    return config[status as keyof typeof config] || config["EN REVISION"];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      "EN REVISION": "En Revisión",
      PUBLICADO: "Publicado",
      RECHAZADO: "Rechazado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getDifficultyBadge = (difficulty: string) => {
    const config = {
      PRINCIPIANTE: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
      INTERMEDIO: "bg-amber-500/10 text-amber-200 border-amber-500/20",
      AVANZADO: "bg-amber-500/10 text-amber-200 border-amber-500/20",
    };
    return config[difficulty as keyof typeof config] || config.PRINCIPIANTE;
  };

  const handleApprove = async (courseId: string) => {
    toastConfirm(
      "¿Aprobar y publicar este curso?",
      async () => {
        setLoadingApprove(true);
        try {
          await approveCourse(courseId);
          toastSuccess("Curso aprobado y publicado correctamente");
        } catch (error) {
          console.error(error);
          toastError("Error al aprobar el curso");
        } finally {
          setLoadingApprove(false);
        }
      },
      () => {}
    );
  };

  const confirmRejected = () => {
    if (!rejectedReason.trim()) {
      toastError("Debes proporcionar un motivo de rechazo");
      return;
    }
    if (rejectedReason.trim().length < 10) {
      toastError("El motivo debe tener al menos 10 caracteres");
      return;
    }
    setIsModalOpen(false);

    toastConfirm(
      "¿Rechazar este curso?",
      async () => {
        setLoadingReject(true);
        try {
          await rejectCourse(courseId, rejectedReason);
          await refreshCourses();
          toastSuccess("Curso rechazado");
        } catch (error) {
          console.error(error);
          toastError("Error al rechazar el curso");
        } finally {
          setLoadingReject(false);
        }
      },
      () => {}
    );
  };

  const handleReject = () => {
    if (course?.status === CourseStatus.DRAFT) {
      setIsModalOpen(true);
    }
  };

  const handleChangeVisibility = async (courseId: string) => {
    let message = "";
    courses.find((c: Course) => {
      const courseFound = c.id === courseId;
      if (courseFound && c.visibility === "PUBLICO") {
        message = "Cambiar a privado";
      } else if (courseFound && c.visibility === "PRIVADO") {
        message = "Cambiar a público";
      }
    });

    toastConfirm(
      message,
      async () => {
        setLoadingVisibility(true);
        try {
          const currentCourse = courses.find((c) => c.id === courseId);
          const wasPublic = currentCourse?.visibility === CourseVisibility.PUBLIC;

          await changeVisibility(courseId);

          toastSuccess(wasPublic ? "Curso privado" : "Curso público");
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingVisibility(false);
        }
      },
      () => {}
    );
  };

  // ============[ LOADING ]============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // ============[ NOT FOUND ]============
  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <HiBookOpen className="w-16 h-16 sm:w-24 sm:h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-font-light mb-2">Curso no encontrado</h2>
          <p className="text-slate-400 mb-6 text-sm sm:text-base">
            No se pudo cargar la información del curso
          </p>
          <button
            onClick={onBack}
            className="bg-button/80 cursor-pointer hover:bg-button text-font-light px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============[ BACK BUTTON ]============ */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-font-light transition-colors text-sm sm:text-base"
          >
            <HiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Volver a validaciones
          </button>

          {/* ============[ STATUS BANNERS ]============ */}
          {course.status === CourseStatus.DRAFT && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg shrink-0">
                  <HiExclamation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-blue-200 font-semibold text-base sm:text-lg">
                    Curso Pendiente de Revisión
                  </p>
                  <p className="text-blue-200/80 text-xs sm:text-sm">
                    Este curso está esperando aprobación. Revisa el contenido y decide si publicar o rechazar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {course.status === CourseStatus.REJECT && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg shrink-0">
                  <HiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-amber-200 font-semibold text-base sm:text-lg">Curso Rechazado</p>
                  <p className="text-amber-200/80 text-xs sm:text-sm">
                    Este curso fue rechazado previamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {course.status === CourseStatus.PUBLISHED && (
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg shrink-0">
                  <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-emerald-200 font-semibold text-base sm:text-lg">Curso Publicado</p>
                  <p className="text-emerald-100 text-xs sm:text-sm">
                    Este curso está activo y disponible para los estudiantes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============[ MAIN HEADER ]============ */}
          <div className="mt-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyBadge(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                      {course.category}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                        course.status
                      )}`}
                    >
                      {getStatusLabel(course.status)}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-font-light mb-2 break-words">
                    {course.title}
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <HiCurrencyDollar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="font-semibold">${parseFloat(course.price).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <span>{course.lessons?.length || 0} lecciones</span>
                    </div>
                    {course.isActive ? (
                      <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded text-xs font-medium">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-500/10 border border-slate-500/20 text-slate-300 rounded text-xs font-medium">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>

                {/* ============[ ACTION BUTTONS ]============ */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
                  {course.status === CourseStatus.DRAFT && (
                    <>
                      <button
                        onClick={handleReject}
                        disabled={loadingReject || loadingApprove}
                        className="flex items-center justify-center cursor-pointer gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
                      >
                        {loadingReject ? (
                          <>
                            <TinyLoader />
                            <span className="hidden sm:inline">Rechazando...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <HiXCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            Rechazar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleApprove(course.id)}
                        disabled={loadingApprove || loadingReject}
                        className="flex items-center justify-center cursor-pointer gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm"
                      >
                        {loadingApprove ? (
                          <>
                            <TinyLoader />
                            <span className="hidden sm:inline">Aprobando...</span>
                            <span className="sm:hidden">...</span>
                          </>
                        ) : (
                          <>
                            <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Aprobar y Publicar</span>
                            <span className="sm:hidden">Aprobar</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                  <button
                    disabled={
                      loadingVisibility ||
                      course.status === CourseStatus.DRAFT ||
                      course.status === CourseStatus.REJECT
                    }
                    title={
                      course.visibility === CourseVisibility.PRIVATE
                        ? "Cambiar a público"
                        : "Cambiar a privado"
                    }
                    onClick={() => handleChangeVisibility(course.id)}
                    className={`relative inline-flex h-7 w-14 cursor-pointer disabled:cursor-not-allowed items-center rounded-full transition-colors duration-300 shrink-0 ${
                      course.visibility === CourseVisibility.PRIVATE ? "bg-amber-500/80" : "bg-emerald-400/80"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-font-light shadow-md transition-transform duration-300 ${
                        course.visibility === CourseVisibility.PUBLIC
                          ? "translate-x-[30px]"
                          : "translate-x-[2px]"
                      }`}
                    >
                      {course.visibility === CourseVisibility.PRIVATE && !loadingVisibility ? (
                        <HiLockClosed className="w-4 h-4 text-amber-800" />
                      ) : course.visibility === CourseVisibility.PRIVATE && loadingVisibility ? (
                        <TinyLoader />
                      ) : course.visibility === CourseVisibility.PUBLIC && !loadingVisibility ? (
                        <HiLockOpen className="w-4 h-4 text-emerald-800" />
                      ) : (
                        <TinyLoader />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============[ CONTENT GRID ]============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ============[ LEFT COLUMN ]============ */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Información del profesor */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiAcademicCap className="w-5 h-5 sm:w-6 sm:h-6" />
                Profesor
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center shrink-0">
                    {course.professor?.user?.image ? (
                      <img
                        src={course.professor.user.image}
                        alt={course.professor.user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <HiUser className="w-5 h-5 sm:w-6 sm:h-6 text-font-light" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-font-light truncate text-sm sm:text-base">
                      {course.professor?.user?.name || "Sin profesor"}
                    </p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">
                      {course.professor?.profession || "Sin profesión"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 flex items-center gap-2">
                    <HiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Email
                  </p>
                  <p className="text-font-light text-xs sm:text-sm break-all">
                    {course.professor?.user?.email || "Sin email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas del curso */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiChartBar className="w-5 h-5 sm:w-6 sm:h-6" />
                Estadísticas
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-xs sm:text-sm">Tipo</span>
                  <span className="text-font-light font-medium text-xs sm:text-sm">{course.type}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-xs sm:text-sm">Visibilidad</span>
                  <span className="text-font-light font-medium text-xs sm:text-sm">{course.visibility}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-xs sm:text-sm">Feedbacks</span>
                  <span className="text-font-light font-medium text-xs sm:text-sm">
                    {course.feedbacks?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />
                Fechas
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Creación</p>
                  <p className="text-font-light text-xs sm:text-sm">{formatDate(course.createdAt)}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Última actualización</p>
                  <p className="text-font-light text-xs sm:text-sm">{formatDate(course.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============[ RIGHT COLUMN ]============ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Descripción completa */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                Descripción del Curso
              </h2>
              <p className="text-font-light leading-relaxed bg-slate-800/30 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                {course.description}
              </p>
            </div>

            {/* ============[ LESSONS ]============ */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                Contenido del Curso ({course.lessons?.length || 0} lecciones)
              </h2>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id || index}
                      className="bg-slate-800/30 rounded-lg overflow-hidden border border-slate-700/30"
                    >
                      <div
                        onClick={() => toggleLesson(lesson.id)}
                        className="p-3 sm:p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-button/20 border border-button/50 flex items-center justify-center shrink-0">
                            <span className="text-accent-light font-semibold text-xs sm:text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-font-light mb-1 text-sm sm:text-base break-words">
                                  {lesson.title || `Lección ${index + 1}`}
                                </h3>
                                {lesson.description && (
                                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-2">
                                    {lesson.description}
                                  </p>
                                )}
                                {lesson.duration && (
                                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-xs">
                                    <HiClock className="w-3 h-3" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                )}
                              </div>
                              <button className="p-1 hover:bg-slate-700/50 rounded transition-colors shrink-0">
                                {expandedLessons.has(lesson.id) ? (
                                  <HiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                ) : (
                                  <HiChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenido expandido */}
                      {expandedLessons.has(lesson.id) && (
                        <div className="p-3 sm:p-4 bg-slate-900/20 border-t border-slate-600/30">
                          {/* Videos */}
                          {lesson.urlVideos && lesson.urlVideos.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="text-slate-300 font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <HiPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Videos ({lesson.urlVideos.length})
                              </h4>
                              <div className="space-y-2">
                                {lesson.urlVideos.map((video: string, videoIndex: number) => (
                                  <a
                                    key={videoIndex}
                                    href={video}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
                                  >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center shrink-0">
                                      <HiPlay className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-font-light text-xs sm:text-sm font-medium group-hover:text-accent-light transition-colors">
                                        Video {videoIndex + 1}
                                      </p>
                                      <p className="text-slate-400 text-xs truncate">{video}</p>
                                    </div>
                                    <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-accent-light transition-colors shrink-0" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* PDFs */}
                          {lesson.urlPdfs && lesson.urlPdfs.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="text-slate-300 font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <HiDocumentText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Documentos ({lesson.urlPdfs.length})
                              </h4>
                              <div className="space-y-2">
                                {lesson.urlPdfs.map((pdf: string, pdfIndex: number) => (
                                  <a
                                    key={pdfIndex}
                                    href={pdf}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
                                  >
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center shrink-0">
                                      <HiDocumentText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-font-light text-xs sm:text-sm font-medium group-hover:text-accent-light transition-colors">
                                        Documento {pdfIndex + 1}
                                      </p>
                                      <p className="text-slate-400 text-xs truncate">{pdf}</p>
                                    </div>
                                    <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-accent-light transition-colors shrink-0" />
                                  </a>
                                ))}
                                {/* ===== additionalData dentro del header de la lección ===== */}
                                {lesson.aditionalData && (
                                  <div className="text-center">
                                    <h4>Contenido adcional</h4>
                                    <ul>
                                      {lesson.aditionalData.map((c: string) => {
                                        return (
                                          <li className="mt-2 text-xs sm:text-sm text-accent-light bg-button/10 border border-accent-light/40 rounded px-2 py-1 inline-block">
                                            {c}
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Sin recursos */}
                          {(!lesson.urlVideos || lesson.urlVideos.length === 0) &&
                            (!lesson.urlPdfs || lesson.urlPdfs.length === 0) && (
                              <p className="text-slate-500 text-xs sm:text-sm italic text-center py-4">
                                No hay recursos disponibles para esta lección.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-center py-8 text-sm">
                  Este curso aún no tiene lecciones agregadas
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                Información del Sistema
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">ID del Curso</p>
                  <p className="text-font-light font-mono text-xs break-all">{course.id}</p>
                </div>
                {course.professor?.id && (
                  <div className="p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">ID del Profesor</p>
                    <p className="text-font-light font-mono text-xs break-all">{course.professor.id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============[ REJECTION MODAL ]============ */}
      {isModalOpen && (
        <RejectedReasonModal
          rejectedReason={rejectedReason}
          setRejectedReason={setRejectedReason}
          onCancel={() => {
            setIsModalOpen(false);
            setRejectedReason("");
          }}
          onConfirm={confirmRejected}
        />
      )}
    </div>
  );
};

export default CourseValidationDetails;

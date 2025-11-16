"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  toastSuccess,
  toastError,
  toastConfirm,
} from "@/helpers/alerts.helper";
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

import Loader from "../Loaders/Loader";
import TinyLoader from "../Loaders/TinyLoader";
import { Course, CourseStatus, CourseVisibility } from "@/types/course.types";
import RejectedReasonModal from "./RejectedReasonModal";
import { approveCourseService } from "@/services/admin.services";
import { useAuth } from "@/context/UserContext";

interface CourseValidationDetailsProps {
  courseId: string;
  onBack: () => void;
}

const CourseValidationDetails = ({
  courseId,
  onBack,
}: CourseValidationDetailsProps) => {
  const { courses, refreshCourses } = useAdmin();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const { changeVisibility } = useAdmin();

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
      RECHAZADO: "bg-red-500/10 text-red-300 border-red-500/20",
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
      PRINCIPIANTE: "bg-green-500/10 text-green-300 border-green-500/20",
      INTERMEDIO: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      AVANZADO: "bg-red-500/10 text-red-300 border-red-500/20",
    };
    return config[difficulty as keyof typeof config] || config.PRINCIPIANTE;
  };
  const { token } = useAuth();

  const handleApprove = async (courseId: string) => {
    toastConfirm(
      "¿Aprobar y publicar este curso?",
      async () => {
        setLoadingApprove(true);
        try {
          if (token) {
            await approveCourseService(token, courseId);
          }
          await changeVisibility(courseId);
          await refreshCourses();
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
          // TODO: Implementar servicio de rechazo de curso
          // await rejectCourse(courseId, rejectedReason);
          await refreshCourses();
          toastSuccess("Curso rechazado");
          onBack();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }
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
          const wasPublic =
            currentCourse?.visibility === CourseVisibility.PUBLIC;

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
            Volver a validaciones
          </button>

          {/* Banner según estado */}
          {course.status === CourseStatus.DRAFT && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <HiExclamation className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 font-semibold text-lg">
                    Curso Pendiente de Revisión
                  </p>
                  <p className="text-blue-200/80 text-sm">
                    Este curso está esperando aprobación. Revisa el contenido y
                    decide si publicar o rechazar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {course.status === CourseStatus.REJECT && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <HiXCircle className="w-6 h-6 text-red-300" />
                </div>
                <div>
                  <p className="text-red-200 font-semibold text-lg">
                    Curso Rechazado
                  </p>
                  <p className="text-red-200/80 text-sm">
                    Este curso fue rechazado previamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {course.status === CourseStatus.PUBLISHED && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <HiCheckCircle className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200 font-semibold text-lg">
                    Curso Publicado
                  </p>
                  <p className="text-emerald-100 text-sm">
                    Este curso está activo y disponible para los estudiantes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header principal del curso */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${getDifficultyBadge(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                      {course.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                        course.status
                      )}`}
                    >
                      {getStatusLabel(course.status)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-font-light mb-2">
                    {course.title}
                  </h1>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-300">
                      <HiClock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <HiCurrencyDollar className="w-4 h-4" />
                      <span className="font-semibold">
                        ${parseFloat(course.price).toFixed(2)}
                      </span>
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

                {/* Botones de acción solo si está en revisión */}
                {course.status === CourseStatus.DRAFT && (
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      onClick={handleReject}
                      disabled={loadingReject || loadingApprove}
                      className="flex items-center cursor-pointer gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                      {loadingReject ? (
                        <>
                          <TinyLoader />
                          Rechazando...
                        </>
                      ) : (
                        <>
                          <HiXCircle className="w-5 h-5" />
                          Rechazar
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleApprove(course.id)}
                      disabled={loadingApprove || loadingReject}
                      className="flex items-center cursor-pointer gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                      {loadingApprove ? (
                        <>
                          <TinyLoader />
                          Aprobando...
                        </>
                      ) : (
                        <>
                          <HiCheckCircle className="w-5 h-5" />
                          Aprobar y Publicar
                        </>
                      )}
                    </button>
                  </div>
                )}
                <button
                  disabled={
                    loadingVisibility ||
                    (course.status === CourseStatus.DRAFT ||
                      course.status === CourseStatus.REJECT)
                  }
                  title={
                    course.visibility === CourseVisibility.PRIVATE
                      ? "Cambiar a público"
                      : "Cambiar a privado"
                  }
                  onClick={() => handleChangeVisibility(course.id)}
                  className={`relative inline-flex h-7 w-14 cursor-pointer disabled:cursor-not-allowed items-center rounded-full transition-colors duration-300 ${
                    course.visibility === CourseVisibility.PRIVATE
                      ? "bg-amber-500/80 "
                      : "bg-emerald-400/80"
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center transform rounded-full bg-font-light shadow-md transition-transform duration-300 ${
                      course.visibility === CourseVisibility.PUBLIC
                        ? "translate-x-[30px]"
                        : "translate-x-[2px]"
                    }`}
                  >
                    {course.visibility === CourseVisibility.PRIVATE &&
                    !loadingVisibility ? (
                      <HiLockClosed className="w-4 h-4 text-amber-800" />
                    ) : course.visibility === CourseVisibility.PRIVATE &&
                      loadingVisibility ? (
                      <TinyLoader />
                    ) : course.visibility === CourseVisibility.PUBLIC &&
                      !loadingVisibility ? (
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

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info del profesor */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información del profesor */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiAcademicCap className="w-6 h-6" />
                Profesor
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center flex-shrink-0">
                    {course.professor?.user?.image ? (
                      <img
                        src={course.professor.user.image}
                        alt={course.professor.user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <HiUser className="w-6 h-6 text-font-light" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-font-light truncate">
                      {course.professor?.user?.name || "Sin profesor"}
                    </p>
                    <p className="text-slate-400 text-sm truncate">
                      {course.professor?.profession || "Sin profesión"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                    <HiMail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="text-font-light text-sm break-all">
                    {course.professor?.user?.email || "Sin email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas del curso */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiChartBar className="w-6 h-6" />
                Estadísticas
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-sm">Tipo</span>
                  <span className="text-font-light font-medium">
                    {course.type}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-sm">Visibilidad</span>
                  <span className="text-font-light font-medium">
                    {course.visibility}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-400 text-sm">Feedbacks</span>
                  <span className="text-font-light font-medium">
                    {course.feedbacks?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
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
                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Última actualización
                  </p>
                  <p className="text-font-light text-sm">
                    {formatDate(course.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Detalles del curso */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción completa */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiBookOpen className="w-6 h-6" />
                Descripción del Curso
              </h2>
              <p className="text-font-light leading-relaxed bg-slate-800/30 p-4 rounded-lg">
                {course.description}
              </p>
            </div>

            {/* Lecciones */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                Contenido del Curso ({course.lessons?.length || 0} lecciones)
              </h2>
              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id || index}
                      className="bg-slate-800/30 rounded-lg overflow-hidden border border-slate-700/30"
                    >
                      <div
                        onClick={() => toggleLesson(lesson.id)}
                        className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-button/20 border border-button/50 flex items-center justify-center flex-shrink-0">
                            <span className="text-accent-light font-semibold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="font-medium text-font-light mb-1">
                                  {lesson.title || `Lección ${index + 1}`}
                                </h3>
                                {lesson.description && (
                                  <p className="text-slate-400 text-sm line-clamp-2">
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
                              <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                                {expandedLessons.has(lesson.id) ? (
                                  <HiChevronDown className="w-5 h-5 text-slate-400" />
                                ) : (
                                  <HiChevronRight className="w-5 h-5 text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contenido expandido */}
                      {expandedLessons.has(lesson.id) && (
                        <div className="p-4 bg-slate-900/20 border-t border-slate-600/30">
                          {/* Videos */}
                          {lesson.urlVideos && lesson.urlVideos.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                <HiPlay className="w-4 h-4" />
                                Videos ({lesson.urlVideos.length})
                              </h4>
                              <div className="space-y-2">
                                {lesson.urlVideos.map(
                                  (video: string, videoIndex: number) => (
                                    <a
                                      key={videoIndex}
                                      href={video}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
                                    >
                                      <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HiPlay className="w-5 h-5 text-red-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-font-light text-sm font-medium group-hover:text-accent-light transition-colors">
                                          Video {videoIndex + 1}
                                        </p>
                                        <p className="text-slate-400 text-xs truncate">
                                          {video}
                                        </p>
                                      </div>
                                      <HiEye className="w-4 h-4 text-slate-400 group-hover:text-accent-light transition-colors" />
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* PDFs */}
                          {lesson.urlPdfs && lesson.urlPdfs.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                                <HiDocumentText className="w-4 h-4" />
                                Documentos ({lesson.urlPdfs.length})
                              </h4>
                              <div className="space-y-2">
                                {lesson.urlPdfs.map(
                                  (pdf: string, pdfIndex: number) => (
                                    <a
                                      key={pdfIndex}
                                      href={pdf}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg transition-colors group"
                                    >
                                      <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <HiDocumentText className="w-5 h-5 text-blue-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-font-light text-sm font-medium group-hover:text-accent-light transition-colors">
                                          Documento {pdfIndex + 1}
                                        </p>
                                        <p className="text-slate-400 text-xs truncate">
                                          {pdf}
                                        </p>
                                      </div>
                                      <HiEye className="w-4 h-4 text-slate-400 group-hover:text-accent-light transition-colors" />
                                    </a>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Sin recursos */}
                          {(!lesson.urlVideos ||
                            lesson.urlVideos.length === 0) &&
                            (!lesson.urlPdfs ||
                              lesson.urlPdfs.length === 0) && (
                              <p className="text-slate-500 text-sm italic text-center py-4">
                                No hay recursos disponibles para esta lección.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-center py-8">
                  Este curso aún no tiene lecciones agregadas
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-6 h-6" />
                Información del Sistema
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">ID del Curso</p>
                  <p className="text-font-light font-mono text-xs break-all">
                    {course.id}
                  </p>
                </div>
                {course.professor?.id && (
                  <div className="p-3 bg-slate-800/30 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">
                      ID del Profesor
                    </p>
                    <p className="text-font-light font-mono text-xs break-all">
                      {course.professor.id}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de rechazo */}
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

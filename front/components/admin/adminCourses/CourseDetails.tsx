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
  HiBookOpen,
  HiCheckCircle,
  HiBan,
  HiStar,
  HiClock,
  HiCalendar,
  HiAcademicCap,
  HiChevronDown,
  HiChevronUp,
  HiPlay,
  HiDocumentText,
} from "react-icons/hi";
import { HiExclamationTriangle } from "react-icons/hi2";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import Loader from "../../Loaders/Loader";

import { Course, CourseVisibility } from "@/types/course.types";
import TinyLoader from "../../Loaders/TinyLoader";
import Image from "next/image";
import { CourseReview } from "@/types/admin.types";
import BanReasonModal from "../adminUsers/BanReasonModal";

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
}

export interface UserFeedback {
  id: string;
  name: string;
  image?: string | null;
  isActive: boolean;
}

const CourseDetails = ({ courseId, onBack }: CourseDetailsProps) => {
  const {
    courses,
    activateDeactivateCourse,
    changeVisibility,
    fetchFeedback,
    deactivateUser,
  } = useAdmin();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [loadingAction, setLoadingAction] = useState(false);
  const [localFeedbacks, setLocalFeedbacks] = useState<CourseReview[]>([]);
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const [banUnbanUserLoading, setBanUnbanUserLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserFeedback | null>(null);
  const [banReason, setBanReason] = useState("");
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [courseId, courses]);

  useEffect(() => {
    const loadFeedbacks = async () => {
      const data = await fetchFeedback(courseId);
      if (data) {
        setLocalFeedbacks(data);
      }
    };

    loadFeedbacks();
  }, [courseId]);

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
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              star <= rating
                ? "text-yellow-300 fill-yellow-300"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
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
    let message = "";
    courses.find((c: Course) => {
      const courseFound = c.id === courseId;
      if (courseFound && c.isActive) {
        message = "Dar curso de baja";
      } else if (courseFound && !c.isActive) {
        message = "Dar curso de alta";
      }
    });
    toastConfirm(
      message,
      async () => {
        setLoadingAction(true);
        try {
          await activateDeactivateCourse(courseId);
          course?.visibility === CourseVisibility.PUBLIC &&
            (await changeVisibility(courseId));
          toastSuccess(
            course.isActive ? "Curso desactivado" : "Curso activado"
          );
        } catch (error) {
          console.log(error);
          toastError("Error al cambiar estado del curso");
        } finally {
          setLoadingAction(false);
        }
      },
      () => {}
    );
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

  const handleBanUnban = async () => {
    setShowBanModal(true);
  };

  const confirmBan = () => {
    if (!currentUser) return;
    if (!banReason.trim()) {
      toastError("Debes proporcionar un motivo para el baneo");
      return;
    }
    if (banReason.trim().length < 10) {
      toastError("El motivo debe tener al menos 10 caracteres");
      return;
    }

    setShowBanModal(false);

    toastConfirm(
      "Banear usuario",
      async () => {
        setBanUnbanUserLoading(true);
        try {
          await deactivateUser(currentUser.id, banReason);
          setLocalFeedbacks((prevFeedbacks) =>
            prevFeedbacks.map((feedback) =>
              feedback.user.id === currentUser.id
                ? {
                    ...feedback,
                    user: { ...feedback.user, isActive: false },
                  }
                : feedback
            )
          );
          toastSuccess("Usuario baneado");
          setBanReason("");
        } catch (error) {
          console.error(error);
          toastError("Error al banear usuario");
        } finally {
          setBanUnbanUserLoading(false);
          setCurrentUser(null);
        }
      },
      () => {
        setBanReason("");
        setCurrentUser(null);
      }
    );
  };

  const averageRating =
    localFeedbacks.length > 0
      ? (
          localFeedbacks.reduce((acc, f) => acc + f.rating, 0) /
          localFeedbacks.length
        ).toFixed(1)
      : "0.0";

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
          <h2 className="text-xl sm:text-2xl font-bold text-font-light mb-2">
            Curso no encontrado
          </h2>
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
            Volver a cursos
          </button>

          {/* ============[ INACTIVE BANNER ]============ */}
          {!course.isActive && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg shrink-0">
                  <HiBan className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-amber-200 font-semibold text-base sm:text-lg">
                    Curso Inactivo
                  </p>
                  <p className="text-amber-200/80 text-xs sm:text-sm">
                    Este curso está desactivado. Los usuarios ya no podrán verlo
                    ni acceder a su contenido.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============[ MAIN HEADER ]============ */}
          <div className="mt-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-button/40 border border-accent-light/40 rounded-xl flex items-center justify-center shrink-0">
                  <HiBookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-font-light" />
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h1 className="text-2xl sm:text-3xl font-bold text-font-light mb-1 break-words">
                    {course.title}
                  </h1>
                  <p className="text-slate-400 mb-2 sm:mb-3 text-sm sm:text-base line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryBadge(
                        course.category
                      )}`}
                    >
                      {course.category}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-blue-400/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                      {course.difficulty}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${
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
                title={course.isActive ? "Dar de baja" : "Dar de alta"}
                onClick={handleToggleActive}
                disabled={loadingAction}
                className={`flex items-center justify-center cursor-pointer gap-2 bg-slate-700/50 hover:bg-slate-700/90 border px-3 sm:px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 shrink-0 w-full lg:w-auto text-sm ${
                  course.isActive
                    ? "border-amber-300/50 text-amber-300"
                    : "border-emerald-400/50 text-emerald-200"
                }`}
              >
                {loadingAction ? (
                  <>
                    <TinyLoader />
                    <span className="hidden sm:inline">Procesando...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : course.isActive ? (
                  <>
                    <HiBan className="w-4 h-4 sm:w-5 sm:h-5" />
                    Dar de baja
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Dar de alta
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ============[ CONTENT GRID ]============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ============[ LEFT COLUMN ]============ */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Información básica */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                Información del Curso
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">ID del Curso</p>
                  <p className="text-font-light font-mono text-xs sm:text-sm bg-slate-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded break-all">
                    {course.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Tipo</p>
                  <p className="text-font-light text-sm sm:text-base">{course.type}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Duración</p>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <p className="text-font-light text-sm sm:text-base">{course.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Precio</p>
                  <div className="flex items-center gap-2">
                    <p className="text-emerald-300 text-lg sm:text-xl">
                      $ {course.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Profesor</p>
                  <div className="flex items-center gap-2">
                    <HiAcademicCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    <p className="text-font-light text-sm sm:text-base truncate">
                      {course.professor?.user?.name || "Sin asignar"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">
                    Estado de revisión
                  </p>
                  <span className="px-2 sm:px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                    {course.status}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Visibilidad</p>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${
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
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />
                Fechas
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Creación</p>
                  <p className="text-font-light text-xs sm:text-sm">
                    {formatDate(course.createdAt)}
                  </p>
                </div>

                {course.updatedAt && (
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">
                      Última actualización
                    </p>
                    <p className="text-font-light text-xs sm:text-sm">
                      {formatDate(course.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Estadísticas */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4">
                Estadísticas
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Lecciones</span>
                  <span className="text-font-light font-bold text-sm sm:text-base">
                    {course.lessons?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Rating</span>
                  <span className="text-yellow-200 font-bold text-sm sm:text-base">
                    {averageRating || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Reseñas</span>
                  <span className="text-font-light font-bold text-sm sm:text-base">
                    {localFeedbacks.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============[ RIGHT COLUMN ]============ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* ============[ LESSONS ]============ */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-font-light flex items-center gap-2">
                  <HiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                  Contenido del Curso
                  <span className="text-xs sm:text-sm font-normal text-slate-400">
                    ({course.lessons?.length || 0} lecciones)
                  </span>
                </h2>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs sm:text-sm font-medium text-slate-300">
                    {course.visibility === "PRIVADO"
                      ? "Solo profesor"
                      : "Visible para todos"}
                  </span>
                  <button
                    disabled={loadingVisibility}
                    title={
                      course.visibility === CourseVisibility.PRIVATE
                        ? "Cambiar a público"
                        : "Cambiar a privado"
                    }
                    onClick={() => handleChangeVisibility(course.id)}
                    className={`relative inline-flex h-7 w-14 cursor-pointer items-center rounded-full transition-colors duration-300 shrink-0 ${
                      course.visibility === CourseVisibility.PRIVATE
                        ? "bg-amber-500/80"
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

              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className="border border-slate-600/50 rounded-lg overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleLesson(lesson.id)}
                        className="w-full p-3 sm:p-4 bg-slate-800/30 hover:bg-slate-800/50 transition-colors flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <span className="text-slate-400 font-bold text-xs sm:text-sm shrink-0">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-semibold text-font-light truncate text-sm sm:text-base">
                            {lesson.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-slate-400 text-xs sm:text-sm">
                            {lesson.urlVideos.length + lesson.urlPdfs.length}{" "}
                            <span className="hidden sm:inline">recursos</span>
                          </span>
                          {expandedLessons.has(lesson.id) ? (
                            <HiChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          ) : (
                            <HiChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {expandedLessons.has(lesson.id) && (
                        <div className="p-3 sm:p-4 bg-slate-900/20 border-t border-slate-600/30">
                          {lesson.urlVideos.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="text-slate-300 font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <HiPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Videos ({lesson.urlVideos.length})
                              </h4>
                            </div>
                          )}

                          {lesson.urlPdfs.length > 0 && (
                            <div className="mb-3 sm:mb-4">
                              <h4 className="text-slate-300 font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <HiDocumentText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Documentos ({lesson.urlPdfs.length})
                              </h4>
                            </div>
                          )}

                          {lesson.urlVideos.length === 0 &&
                            lesson.urlPdfs.length === 0 && (
                              <p className="text-slate-500 text-xs sm:text-sm">
                                No hay recursos disponibles para esta lección.
                              </p>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <HiBookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm sm:text-base">
                    Este curso no tiene lecciones todavía
                  </p>
                </div>
              )}
            </div>

            {/* ============[ FEEDBACK ]============ */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-font-light flex items-center gap-2">
                  <HiStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-200" />
                  Comentarios y reseñas
                  <span className="text-xs sm:text-sm font-normal text-slate-400">
                    ({localFeedbacks?.length || 0})
                  </span>
                </h2>
                <p className="flex items-center gap-1 text-base sm:text-lg font-bold text-slate-200">
                  {averageRating}/5.0
                </p>
              </div>

              {localFeedbacks.length > 0 ? (
                <>
                  {localFeedbacks.map((f) => {
                    const isToxic = f.toxicityScore && f.toxicityScore > 0.5;

                    return (
                      <div
                        key={f.id}
                        className={`border rounded-xl p-4 sm:p-5 mb-4 ${
                          isToxic
                            ? "bg-amber-900/20 border-amber-500/50"
                            : "bg-slate-800/30 border-slate-700/50"
                        }`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-button/80 flex items-center justify-center shrink-0">
                            <span className="text-font-light font-bold text-base sm:text-lg">
                              {f.user.image ? (
                                <Image
                                  alt="Foto de perfil del usuario"
                                  src={f.user.image}
                                  width={100}
                                  height={100}
                                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-button/80 flex items-center justify-center"
                                />
                              ) : (
                                `${f.user.name[0].toUpperCase()}`
                              )}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-font-light flex flex-wrap items-center gap-2 mb-1 sm:mb-2 text-sm sm:text-base">
                                  <span className="truncate">{f.user.name}</span>
                                  {isToxic && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-medium shrink-0">
                                      <HiExclamationTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      <span className="hidden sm:inline">Contenido inapropiado</span>
                                      <span className="sm:hidden">Inapropiado</span>
                                    </span>
                                  )}
                                </h4>
                                <p className="text-slate-400 text-xs">
                                  {formatDate(f.createdAt)}
                                </p>
                              </div>
                              {f.rating && renderStars(f.rating)}
                            </div>

                            <p
                              className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                                isToxic ? "text-amber-200/80" : "text-slate-300"
                              }`}
                            >
                              {f.feedback}
                            </p>

                            {isToxic && (
                              <button
                                onClick={() => {
                                  if (f.user.isActive) {
                                    setCurrentUser(f.user);
                                    setShowBanModal(true);
                                  }
                                }}
                                disabled={
                                  banUnbanUserLoading || !f.user.isActive
                                }
                                className={`disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start cursor-pointer gap-2 bg-slate-700/50 border px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm w-full sm:w-auto ${
                                  !f.user.isActive
                                    ? "border-slate-500/50 text-slate-400"
                                    : "hover:bg-slate-700/90 border-amber-300/50 text-amber-300"
                                }`}
                              >
                                {banUnbanUserLoading &&
                                currentUser?.id === f.user.id ? (
                                  <div className="flex gap-2 items-center">
                                    <TinyLoader />
                                    <span className="hidden sm:inline">Baneando usuario</span>
                                    <span className="sm:hidden">...</span>
                                  </div>
                                ) : !f.user.isActive ? (
                                  <>
                                    <HiBan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Usuario baneado
                                  </>
                                ) : (
                                  <>
                                    <HiBan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">
                                      Banear por comportamiento inapropiado
                                    </span>
                                    <span className="sm:hidden">Banear usuario</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {showBanModal && currentUser && (
                    <BanReasonModal
                      banReason={banReason}
                      setBanReason={setBanReason}
                      onCancel={() => {
                        setShowBanModal(false);
                        setBanReason("");
                        setCurrentUser(null);
                      }}
                      onConfirm={confirmBan}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <HiStar className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-sm sm:text-base">
                    Este curso no tiene reviews todavía
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;

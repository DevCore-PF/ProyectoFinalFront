"use client";
import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";
import {
  HiSearch,
  HiFilter,
  HiEye,
  HiBan,
  HiCheckCircle,
  HiBookOpen,
  HiChevronDown,
  HiDownload,
  HiStar,
} from "react-icons/hi";
import { FaPlus } from "react-icons/fa";
import { CourseReview, TabType } from "@/types/admin.types";

import { downloadCourses } from "@/helpers/adminHandlers";
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";
import CourseModal from "./CourseModal";
import CreateCourseAdmin from "./CreateCourseAdmin";
import CreateLessonAdmin from "./CreateLessonAdmin";
import { CourseVisibility } from "@/types/course.types";

type CourseStatus = "all" | "active" | "inactive";
type CourseCategory =
  | "all"
  | "Backend"
  | "Frontend"
  | "Mobile"
  | "DataScience"
  | "DataBase"
  | "VideoGames";

type CourseDifficulty = "all" | "Principiante" | "Intermedio" | "Avanzado";
type SortBy = "title" | "price" | "createdAt" | "rating";
type SortOrder = "asc" | "desc";

interface CoursesPageProps {
  onViewDetail: (tab: TabType, id: string) => void;
}

const CoursesPage = ({ onViewDetail }: CoursesPageProps) => {
  const {
    courses,
    isLoadingCourses,
    coursesError,
    refreshCourses,
    activateDeactivateCourse,
    fetchFeedback,
    silentRefreshCourses,
  } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory>("all");
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<CourseDifficulty>("all");
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [loadingCourseId, setLoadingCourseId] = useState<string | null>(null);
  const [loadingGroupAction, setLoadingGroupAction] = useState<
    "activate" | "deactivate" | null
  >(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLessonsModal, setShowLessonsModal] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  const [feedbacksByCourse, setFeedbacksByCourse] = useState<
    Record<string, CourseReview[]>
  >({});
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const filters = {
      title: debouncedSearchTerm || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      difficulty: selectedDifficulty !== "all" ? selectedDifficulty : undefined,
      isActive:
        selectedStatus === "all" ? undefined : selectedStatus === "active",
      sortBy,
      sortOrder,
    };

    refreshCourses(filters);
  }, [
    debouncedSearchTerm,
    selectedCategory,
    selectedDifficulty,
    selectedStatus,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    refreshCourses();
  }, []);

  {
    /* ============[ ESTADISTICAS ]============= */
  }
  const stats = useMemo(() => {
    return {
      total: courses.length,
      active: courses.filter((c) => c.isActive).length,
      inactive: courses.filter((c) => !c.isActive).length,
      totalRevenue: courses.reduce((sum, c) => sum + parseFloat(c.price), 0),
    };
  }, [courses]);

  {
    /* ============[ ESTILOS BADGE STATUS ]============= */
  }
  {
    /* export enum CourseStatus {
  DRAFT = "EN REVISION",
  PUBLISHED = "PUBLICADO",
  REJECT = "RECHAZADO",
} */
  }
  const getStatusBadge = (status: string) => {
    return status === "PUBLICADO"
      ? "bg-emerald-500/10 text-emerald-300/90 border-emerald-500/20"
      : status === "RECHAZADO"
      ? "bg-amber-500/10 text-amber-200 border-amber-500/20"
      : "bg-slate-500/10 text-slate-200 border-slate-500/20";
  };


  /* ============[ ESTILOS BADGE CATEGORY ]============= */
  const getCategoryBadge = (category: string) => {
    const config = {
      Backend: "bg-blue-400/10 text-blue-200 border-blue-500/20",
      "Front End": "bg-purple-400/10 text-purple-300 border-purple-500/20",
      FullStack: "bg-green-400/10 text-green-300 border-green-500/20",
      DevOps: "bg-orange-400/10 text-orange-300 border-orange-500/20",
    };
    return config[category as keyof typeof config];
  };

  const getDificulttyBadge = (difficulty: string) => {
    const config = {
      PRINCIPIANTE: "text-blue-200 border-blue-300/40",
      INTERMEDIO: " text-purple-200 border-purple-300/40",
      AVANZADO: " text-emerald-200 border-emerald-300/40",
    };
    return config[difficulty as keyof typeof config];
  };

  /* ============[ RENDER STARS ]============= */
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <HiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  /* ============[ CALCULAR RATING PROMEDIO ]============= */
  const getAverageRating = (courseId: string): number => {
    const courseFeedbacks = feedbacksByCourse[courseId];

    if (!courseFeedbacks || courseFeedbacks.length === 0) return 0;

    const sum = courseFeedbacks.reduce((acc, f) => acc + f.rating, 0);
    return Math.round(sum / courseFeedbacks.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ============[ HANDLERS ]============= */
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === courses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(courses.map((c) => c.id));
    }
  };

  const deactivateMultipleCourses = async (courseIds: string[]) => {
    setLoadingGroupAction("deactivate"); // Cambio aquí
    const results = {
      success: [] as string[],
      errors: [] as { courseId: string; error: string }[],
    };

    for (const courseId of courseIds) {
      try {
        await activateDeactivateCourse(courseId);
        results.success.push(courseId);
      } catch (error) {
        results.errors.push({
          courseId,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    setLoadingGroupAction(null); // Cambio aquí
    setSelectedCourses([]);

    if (results.success.length > 0) {
      toastSuccess(`${results.success.length} cursos desactivados`);
    }
    if (results.errors.length > 0) {
      toastError(`${results.errors.length} cursos fallaron`);
    }
  };

  const activateMultipleCourses = async (courseIds: string[]) => {
    setLoadingGroupAction("activate"); // Cambio aquí
    const results = {
      success: [] as string[],
      errors: [] as { courseId: string; error: string }[],
    };

    for (const courseId of courseIds) {
      try {
        await activateDeactivateCourse(courseId);
        results.success.push(courseId);
      } catch (error) {
        results.errors.push({
          courseId,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    setLoadingGroupAction(null); // Cambio aquí
    setSelectedCourses([]);

    if (results.success.length > 0) {
      toastSuccess(`${results.success.length} cursos activados`);
    }
    if (results.errors.length > 0) {
      toastError(`${results.errors.length} cursos fallaron`);
    }
  };
  const handleCloseLessonsModal = () => {
    toastConfirm(
      "El curso se creó pero sin lecciones.",
      () => {
        setShowLessonsModal(false);
        setCreatedCourseId(null);
        refreshCourses();
      },
      () => {}
    );
  };

  const handleCancelLessons = () => {
    toastConfirm(
      "El curso se creará sin lecciones.",
      () => {
        // onConfirm
        setShowLessonsModal(false);
        setCreatedCourseId(null);
        refreshCourses();
      },
      () => {}
    );
  };

  const handleCancelCourse = () => {
    toastConfirm(
      "Perderás los datos ingresados.",
      () => {
        setShowCreateModal(false);
      },
      () => {}
    );
  };

  const handleChangeStatus = async (courseId: string) => {
    let message = "";
    courses.find((c) => {
      const course = c.id === courseId;
      if (course && c.isActive) {
        message = "Desactivar curso";
      } else if (course && !c.isActive) {
        message = "Activar curso";
      }
    });
    toastConfirm(
      message,
      async () => {
        setLoadingCourseId(courseId);
        try {
          await activateDeactivateCourse(courseId);
          await silentRefreshCourses();
          toastSuccess(
            courses.find((c) => c.id === courseId)?.isActive
              ? "Curso desactivado"
              : "Curso activado"
          );
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingCourseId(null);
        }
      },
      () => {}
    );
  };

  useEffect(() => {
    const loadFeedbacks = async () => {
      const feedbackMap: Record<string, CourseReview[]> = {};

      for (const course of courses) {
        try {
          const courseFeedbacks = await fetchFeedback(course.id);
          if (courseFeedbacks) {
            feedbackMap[course.id] = courseFeedbacks;
          }
        } catch (error) {
          console.error(
            `Error cargando feecback para el curso ${course.id}:`,
            error
          );
        }
      }
      setFeedbacksByCourse(feedbackMap);
    };

    if (courses.length > 0) {
      loadFeedbacks();
    }
  }, [courses]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-font-light mb-2">
                Gestión de Cursos
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => downloadCourses(courses)}
                className="flex cursor-pointer items-center gap-2 bg-button/80 hover:bg-button/90 text-font-light px-4 py-2 rounded-lg font-medium transition-all"
              >
                <HiDownload className="w-5 h-5" />
                Exportar cursos
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex cursor-pointer items-center gap-2 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600 text-font-light px-4 py-2 rounded-lg font-medium transition-all"
              >
                <FaPlus className="w-5 h-5" />
                Crear Curso
              </button>
            </div>
          </div>

          {/* ============[ STATS CARDS ]============= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Total</p>
              <p className="text-2xl font-bold text-font-light">
                {stats.total}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Activos</p>
              <p className="text-2xl font-bold text-emerald-300">
                {stats.active}
              </p>
            </div>
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Inactivos</p>
              <p className="text-2xl font-bold text-amber-300">
                {stats.inactive}
              </p>
            </div>

            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-1">Ingresos</p>
              <p className="text-2xl font-bold text-green-300">
                ${stats.totalRevenue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* ============[ FILTERS AND SEARCH ]============= */}
        <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-border-light/80"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as CourseCategory)
              }
              className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              <option value="Backend">Backend</option>
              <option value="Front End">Frontend</option>
              <option value="Mobile">Movil</option>
              <option value="DataScience">Data Science</option>
              <option value="DataBase">Base de datos</option>
              <option value="VideoGames">Video Juegos</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) =>
                setSelectedDifficulty(e.target.value as CourseDifficulty)
              }
              className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
            >
              <option value="all">Todas las dificultades</option>
              <option value="PRINCIPIANTE">Principiante</option>
              <option value="INTERMEDIO">Intermedio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as CourseStatus)
              }
              className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            {/* ============[ SORT ]============= */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex cursor-pointer items-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-font-light px-4 py-2.5 rounded-lg font-medium transition-all"
            >
              <HiFilter className="w-5 h-5" />
              Ordenar
              <HiChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* ============[ ORDENAR POR ADVANCE FILTER ]============= */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
                  >
                    <option value="title">Título</option>
                    <option value="price">Precio</option>
                    <option value="rating">Rating</option>
                    <option value="createdAt">Fecha de creación</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 text-sm mb-2 block">
                    Orden
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="w-full bg-background border border-slate-700 rounded-lg px-4 py-2 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
                  >
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============[ LOADING ]============= */}
        {isLoadingCourses && (
          <div className="flex flex-col justify-center items-center py-16">
            <Loader size="medium" />
            <p className="text-slate-400">Cargando cursos...</p>
          </div>
        )}

        {/* ============[ ERROR ]============= */}
        {coursesError && !isLoadingCourses && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl mb-6">
            {coursesError}
          </div>
        )}

        {/* ============[ CONTENT ]============= */}
        {!isLoadingCourses && !coursesError && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400">
                Mostrando{" "}
                <span className="text-font-light font-semibold">
                  {courses.length}
                </span>{" "}
                de{" "}
                <span className="text-font-light font-semibold">
                  {courses.length}
                </span>{" "}
                cursos
              </p>

              {selectedCourses.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">
                    {selectedCourses.length} seleccionados
                  </span>
                  <button
                    onClick={() => deactivateMultipleCourses(selectedCourses)}
                    disabled={loadingGroupAction !== null}
                    className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-amber-300/50 text-amber-200 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingGroupAction === "deactivate" ? (
                      <>
                        <TinyLoader />
                        Procesando...
                      </>
                    ) : (
                      "Desactivar seleccionados"
                    )}
                  </button>
                  <button
                    onClick={() => activateMultipleCourses(selectedCourses)}
                    disabled={loadingGroupAction !== null}
                    className="cursor-pointer bg-slate-700/50 hover:bg-slate-700/80 border border-emerald-500 text-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loadingGroupAction === "activate" ? (
                      <>
                        <TinyLoader />
                        Procesando...
                      </>
                    ) : (
                      "Activar seleccionados"
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* ============[ COURSES TABLE ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* ============[ HEAD ]============= */}
                  <thead className="bg-slate-800/50 border-b  border-slate-700/50">
                    <tr>
                      <th className="px-4 py-4 text-left w-12 ">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              selectedCourses.length === courses.length &&
                              courses.length > 0
                            }
                            onChange={handleSelectAll}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                              selectedCourses.length === courses.length &&
                              courses.length > 0
                                ? "border-font-light"
                                : "border-slate-600 bg-slate-700/50"
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 text-font-light transition-opacity ${
                                selectedCourses.length === courses.length &&
                                courses.length > 0
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </label>
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-64">
                        Curso
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-40">
                        Profesor
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-38">
                        Dificultad
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-32">
                        Categoría
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-29">
                        Rating
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-20">
                        Estado
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold w-20">
                        Precio
                      </th>
                      <th className="px-4 py-4 text-right text-slate-400 text-sm font-semibold w-15">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  {/* ============[ BODY ]============= */}
                  <tbody className="divide-y divide-slate-700/50">
                    {courses.map((course, index) => {
                      return (
                        <tr
                          key={course.id}
                          className={`transition-colors hover:bg-slate-800/30 ${
                            !course.isActive
                              ? "bg-amber-300/10 hover:bg-amber-300/10! "
                              : ""
                          }`}
                        >
                          <td className="px-4 py-4">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => handleSelectCourse(course.id)}
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 border rounded-[5px] flex items-center justify-center transition-all ${
                                  selectedCourses.includes(course.id)
                                    ? "border-font-light"
                                    : "border-slate-600 bg-slate-700/50"
                                }`}
                              >
                                <svg
                                  className={`w-3 h-3 text-font-light transition-opacity ${
                                    selectedCourses.includes(course.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </label>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-8 border-button/80 bg-button/20 border rounded-lg flex items-center justify-center">
                                <HiBookOpen className="w-5 h-5 text-accent-light" />
                              </div>
                              <div className="w-full">
                                <p className="font-medium text-font-light truncate max-w-[200px]">
                                  {course.title}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {course.lessons?.length || 0} lecciones
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-font-light text-sm">
                              {course.professor?.user?.name || "—"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <p
                              className={`px-3 py-1 rounded-lg text-xs font-light border inline-flex items-center gap-1.5 ${getDificulttyBadge(
                                course.difficulty
                              )}`}
                            >
                              {course.difficulty}
                            </p>
                          </td>
                          <td className="px-2 py-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${getCategoryBadge(
                                course.category
                              )}`}
                            >
                              {course.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {(() => {
                                const avgRating = getAverageRating(course.id);
                                const courseFeedbacks =
                                  feedbacksByCourse[course.id];

                                return (
                                  <>
                                    {renderStars(avgRating)}
                                    {courseFeedbacks &&
                                      courseFeedbacks.length > 0 && (
                                        <span className="text-slate-400 text-xs">
                                          ({courseFeedbacks.length})
                                        </span>
                                      )}
                                  </>
                                );
                              })()}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                                course.status
                              )}`}
                            >
                              {course.status === "EN REVISION"
                                ? "En revisión"
                                : course.status === "PUBLICADO"
                                ? "Publicado"
                                : "Rechazado"}
                            </span>
                          </td>
                      
                          <td className="px-4 py-4">
                            <p className="text-emerald-200/80 text-sm flex items-center">
                              ${course.price}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  onViewDetail("courses", course.id)
                                }
                                className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                                title="Ver curso"
                              >
                                <HiEye className="w-4 h-4" />
                              </button>
                              {course.isActive ? (
                                <button
                                  onClick={() => handleChangeStatus(course.id)}
                                  disabled={loadingCourseId === course.id}
                                  className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700/90 border border-amber-300/50 text-amber-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Desactivar curso"
                                >
                                  {loadingCourseId === course.id ? (
                                    <TinyLoader />
                                  ) : (
                                    <HiBan className="w-4 h-4" />
                                  )}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleChangeStatus(course.id)}
                                  disabled={loadingCourseId === course.id}
                                  className="p-2 cursor-pointer bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400/80 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Activar curso"
                                >
                                  {loadingCourseId === course.id ? (
                                    <TinyLoader />
                                  ) : (
                                    <HiCheckCircle className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* ============[ NO HAY CURSOS ]============= */}
              {courses.length === 0 && (
                <div className="text-center py-16">
                  <HiBookOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">
                    No se encontraron cursos
                  </p>
                  <p className="text-slate-500 text-sm">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {courses.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-slate-400 text-sm">Página 1 de 1</p>
                <div className="flex gap-2">
                  <button className="cursor-pointer px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Anterior
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-button/80 text-font-light rounded-lg font-medium">
                    1
                  </button>
                  <button className="cursor-pointer px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-400 rounded-lg font-medium opacity-50 cursor-not-allowed">
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <CourseModal
        isOpen={showCreateModal}
        onClose={handleCancelCourse}
        title="Crear Nuevo Curso"
      >
        <CreateCourseAdmin
          onSuccess={(courseId) => {
            setCreatedCourseId(courseId);
            setShowCreateModal(false);
            setShowLessonsModal(true);
          }}
          onCancel={handleCancelCourse}
        />
      </CourseModal>

      <CourseModal
        isOpen={showLessonsModal}
        onClose={handleCloseLessonsModal}
        title="Crear Lecciones del Curso"
      >
        {createdCourseId && (
          <CreateLessonAdmin
            courseId={createdCourseId}
            onSuccess={() => {
              setShowLessonsModal(false);
              setCreatedCourseId(null);
              refreshCourses();
            }}
            onCancel={handleCancelLessons}
          />
        )}
      </CourseModal>
    </div>
  );
};

export default CoursesPage;

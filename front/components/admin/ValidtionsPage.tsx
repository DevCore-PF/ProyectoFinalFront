"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  HiSearch,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiUser,
  HiBookOpen,
  HiAcademicCap,
  HiClock,
} from "react-icons/hi";
import Loader from "../Loaders/Loader";
import { CourseStatus } from "@/types/course.types";
import { CourseValidation, TabType } from "@/types/admin.types";
import { useAuth } from "@/context/UserContext";

type ValidationTab = "professors" | "courses";
type FilterStatus = "all" | "pending" | "approved" | "rejected";

interface validationPageProps {
  onViewDetail: (tab: TabType, id: string, validationType?: "professor" | "course") => void;
}

const ValidationsPage = ({ onViewDetail }: validationPageProps) => {
  const {
    courses,
    isLoadingCourses,
    refreshProfiles,
    refreshCourses,
    professorProfiles,
    isLoadingProfiles,
    profileError,
    coursesError,
    silentRefreshProfiles,
    silentRefreshCourses,
    isInitialLoading,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<ValidationTab>("professors");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [professorCurrentPage, setProfessorCurrentPage] = useState(1);
  const [professorItemsPerPage] = useState(10);
  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [courseItemsPerPage] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const prevProfessorsLengthRef = useRef<number>(0);
  const prevCoursesLengthRef = useRef<number>(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setProfessorCurrentPage(1);
      setCourseCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { user } = useAuth();
  const currentUserId = user?.id;
  const getCategoryBadge = (category: string) => {
    const config = {
      Backend: "bg-blue-400/10 text-blue-200 border-blue-500/20",
      Frontend: "bg-purple-400/10 text-purple-300 border-purple-500/20",
      "Mobile Development": "bg-pink-400/10 text-pink-300 border-pink-500/20",
      "Data Science": "bg-cyan-400/10 text-cyan-300 border-cyan-500/20",
      Database: "bg-indigo-400/10 text-indigo-300 border-indigo-500/20",
      "Video Games": "bg-fuchsia-400/10 text-fuchsia-300 border-fuchsia-500/20",
      "UI/UX Design": "bg-rose-400/10 text-rose-300 border-rose-500/20",
      Cybersecurity: "bg-red-400/10 text-red-200 border-red-500/20",
      DevOps: "bg-orange-400/10 text-orange-300 border-orange-500/20",
      "Artificial Intelligence": "bg-violet-400/10 text-violet-300 border-violet-500/20",
      "Machine Learning": "bg-purple-400/10 text-purple-200 border-purple-500/20",
      "Digital Marketing": "bg-amber-400/10 text-amber-300 border-amber-500/20",
      "Web Development": "bg-green-400/10 text-green-300 border-green-500/20",
      "QA & Testing": "bg-teal-400/10 text-teal-300 border-teal-500/20",
      Automation: "bg-lime-400/10 text-lime-300 border-lime-500/20",
    };
    return config[category as keyof typeof config] || "bg-gray-400/10 text-gray-300 border-gray-500/20";
  };
  // ============[ FILTRAR PROFESORES ]============
  const filteredProfessorProfiles = useMemo(() => {
    let filtered = professorProfiles;

    if (currentUserId) {
      filtered = filtered.filter((p) => p.user.id !== currentUserId);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.approvalStatus === filterStatus);
    }

    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.user.name.toLowerCase().includes(searchLower) ||
          p.user.email.toLowerCase().includes(searchLower) ||
          p.profession.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [professorProfiles, filterStatus, debouncedSearchTerm, currentUserId]);

  const paginatedProfessors = useMemo(() => {
    const startIndex = (professorCurrentPage - 1) * professorItemsPerPage;
    const endIndex = startIndex + professorItemsPerPage;
    return filteredProfessorProfiles.slice(startIndex, endIndex);
  }, [filteredProfessorProfiles, professorCurrentPage, professorItemsPerPage]);

  const totalProfessorPages = useMemo(() => {
    return Math.ceil(filteredProfessorProfiles.length / professorItemsPerPage);
  }, [filteredProfessorProfiles.length, professorItemsPerPage]);

  // ============[ PROCESAR CURSOS ]============
  const courseValidations = useMemo(() => {
    const coursesWithValidation: CourseValidation[] = courses.map((course) => ({
      id: course.id,
      title: course.title,
      professorName: course.professor?.user?.name || "Sin profesor",
      professorEmail: course.professor?.user?.email || "",
      category: course.category,
      status: course.status,
      createdAt: course.createdAt,
      price: course.price,
      difficulty: course.difficulty,
      visibility: course.visibility,
    }));

    let filtered = coursesWithValidation;
    if (filterStatus !== "all") {
      const statusMap: Record<FilterStatus, CourseStatus | null> = {
        all: null,
        pending: CourseStatus.DRAFT,
        approved: CourseStatus.PUBLISHED,
        rejected: CourseStatus.REJECT,
      };
      const targetStatus = statusMap[filterStatus];
      if (targetStatus) {
        filtered = coursesWithValidation.filter((c) => c.status === targetStatus);
      }
    }

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.professorName.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [courses, filterStatus, debouncedSearchTerm]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (courseCurrentPage - 1) * courseItemsPerPage;
    const endIndex = startIndex + courseItemsPerPage;
    return courseValidations.slice(startIndex, endIndex);
  }, [courseValidations, courseCurrentPage, courseItemsPerPage]);

  const totalCoursePages = useMemo(() => {
    return Math.ceil(courseValidations.length / courseItemsPerPage);
  }, [courseValidations.length, courseItemsPerPage]);

  // ============[ ESTADÍSTICAS ]============
  const stats = useMemo(() => {
    const professorStats = {
      pending: professorProfiles.filter((p) => p.approvalStatus === "pending").length,
      approved: professorProfiles.filter((p) => p.approvalStatus === "approved").length,
      rejected: professorProfiles.filter((p) => p.approvalStatus === "rejected").length,
    };

    const courseStats = {
      pending: courses.filter((c) => c.status === CourseStatus.DRAFT).length,
      approved: courses.filter((c) => c.status === CourseStatus.PUBLISHED).length,
      rejected: courses.filter((c) => c.status === CourseStatus.REJECT).length,
    };
    return activeTab === "professors" ? professorStats : courseStats;
  }, [professorProfiles, courses, activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      rejected: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      "EN REVISION": "bg-blue-500/10 text-blue-300 border-blue-500/20",
      PUBLICADO: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      RECHAZADO: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      "EN REVISION": "En Revisión",
      PUBLICADO: "Publicado",
      RECHAZADO: "Rechazado",
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getVisibilityBadge = (visibility: string) => {
    return visibility === "PUBLICO"
      ? "bg-emerald-500/10 text-emerald-300/90 border-emerald-500/20"
      : "bg-amber-500/10 text-amber-200 border-amber-500/20";
  };

  const isLoading = isLoadingProfiles || isLoadingCourses;

  useEffect(() => {
    const refreshPage = async () => {
      await refreshProfiles();
      await refreshCourses();
    };
    refreshPage();

    const intervalId = setInterval(async () => {
      if (document.visibilityState === "visible") {
        await silentRefreshCourses();
        await silentRefreshProfiles();
      }
    }, 10000);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevProfessorsLengthRef.current = professorProfiles.length;
      prevCoursesLengthRef.current = courses.length;
      return;
    }
    const professorsChanged = professorProfiles.length !== prevProfessorsLengthRef.current;
    const coursesChanged = courses.length !== prevCoursesLengthRef.current;
    if (professorsChanged || coursesChanged) {
      prevProfessorsLengthRef.current = professorProfiles.length;
      prevCoursesLengthRef.current = courses.length;
    }
  }, [professorProfiles.length, courses.length]);

  // ============[ FUNCIONES DE PAGINACION ]============
  const goToProfessorNextPage = () => {
    setProfessorCurrentPage((prev) => Math.min(prev + 1, totalProfessorPages));
  };

  const goToProfessorPrevPage = () => {
    setProfessorCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToProfessorPage = (pageNumber: number) => {
    setProfessorCurrentPage(pageNumber);
  };

  const goToCourseNextPage = () => {
    setCourseCurrentPage((prev) => Math.min(prev + 1, totalCoursePages));
  };

  const goToCoursePrevPage = () => {
    setCourseCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToCoursePage = (pageNumber: number) => {
    setCourseCurrentPage(pageNumber);
  };
  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="medium" />
        <p className="text-slate-400 ml-4">Cargando solicitudes...</p>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ============[ HEADER   ]============ */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-font-light">Solicitudes Pendientes</h2>
      </div>

      {/* ============[ STATS CARDS   ]============ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-background2/40 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-xs sm:text-sm mb-1">Pendientes</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-200">{stats.pending}</p>
            </div>
            <HiClock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400/50" />
          </div>
        </div>

        <div className="bg-background2/40 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-xs sm:text-sm mb-1">Aprobados</p>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-200">{stats.approved}</p>
            </div>
            <HiCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400/50" />
          </div>
        </div>

        <div className="bg-background2/40 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-xs sm:text-sm mb-1">Rechazados</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-200">{stats.rejected}</p>
            </div>
            <HiXCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400/50" />
          </div>
        </div>
      </div>

      {/* ============[ TABS   ]============ */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-1.5 sm:p-2">
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab("professors");
              setSearchTerm("");
              setFilterStatus("all");
              setProfessorCurrentPage(1);
            }}
            className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
              activeTab === "professors"
                ? "bg-button/50 text-font-light"
                : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
            }`}
          >
            <HiAcademicCap className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="hidden xs:inline">Profesores</span>
            <span className="xs:hidden">Profes</span>
            {filteredProfessorProfiles.filter((p) => p.approvalStatus === "pending").length > 0 && (
              <span className="bg-amber-300/80 text-background/70 text-xs font-bold rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1">
                {filteredProfessorProfiles.filter((p) => p.approvalStatus === "pending").length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("courses");
              setSearchTerm("");
              setFilterStatus("all");
              setCourseCurrentPage(1);
            }}
            className={`flex-1 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
              activeTab === "courses"
                ? "bg-button/50 text-font-light"
                : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
            }`}
          >
            <HiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            Cursos
            {courses.filter((c) => c.status === CourseStatus.DRAFT).length > 0 && (
              <span className="bg-amber-300/80 text-background/70 text-xs font-bold rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1">
                {courses.filter((c) => c.status === CourseStatus.DRAFT).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============[ FILTROS   ]============ */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === "professors" ? "profesores" : "cursos"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-slate-700 rounded-lg pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-border-light/80"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-background border border-slate-700 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>

      {/* ============[ LOADING ]============ */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-12 sm:py-16">
          <Loader size="medium" />
          <p className="text-slate-400 text-sm sm:text-base mt-2">Cargando validaciones...</p>
        </div>
      )}

      {/* ============[ ERRORS ]============ */}
      {profileError && !isLoadingProfiles && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
          {profileError}
        </div>
      )}
      {coursesError && !isLoadingCourses && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
          {coursesError}
        </div>
      )}

      {/* ============[ CONTENIDO ]============ */}
      {!isLoading && (
        <>
          {/* ============[ TABLA DE PROFESORES ]============ */}
          {activeTab === "professors" && (
            <div>
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50 border-b border-slate-700/50">
                      <tr>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[180px]">
                          Profesor
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[180px]">
                          Email
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[120px]">
                          Profesión
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[120px]">
                          Fecha
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                          Estado
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-slate-400 text-xs sm:text-sm font-semibold min-w-[80px]">
                          Acciones
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-700/50">
                      {paginatedProfessors.map((professor) => (
                        <tr key={professor.id} className="transition-colors hover:bg-slate-800/30">
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center shrink-0">
                                {professor.user.image ? (
                                  <img
                                    src={professor.user.image}
                                    alt={professor.user.name}
                                    className="w-full h-full rounded-full object-cover"
                                  />
                                ) : (
                                  <HiUser className="w-4 h-4 sm:w-5 sm:h-5 text-font-light" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-font-light text-sm sm:text-base truncate">
                                  {professor.user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="text-slate-300 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-none">
                              {professor.user.email}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="text-slate-300 text-xs sm:text-sm">{professor.profession}</p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="text-slate-400 text-xs sm:text-sm">
                              {formatDate(professor.user.RequestingTeacherRoleDate)}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                                professor.approvalStatus
                              )}`}
                            >
                              {getStatusLabel(professor.approvalStatus)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => onViewDetail("validations", professor.id, "professor")}
                                className="p-1.5 sm:p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                                title="Ver detalles"
                              >
                                <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!profileError && paginatedProfessors.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <HiAcademicCap className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-base sm:text-lg font-medium mb-2">
                      No se encontraron profesores.
                    </p>
                    <p className="text-slate-500 text-sm">
                      {filterStatus !== "all"
                        ? "Intenta cambiar los filtros"
                        : "Cuando haya solicitudes aparecerán aquí"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============[ TABLA DE CURSOS ]============ */}
          {activeTab === "courses" && (
            <div>
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-800/50 border-b border-slate-700/50">
                      <tr>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[200px]">
                          Curso
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[150px]">
                          Profesor
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                          Categoría
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[120px]">
                          Fecha
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                          Estado
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-left text-slate-400 text-xs sm:text-sm font-semibold min-w-[100px]">
                          Visibilidad
                        </th>
                        <th className="px-3 sm:px-4 py-3 sm:py-4 text-right text-slate-400 text-xs sm:text-sm font-semibold min-w-[80px]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {paginatedCourses.map((course) => (
                        <tr key={course.id} className="transition-colors hover:bg-slate-800/30">
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-8 h-6 sm:w-10 sm:h-8 border-button/80 bg-button/20 border rounded-lg flex items-center justify-center shrink-0">
                                <HiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-font-light text-sm sm:text-base truncate max-w-[150px] sm:max-w-[250px]">
                                  {course.title}
                                </p>
                                <p className="text-xs text-slate-400">{course.difficulty}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="text-slate-300 text-xs sm:text-sm truncate">
                              {course.professorName}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[120px]">
                              {course.professorEmail}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <span
                              className={`px-2  py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1 sm:gap-1.5 ${getCategoryBadge(
                                course.category
                              )}`}
                            >
                              {course.category}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <p className="text-slate-400 text-xs sm:text-sm">
                              {formatDate(course.createdAt)}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                                course.status
                              )}`}
                            >
                              {getStatusLabel(course.status)}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getVisibilityBadge(
                                course.visibility
                              )}`}
                            >
                              {course.visibility === "PUBLICO" ? "Público" : "Privado"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 sm:py-4">
                            <div className="flex items-center justify-end">
                              <button
                                onClick={() => onViewDetail("validations", course.id, "course")}
                                className="p-1.5 sm:p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                                title="Ver detalles"
                              >
                                <HiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!profileError && paginatedCourses.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <HiBookOpen className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-base sm:text-lg font-medium mb-2">
                      No se encontraron cursos.
                    </p>
                    <p className="text-slate-500 text-sm">
                      {filterStatus !== "all"
                        ? "Intenta cambiar los filtros"
                        : "Cuando haya cursos en revisión aparecerán aquí"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============[ PAGINACIÓN PROFESORES   ]============ */}
          {activeTab === "professors" && paginatedProfessors.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                  Página {professorCurrentPage} de {totalProfessorPages}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <button
                    onClick={goToProfessorPrevPage}
                    disabled={professorCurrentPage === 1}
                    className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      professorCurrentPage === 1
                        ? "text-slate-400 opacity-50 cursor-not-allowed"
                        : "text-font-light hover:bg-slate-700"
                    }`}
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalProfessorPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      if (typeof window !== "undefined" && window.innerWidth < 640) {
                        return (
                          Math.abs(pageNum - professorCurrentPage) <= 1 ||
                          pageNum === 1 ||
                          pageNum === totalProfessorPages
                        );
                      }
                      return true;
                    })
                    .map((pageNum, index, array) => {
                      const prevNum = array[index - 1];
                      const showDots = prevNum && pageNum - prevNum > 1;

                      return (
                        <div key={pageNum} className="flex items-center gap-1.5 sm:gap-2">
                          {showDots && <span className="text-slate-400 px-1">...</span>}
                          <button
                            onClick={() => goToProfessorPage(pageNum)}
                            className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                              professorCurrentPage === pageNum
                                ? "bg-button/80 text-font-light"
                                : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}

                  <button
                    onClick={goToProfessorNextPage}
                    disabled={professorCurrentPage === totalProfessorPages}
                    className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      professorCurrentPage === totalProfessorPages
                        ? "text-slate-400 opacity-50 cursor-not-allowed"
                        : "text-font-light hover:bg-slate-700"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============[ PAGINACIÓN CURSOS   ]============ */}
          {activeTab === "courses" && paginatedCourses.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <p className="text-slate-400 text-xs sm:text-sm text-center sm:text-left">
                  Página {courseCurrentPage} de {totalCoursePages}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <button
                    onClick={goToCoursePrevPage}
                    disabled={courseCurrentPage === 1}
                    className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      courseCurrentPage === 1
                        ? "text-slate-400 opacity-50 cursor-not-allowed"
                        : "text-font-light hover:bg-slate-700"
                    }`}
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalCoursePages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      if (typeof window !== "undefined" && window.innerWidth < 640) {
                        return (
                          Math.abs(pageNum - courseCurrentPage) <= 1 ||
                          pageNum === 1 ||
                          pageNum === totalCoursePages
                        );
                      }
                      return true;
                    })
                    .map((pageNum, index, array) => {
                      const prevNum = array[index - 1];
                      const showDots = prevNum && pageNum - prevNum > 1;

                      return (
                        <div key={pageNum} className="flex items-center gap-1.5 sm:gap-2">
                          {showDots && <span className="text-slate-400 px-1">...</span>}
                          <button
                            onClick={() => goToCoursePage(pageNum)}
                            className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                              courseCurrentPage === pageNum
                                ? "bg-button/80 text-font-light"
                                : "bg-slate-700/50 border border-slate-600 text-slate-400 hover:bg-slate-700"
                            }`}
                          >
                            {pageNum}
                          </button>
                        </div>
                      );
                    })}

                  <button
                    onClick={goToCourseNextPage}
                    disabled={courseCurrentPage === totalCoursePages}
                    className={`cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                      courseCurrentPage === totalCoursePages
                        ? "text-slate-400 opacity-50 cursor-not-allowed"
                        : "text-font-light hover:bg-slate-700"
                    }`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ValidationsPage;

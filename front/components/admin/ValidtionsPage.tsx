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
import { toastSuccess } from "@/helpers/alerts.helper";
type ValidationTab = "professors" | "courses";
type FilterStatus = "all" | "pending" | "approved" | "rejected";
interface validationPageProps {
  onViewDetail: (
    tab: TabType,
    id: string,
    validationType?: "professor" | "course"
  ) => void;
}

const ValidationsPage = ({ onViewDetail }: validationPageProps) => {
  const {
    users,
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
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<ValidationTab>("professors");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const prevProfessorsLengthRef = useRef<number>(0);
  const prevCoursesLengthRef = useRef<number>(0);
  const isInitialMount = useRef(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ============[ FILTRAR PROFESORES ]============
  const filteredProfessorProfiles = useMemo(() => {
    let filtered = professorProfiles;

    // 1. Filtrar por estado (pending, approved, rejected, all)
    if (filterStatus !== "all") {
      filtered = filtered.filter((p) => p.approvalStatus === filterStatus);
    }

    // 2. Filtrar por búsqueda (nombre, email, profesión)
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
  }, [professorProfiles, filterStatus, debouncedSearchTerm]);

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
    }));

    // Filtrar por estado
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
        filtered = coursesWithValidation.filter(
          (c) => c.status === targetStatus
        );
      }
    }

    // Filtrar por búsqueda
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          c.professorName
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [courses, filterStatus, debouncedSearchTerm]);

  // ============[ ESTADÍSTICAS ]============
  const stats = useMemo(() => {
    const professorStats = {
      pending: professorProfiles.filter((p) => p.approvalStatus === "pending")
        .length,
      approved: professorProfiles.filter((p) => p.approvalStatus === "approved")
        .length,
      rejected: professorProfiles.filter((p) => p.approvalStatus === "rejected")
        .length,
    };

    const courseStats = {
      pending: courses.filter((c) => c.status === CourseStatus.DRAFT).length,
      approved: courses.filter((c) => c.status === CourseStatus.PUBLISHED)
        .length,
      rejected: courses.filter((c) => c.status === CourseStatus.REJECT).length,
    };
    return activeTab === "professors" ? professorStats : courseStats;
  }, [professorProfiles, courses, activeTab]);

  // ============[ UTILIDADES ]============
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
      rejected: "bg-red-500/10 text-red-300 border-red-500/20",
      "EN REVISION": "bg-blue-500/10 text-blue-300 border-blue-500/20",
      PUBLICADO: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      RECHAZADO: "bg-red-500/10 text-red-300 border-red-500/20",
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      "EN REVISION": "En Revisión",
      PUBLICADO: "Publicado",
      RECHAZADO: "Rechazado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  // ============[ LOADER  ]============
  const isLoading = isLoadingProfiles || isLoadingCourses;
  useEffect(() => {
    const refreshPage = async () => {
      await refreshProfiles();
      await refreshCourses();
    };
    refreshPage();

    // const intervalId = setInterval(async () => {
    //   if (document.visibilityState === "visible") {
    //     await silentRefreshCourses();
    //     await silentRefreshProfiles();
    //   }
    // }, 10000);

    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevProfessorsLengthRef.current = professorProfiles.length;
      prevCoursesLengthRef.current = courses.length;
      return;
    }
    const professorsChanged =
      professorProfiles.length !== prevProfessorsLengthRef.current;
    const coursesChanged = courses.length !== prevCoursesLengthRef.current;
    if (professorsChanged || coursesChanged) {
      prevProfessorsLengthRef.current = professorProfiles.length;
      prevCoursesLengthRef.current = courses.length;
      if (!isInitialMount) toastSuccess("Has recibido una nueva solicitud");
    }
  }, [professorProfiles.length, courses.length]);

  return (
    <div className="space-y-6">
      {/* ============[ HEADER ]============ */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-font-light">
          Validaciones Pendientes
        </h2>
      </div>

      {/* ============[ STATS CARDS ]============ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background2/40  rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm mb-1">Pendientes</p>
              <p className="text-3xl font-bold text-blue-200">
                {stats.pending}
              </p>
            </div>
            <HiClock className="w-10 h-10 text-blue-400/50" />
          </div>
        </div>

        <div className="bg-background2/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-300 text-sm mb-1">Aprobados</p>
              <p className="text-3xl font-bold text-emerald-200">
                {stats.approved}
              </p>
            </div>
            <HiCheckCircle className="w-10 h-10 text-emerald-400/50" />
          </div>
        </div>

        <div className="bg-background2/40 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-300 text-sm mb-1">Rechazados</p>
              <p className="text-3xl font-bold text-amber-200">
                {stats.rejected}
              </p>
            </div>
            <HiXCircle className="w-10 h-10 text-amber-400/50" />
          </div>
        </div>
      </div>

      {/* ============[ TABS ]============ */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-2">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("professors");
              setSearchTerm("");
              setFilterStatus("all");
            }}
            className={`flex-1  cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "professors"
                ? "bg-button/50 text-font-light"
                : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
            }`}
          >
            <HiAcademicCap className="w-5 h-5" />
            Profesores
            {users.filter(
              (u) => u.professorProfile?.approvalStatus === "pending"
            ).length > 0 && (
              <span className="bg-blue-500 text-font-light text-xs font-bold rounded-full px-2 py-0.5">
                {
                  users.filter(
                    (u) => u.professorProfile?.approvalStatus === "pending"
                  ).length
                }
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("courses");
              setSearchTerm("");
              setFilterStatus("all");
            }}
            className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === "courses"
                ? "bg-button/50 text-font-light"
                : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
            }`}
          >
            <HiBookOpen className="w-5 h-5" />
            Cursos
            {courses.filter((c) => c.status === CourseStatus.DRAFT).length >
              0 && (
              <span className="bg-amber-300/80 text-background/70 text-xs font-bold rounded-full px-1.5 py-1">
                {courses.filter((c) => c.status === CourseStatus.DRAFT).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ============[ FILTROS Y BÚSQUEDA ]============ */}
      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Buscar ${
                activeTab === "professors" ? "profesores" : "cursos"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full  bg-background border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-font-light placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-border-light/80"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-background border border-slate-700 rounded-lg px-4 py-2.5 text-font-light focus:outline-none focus:ring-1 focus:ring-border-light/80 cursor-pointer"
          >
            <option className="hover:bg-button" value="all">
              Todos los estados
            </option>
            <option value="pending">Pendientes</option>
            <option value="approved">Aprobados</option>
            <option value="rejected">Rechazados</option>
          </select>
        </div>
      </div>

      {/* ============[ LOADING ]============ */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center py-16">
          <Loader size="medium" />
          <p className="text-slate-400">Cargando validaciones...</p>
        </div>
      )}
      {profileError && !isLoadingProfiles && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl mb-6">
          {profileError}
        </div>
      )}
      {coursesError && !isLoadingCourses && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-3 rounded-xl mb-6">
          {coursesError}
        </div>
      )}

      {/* ============[ CONTENIDO ]============ */}
      {!isLoading && (
        <>
          {/* ============[ TABLA DE PROFESORES ]============ */}
          {activeTab === "professors" && (
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Profesor
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Profesión
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Fecha de Solicitud
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Estado
                      </th>
                      <th className="px-4 py-4 text-right text-slate-400 text-sm font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700/50">
                    {filteredProfessorProfiles.map((professor) => (
                      <tr
                        key={professor.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center">
                              {professor.user.image ? (
                                <img
                                  src={professor.user.image}
                                  alt={professor.user.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <HiUser className="w-5 h-5 text-font-light" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-font-light">
                                {professor.user.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-300 text-sm">
                            {professor.user.email}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-300">
                            {professor.profession}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-400 text-sm">
                            {formatDate(
                              professor.user.RequestingTeacherRoleDate
                            )}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                              professor.approvalStatus
                            )}`}
                          >
                            {getStatusLabel(professor.approvalStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                onViewDetail(
                                  "validations",
                                  professor.id,
                                  "professor"
                                )
                              }
                              className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                              title="Ver detalles"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!profileError && filteredProfessorProfiles.length === 0 && (
                <div className="text-center py-16 ">
                  <HiAcademicCap className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">
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
          )}

          {/* ============[ TABLA DE CURSOS ]============ */}
          {activeTab === "courses" && (
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50 border-b border-slate-700/50">
                    <tr>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Curso
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Profesor
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Categoría
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Fecha de Solicitud
                      </th>
                      <th className="px-4 py-4 text-left text-slate-400 text-sm font-semibold">
                        Estado
                      </th>
                      <th className="px-4 py-4 text-right text-slate-400 text-sm font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {courseValidations.map((course) => (
                      <tr
                        key={course.id}
                        className="transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-8 border-button/80 bg-button/20 border rounded-lg flex items-center justify-center">
                              <HiBookOpen className="w-5 h-5 text-accent-light" />
                            </div>
                            <div>
                              <p className="font-medium text-font-light max-w-[300px] truncate">
                                {course.title}
                              </p>
                              <p className="text-xs text-slate-400">
                                {course.difficulty}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-300">
                            {course.professorName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {course.professorEmail}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-400/10 text-purple-300 border border-purple-500/20">
                            {course.category}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-slate-400 text-sm">
                            {formatDate(course.createdAt)}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                              course.status
                            )}`}
                          >
                            {getStatusLabel(course.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() =>
                                onViewDetail("validations", course.id, "course")
                              }
                              className="p-2 cursor-pointer bg-slate-700/50 hover:bg-slate-700 border border-button/50 text-accent-medium rounded-lg transition-all"
                              title="Ver detalles"
                            >
                              <HiEye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!profileError && courseValidations.length === 0 && (
                <div className="text-center py-16">
                  <HiBookOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg font-medium mb-2">
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
          )}
        </>
      )}
    </div>
  );
};

export default ValidationsPage;

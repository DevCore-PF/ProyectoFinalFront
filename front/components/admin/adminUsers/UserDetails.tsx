"use client";
import { User } from "@/types/user.types";
import {
  HiArrowLeft,
  HiMail,
  HiCalendar,
  HiUserCircle,
  HiCheckCircle,
  HiXCircle,
  HiBan,
  HiBookOpen,
  HiClock,
  HiStar,
  HiKey,
  HiRefresh,
} from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";

import { FaCheck } from "react-icons/fa6";

import { FaGoogle, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";
import {
  getCourseFeedbackService,
  getProfessorByIdService,
  getUserByIdService,
} from "@/services/admin.service";
import { useAdmin } from "@/context/AdminContext";
import { CourseReview, UserEnrollments } from "@/types/admin.types";
import {
  toastConfirm,
  toastError,
  toastSuccess,
} from "@/helpers/alerts.helper";
import { Course } from "@/types/course.types";
import TinyLoader from "@/components/Loaders/TinyLoader";
import BanReasonModal from "./BanReasonModal";

interface UserDetailsProps {
  user: User;
  onBack: () => void;
}

const UserDetails = ({ user, onBack }: UserDetailsProps) => {
  const [myCourses, setMyCourses] = useState<UserEnrollments[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(user);
  const { token } = useAuth();
  const { deactivateUser, activateUser, fetchCourseById } = useAdmin();
  const [banUnbanUserLoading, setBanUnbanUserLoading] = useState(false);
  const [professorCourses, setProfessorCourses] = useState<
    Course[] | undefined
  >(undefined);
  const [activeTab, setActiveTab] = useState<"enrolled" | "created">(
    "enrolled"
  );
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [feedback, setFeedback] = useState<CourseReview[]>([]);
  const { user: contextUser } = useAuth();

  // ============[ STYLES ]============
  const getRoleBadge = (role: string) => {
    const config = {
      student: {
        bg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
        label: "Alumno",
      },
      teacher: {
        bg: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        label: "Profesor",
      },
      admin: {
        bg: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        label: "Admin",
      },
    };
    return config[role as keyof typeof config] || config.student;
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <HiStar
            key={index}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
              index < rating ? "text-yellow-400" : "text-slate-600"
            }`}
            fill="currentColor"
          />
        ))}
        <span className="ml-2 text-xs sm:text-sm text-slate-300 font-medium">
          {rating}/5
        </span>
      </div>
    );
  };

  useEffect(() => {
    const fetchCourses = async (userId: string) => {
      try {
        if (token) {
          const data = await getUserByIdService(userId);
          setCurrentUser(data);
          const enrollments = await data.enrollments;

          if (data.professorProfile && token) {
            const id = data.professorProfile.id;
            const professorProfile = await getProfessorByIdService(token, id);
            setProfessorCourses(professorProfile.courses);
            const feedbackData = professorProfile.courses.map(
              (course: Course) => getCourseFeedbackService(token, course.id)
            );
            const feedbacks = await Promise.all(feedbackData);
            const allFeedbacks = professorProfile.courses.flatMap(
              (course: Course, index: number) =>
                feedbacks[index].map((f: CourseReview) => ({
                  ...f,
                  courseId: course.id,
                }))
            );
            setFeedback(allFeedbacks);
          }
          setMyCourses(enrollments);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchCourses(user.id);
  }, [user.id, token]);

  const getTotal = () => {
    return myCourses.reduce((total, course) => {
      return total + Number(course.priceAtPurchase || 0);
    }, 0);
  };

  const roleBadge = getRoleBadge(currentUser.role);

  const handleBanUnban = async () => {
    if (currentUser.isActive) {
      setShowBanModal(true);
      return;
    }
    toastConfirm(
      "Reactivar usuario",
      async () => {
        setBanUnbanUserLoading(true);
        try {
          await activateUser(currentUser.id);
          toastSuccess("Usuario activado");

          if (token) {
            const updatedUser = await getUserByIdService(currentUser.id);
            setCurrentUser(updatedUser);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setBanUnbanUserLoading(false);
        }
      },
      () => {}
    );
  };

  const confirmBan = () => {
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
          toastSuccess("Usuario baneado");
          setBanReason("");

          if (token) {
            const updatedUser = await getUserByIdService(currentUser.id);
            setCurrentUser(updatedUser);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setBanUnbanUserLoading(false);
        }
      },
      () => {
        setBanReason("");
      }
    );
  };

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
            Volver a usuarios
          </button>

          {/* ============[ BANNED BANNER ]============ */}
          {!currentUser.isActive && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg shrink-0">
                  <HiBan className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-amber-200 font-semibold text-base sm:text-lg">
                    Usuario Baneado
                  </p>
                  <p className="text-amber-300/80 text-xs sm:text-sm">
                    Este usuario no puede acceder a la plataforma. Puedes
                    activarlo usando el botón a continuación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============[ MAIN HEADER ]============ */}
          <div className="mt-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-button/60 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-font-light text-2xl sm:text-3xl font-bold border border-slate-600 shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-font-light mb-1 break-words">
                    {currentUser.name}
                  </h1>
                  <p className="text-slate-400 flex items-center gap-2 text-sm sm:text-base break-all">
                    <HiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    {currentUser.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${roleBadge.bg}`}
                    >
                      {roleBadge.label}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${
                        currentUser.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {currentUser.isActive ? "Activo" : "Baneado"}
                    </span>
                  </div>
                </div>
              </div>

              {user.id !== contextUser?.id && (
                <button
                  onClick={() => handleBanUnban()}
                  title={
                    currentUser.isActive
                      ? "Banear usuario"
                      : "Activar usuario"
                  }
                  disabled={banUnbanUserLoading}
                  className={`disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer gap-2 bg-slate-700/50 hover:bg-slate-700/90 border px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm w-full lg:w-auto ${
                    currentUser.isActive
                      ? "border-amber-300/50 text-amber-300"
                      : "border-emerald-400/50 text-emerald-200"
                  }`}
                >
                  {currentUser.isActive && banUnbanUserLoading ? (
                    <div className="flex gap-2 items-center">
                      <TinyLoader />
                      <span className="hidden sm:inline">Baneando</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : currentUser.isActive && !banUnbanUserLoading ? (
                    <>
                      <HiBan className="w-4 h-4 sm:w-5 sm:h-5" />
                      Banear
                    </>
                  ) : !currentUser.isActive && banUnbanUserLoading ? (
                    <div className="flex gap-2 items-center">
                      <TinyLoader />
                      <span className="hidden sm:inline">Activando</span>
                      <span className="sm:hidden">...</span>
                    </div>
                  ) : (
                    <>
                      <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Activar
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ============[ CONTENT GRID ]============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ============[ LEFT COLUMN ]============ */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Información de cuenta */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiUserCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Información de Cuenta
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">ID de Usuario</p>
                  <p className="text-font-light font-mono text-xs sm:text-sm bg-slate-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded break-all">
                    {currentUser.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Email</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <p className="text-font-light text-sm sm:text-base break-all">
                      {currentUser.email}
                    </p>
                    {currentUser.isEmailVerified ? (
                      <span className="text-emerald-300 text-xs flex items-center gap-1 w-fit">
                        <FaCheck className="w-3 h-3" />
                        Verificado
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center gap-1 w-fit">
                        <RxCross2 className="w-4 h-4" />
                        No verificado
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Tipo de cuenta</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.isGoogleAccount && (
                      <span className="px-2 sm:px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <FaGoogle className="w-3 h-3" />
                        Google
                      </span>
                    )}
                    {currentUser.isGitHubAccount && (
                      <span className="px-2 sm:px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <FaGithub className="w-3 h-3" />
                        GitHub
                      </span>
                    )}
                    {!currentUser.isGoogleAccount &&
                      !currentUser.isGitHubAccount && (
                        <span className="px-2 sm:px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                          <HiMail className="w-3 h-3" />
                          Email
                        </span>
                      )}
                  </div>
                </div>

                {currentUser.googleId && (
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">Google ID</p>
                    <p className="text-slate-300 font-mono text-xs bg-slate-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded truncate">
                      {currentUser.googleId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Estado de Perfil */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Estado de Perfil
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Perfil completado</span>
                  {currentUser.hasCompletedProfile ? (
                    <HiCheckCircle size={20} className="sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <HiXCircle size={20} className="sm:w-6 sm:h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Email verificado</span>
                  {currentUser.isEmailVerified ? (
                    <HiCheckCircle size={20} className="sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <HiXCircle size={20} className="sm:w-6 sm:h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Términos aceptados</span>
                  {currentUser.checkBoxTerms ? (
                    <HiCheckCircle size={20} className="sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <HiXCircle size={20} className="sm:w-6 sm:h-6 text-slate-400" />
                  )}
                </div>

                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Cuenta activa</span>
                  {currentUser.isActive ? (
                    <HiCheckCircle size={20} className="sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <HiXCircle size={20} className="sm:w-6 sm:h-6 text-slate-400" />
                  )}
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
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Registro</p>
                  <p className="text-font-light text-xs sm:text-sm flex items-center gap-2">
                    <HiClock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    {formatDate(currentUser.createdAt)}
                  </p>
                </div>

                {currentUser.updatedAt && (
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-1">
                      Última actualización
                    </p>
                    <p className="text-font-light text-xs sm:text-sm flex items-center gap-2">
                      <HiRefresh className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                      {formatDate(currentUser.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tokens y seguridad */}
            {(currentUser.resetPasswordToken ||
              currentUser.emailVerificationToken ||
              currentUser.resetPasswordExpires) && (
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                  <HiKey className="w-5 h-5 sm:w-6 sm:h-6" />
                  Seguridad
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  {currentUser.resetPasswordToken && (
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">
                        Token de recuperación
                      </p>
                      <p className="text-font-light font-mono text-xs bg-slate-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded truncate">
                        {currentUser.resetPasswordToken}
                      </p>
                    </div>
                  )}

                  {currentUser.resetPasswordExpires && (
                    <div>
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">
                        Expira el token
                      </p>
                      <p className="text-font-light text-xs sm:text-sm">
                        {formatDate(
                          currentUser.resetPasswordExpires.toString()
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ============[ RIGHT COLUMN ]============ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                    <HiBookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-accent-light" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Cursos inscritos</p>
                    <p className="text-xl sm:text-2xl font-bold text-font-light">
                      {myCourses.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg">
                    <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Completados</p>
                    <p className="text-xl sm:text-2xl font-bold text-font-light">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 sm:p-3 bg-yellow-500/10 rounded-lg">
                    <HiStar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm">Rating promedio</p>
                    <p className="text-xl sm:text-2xl font-bold text-font-light">N/A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============[ COURSES ]============ */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiBookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                Cursos
              </h2>

              {/* Tabs */}
              {currentUser.role === "teacher" && (
                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-slate-700/50 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                  <button
                    onClick={() => setActiveTab("enrolled")}
                    className={`pb-2 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                      activeTab === "enrolled"
                        ? "text-button/80 border-b-2 border-button"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <span className="hidden sm:inline">Cursos Inscritos</span>
                    <span className="sm:hidden">Inscritos</span> ({myCourses.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("created")}
                    className={`pb-2 sm:pb-3 px-3 sm:px-4 font-medium transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base ${
                      activeTab === "created"
                        ? "text-button/80 border-b-2 border-button"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <span className="hidden sm:inline">Cursos Creados</span>
                    <span className="sm:hidden">Creados</span> ({professorCourses?.length || 0})
                  </button>
                </div>
              )}

              {/* Cursos Inscritos */}
              {activeTab === "enrolled" && (
                <>
                  {myCourses.length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {myCourses.map((course) => (
                        <div
                          key={course.id}
                          className="p-3 sm:p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-font-light font-semibold mb-1 text-sm sm:text-base break-words">
                                {course.course.title}
                              </h3>
                              <span className="text-slate-300 text-xs sm:text-sm flex gap-2">
                                <p className="text-font-light">Duración:</p>
                                <span>{course.course.duration}</span>
                              </span>

                              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                  <HiCalendar className="w-3 h-3" />
                                  {course.completed ? (
                                    <p>Terminado</p>
                                  ) : (
                                    <p>Incompleto</p>
                                  )}
                                </span>
                                {course.priceAtPurchase && (
                                  <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                                    ${course.priceAtPurchase}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <HiBookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400 text-sm sm:text-base">
                        Este usuario no está inscrito en ningún curso
                      </p>
                    </div>
                  )}

                  {myCourses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/50 rounded-lg">
                        <span className="text-font-light font-semibold text-base sm:text-lg">
                          Total Gastado
                        </span>
                        <span className="text-emerald-400 text-lg sm:text-xl font-bold flex items-center gap-2">
                          $ {getTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Cursos Creados */}
              {activeTab === "created" &&
                (currentUser.role === "teacher" ||
                  currentUser.role === "admin") && (
                  <>
                    {professorCourses && professorCourses.length > 0 ? (
                      <div className="space-y-2 sm:space-y-3">
                        {professorCourses.map((course) => (
                          <div
                            key={course.id}
                            className="p-3 sm:p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-font-light font-semibold mb-1 text-sm sm:text-base break-words">
                                  {course.title}
                                </h3>
                                <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-2">
                                  {course.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                                  <span className="px-2 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded text-xs">
                                    {course.category}
                                  </span>
                                  <span className="text-slate-400 text-xs">
                                    {course.lessons?.length || 0} lecciones
                                  </span>
                                  <span className="text-emerald-400 text-xs font-medium">
                                    ${course.price}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded text-xs ${
                                      course.isActive
                                        ? "bg-emerald-500/10 text-emerald-300"
                                        : "bg-amber-500/10 text-amber-300"
                                    }`}
                                  >
                                    {course.isActive ? "Activo" : "Inactivo"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 sm:mt-4">
                              <h4 className="text-xs sm:text-sm font-medium text-slate-300">
                                {feedback.filter(
                                  (f) => f.courseId === course.id
                                ).length > 0
                                  ? "Reseñas"
                                  : "Este curso no tiene reseñas"}
                              </h4>
                              {feedback
                                .filter((f) => f.courseId === course.id)
                                .map((f) => (
                                  <div
                                    key={f.id}
                                    className="mt-2 p-2 bg-slate-700/30 rounded"
                                  >
                                    <p className="text-xs sm:text-sm">{f.feedback}</p>
                                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                                      Rating: {renderStars(f.rating)}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                      Usuario: {f.user.name}
                                    </p>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12">
                        <HiBookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm sm:text-base">
                          Este profesor no ha creado ningún curso todavía
                        </p>
                      </div>
                    )}
                  </>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* ============[ BAN MODAL ]============ */}
      {showBanModal && (
        <BanReasonModal
          banReason={banReason}
          setBanReason={setBanReason}
          onCancel={() => {
            setShowBanModal(false);
            setBanReason("");
          }}
          onConfirm={confirmBan}
        />
      )}
    </div>
  );
};

export default UserDetails;

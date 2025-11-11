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
  HiGlobe,
  HiRefresh,
} from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getCurrentUserService } from "@/services/user.service";
import { useAuth } from "@/context/UserContext";
import { Course } from "@/types/course.types";
import { getUserByIdService } from "@/services/admin.services";
import { useAdmin } from "@/context/AdminContext";
import { UserEnrollments } from "@/types/admin.types";
import { toastError, toastSuccess } from "@/helpers/alerts.helper";

interface UserDetailsProps {
  user: User;
  onBack: () => void;
}

const UserDetails = ({ user, onBack }: UserDetailsProps) => {
  /////////////////////////////////ESTILOS
  const [myCourses, setMyCourses] = useState<UserEnrollments[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { token } = useAuth();
  const { deactivateUser } = useAdmin();
  /////////////////ESTILOS
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
  useEffect(() => {
    const fetchCourses = async (userId: string) => {
      try {
        if (token) {
          const data = await getUserByIdService(userId);
          setCurrentUser(data);
          const enrollments = await data.enrollments; ////
          setMyCourses(enrollments);
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchCourses(user.id);
  }, []);

  const handleBanUser = async (userId: string) => {
    try {
      await deactivateUser(userId);
      toastSuccess("Usuario baneado");
    } catch (error) {
      console.log(error);
      console.log(error);
      throw error;
    }
  };

  const getTotal = () => {
    return myCourses.reduce((total, course) => {
      return total + Number(course.priceAtPurchase || 0);
    }, 0);
  };
  const roleBadge = getRoleBadge(user.role);
  console.log(`cursos de ${user.name}`, myCourses);
  console.log("este es mi user actual", currentUser);

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
            Volver a usuarios
          </button>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-button/60"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-font-light text-3xl font-bold border border-slate-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-font-light mb-1">
                    {user.name}
                  </h1>
                  <p className="text-slate-400 flex items-center gap-2">
                    <HiMail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 ${roleBadge.bg}`}
                    >
                      {roleBadge.label}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        user.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }`}
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleBanUser(user.id)}
                  title="Banear usuario"
                  className="flex items-center cursor-pointer gap-2 bg-slate-700/50 hover:bg-slate-700/90 border border-amber-300/50 text-amber-300 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  <HiBan className="w-5 h-5" />
                  {user.isActive ? "Banear" : "Activar"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info personal y cuenta */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de cuenta */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiUserCircle className="w-6 h-6" />
                Información de Cuenta
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">ID de Usuario</p>
                  <p className="text-font-light font-mono text-sm bg-slate-800/50 px-3 py-2 rounded">
                    {user.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="text-font-light">{user.email}</p>
                    {user.isEmailVerified ? (
                      <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <HiCheckCircle className="w-4 h-4" />
                        Verificado
                      </span>
                    ) : (
                      <span className="text-amber-400 text-xs flex items-center gap-1">
                        <HiXCircle className="w-4 h-4" />
                        No verificado
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Tipo de cuenta</p>
                  <div className="flex gap-2">
                    {user.isGoogleAccount && (
                      <span className="px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <FaGoogle className="w-3 h-3" />
                        Google
                      </span>
                    )}
                    {user.isGitAcocount && (
                      <span className="px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <FaGithub className="w-3 h-3" />
                        GitHub
                      </span>
                    )}
                    {!user.isGoogleAccount && !user.isGitAcocount && (
                      <span className="px-3 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-lg text-xs font-medium flex items-center gap-1.5">
                        <HiMail className="w-3 h-3" />
                        Email
                      </span>
                    )}
                  </div>
                </div>

                {user.googleId && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Google ID</p>
                    <p className="text-slate-300 font-mono text-xs bg-slate-800/50 px-3 py-2 rounded truncate">
                      {user.googleId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Estado de perfil */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiCheckCircle className="w-6 h-6" />
                Estado de Perfil
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Perfil completado</span>
                  {user.hasCompletedProfile ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Email verificado</span>
                  {user.isEmailVerified ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Términos aceptados</span>
                  {user.checkBoxTerms ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-slate-500" />
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Cuenta activa</span>
                  {user.isActive ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-slate-500" />
                  )}
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
                  <p className="text-slate-400 text-sm mb-1">Registro</p>
                  <p className="text-font-light text-sm flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-slate-400" />
                    {formatDate(user.createdAt)}
                  </p>
                </div>

                {user.updatedAt && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">
                      Última actualización
                    </p>
                    <p className="text-font-light text-sm flex items-center gap-2">
                      <HiRefresh className="w-4 h-4 text-slate-400" />
                      {formatDate(user.updatedAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Tokens y seguridad */}
            {(user.resetPasswordToken ||
              user.emailVerificationToken ||
              user.resetPasswordExpires) && (
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                  <HiKey className="w-6 h-6" />
                  Seguridad
                </h2>
                <div className="space-y-3">
                  {user.resetPasswordToken && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        Token de recuperación
                      </p>
                      <p className="text-font-light font-mono text-xs bg-slate-800/50 px-3 py-2 rounded truncate">
                        {user.resetPasswordToken}
                      </p>
                    </div>
                  )}

                  {user.resetPasswordExpires && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        Expira el token
                      </p>
                      <p className="text-font-light text-sm">
                        {formatDate(user.resetPasswordExpires.toString())}
                      </p>
                    </div>
                  )}

                  {user.emailVerificationToken && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">
                        Token de verificación
                      </p>
                      <p className="text-font-light font-mono text-xs bg-slate-800/50 px-3 py-2 rounded truncate">
                        {user.emailVerificationToken}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha - Cursos y actividad */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <HiBookOpen className="w-6 h-6 text-accent-light" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Cursos inscritos</p>
                    <p className="text-2xl font-bold text-font-light">
                      {user.enrollments?.courseList?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <HiCheckCircle className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Completados</p>
                    <p className="text-2xl font-bold text-font-light">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <HiStar className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Rating promedio</p>
                    <p className="text-2xl font-bold text-font-light">N/A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de cursos */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiBookOpen className="w-6 h-6" />
                Cursos Inscritos
                <span className="text-sm font-normal text-slate-400">
                  ({myCourses.length || 0})
                </span>
              </h2>

              {myCourses.length > 0 ? (
                <div className="space-y-3">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-font-light font-semibold mb-1">
                            {course.id}
                          </h3>
                          <span className="text-slate-400 text-sm flex gap-2">
                            <p className="text-font-light">
                              Fecha de inscripción:
                            </p>
                            <span>{formatDate(course.inscripcionDate)}</span>
                          </span>
                          <span className="text-slate-400 text-sm flex gap-2">
                            <p className="text-font-light">
                              Fecha de finalización:
                            </p>
                            <span>
                              {course.completedAt
                                ? formatDate(course.completedAt)
                                : `No hay fecha de finalización`}
                            </span>
                          </span>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <HiCalendar className="w-3 h-3" />
                              {course.completed ? (
                                <p>terminado</p>
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
                <div className="text-center py-12">
                  <HiBookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    Este usuario no está inscrito en ningún curso
                  </p>
                </div>
              )}
              {myCourses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <span className="text-font-light font-semibold text-lg">
                      Total Gastado
                    </span>
                    <span className="text-emerald-400 text-xl font-bold flex items-center gap-2">
                      $ {getTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

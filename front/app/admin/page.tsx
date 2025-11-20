"use client";
import { useAdmin } from "@/context/AdminContext";
import { TabType, ValidationRequest } from "@/types/admin.types";
import { User } from "@/types/user.types";
import Loader from "@/components/Loaders/Loader";
import { useState } from "react";
import {
  HiUsers,
  HiBookOpen,
  HiChartBar,
  HiShieldCheck,
  HiUserGroup,
  HiCurrencyDollar,
  HiXCircle,
  HiMail,
  HiUserCircle,
} from "react-icons/hi";
import CourseDetails from "@/components/admin/adminCourses/CourseDetails";
import { useAuth } from "@/context/UserContext";
import ValidationsPage from "@/components/admin/ValidtionsPage";

import CourseValidationDetails from "@/components/admin/adminCourses/CourseValidationDetails";
import FinancesPage from "@/components/admin/adminFinances/FinancesPage";
import AdminForm from "@/components/admin/AdminForm";
import CoursesPage from "@/components/admin/adminCourses/CoursesPage";
import UsersPage from "@/components/admin/adminUsers/UsersPage";
import UserDetails from "@/components/admin/adminUsers/UserDetails";
import ProfileValidationDetails from "@/components/admin/ProfileValidationDetails";
import NewsletterManagement from "@/components/admin/NewsletterManagement";

type ValidationType = "professor" | "course_create" | "course_edit" | "profile_edit" | "role_change";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("validations");
  const [selectedValidation, setSelectedValidation] = useState<ValidationRequest | null>(null);
  const [showBar, setShowBar] = useState(true);

  const { user } = useAuth();
  const [detailView, setDetailView] = useState<{
    tab: TabType | null;
    id: string | null;
    validationType?: "professor" | "course";
  }>({ tab: null, id: null, validationType: undefined });

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const { fetchUserById } = useAdmin();

  const openDetail = async (tab: TabType, id: string, validationType?: "professor" | "course") => {
    if (tab === "users") {
      setIsLoadingDetail(true);
      setDetailView({ tab, id });
      setShowBar(false);
      try {
        const userData = await fetchUserById(id);
        setDetailUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        setDetailUser(null);
      } finally {
        setIsLoadingDetail(false);
      }
    } else {
      setDetailView({ tab, id, validationType });
      setShowBar(false);
    }
  };

  const closeDetail = () => {
    setDetailView({ tab: null, id: null });
    setDetailUser(null);
    setIsLoadingDetail(false);
    setShowBar(true);
  };

  const isShowingDetail = detailView.tab !== null;

  const getValidationTypeLabel = (type: ValidationType) => {
    const labels = {
      professor: "Perfil Profesional",
      course_create: "Creación de Curso",
      course_edit: "Edición de Curso",
      profile_edit: "Edición de Perfil",
      role_change: "Cambio de Rol",
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============[ HEADER   ]============= */}
        {showBar && (
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-font-light mb-1 sm:mb-2">
                  Panel de Gestión
                </h1>
                <p className="text-slate-400 text-sm sm:text-base mb-2 sm:mb-0">
                  Gestiona todos los aspectos de tu plataforma
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-slate-400 mt-2 text-xs sm:text-sm font-light">
                  <p className="truncate">{user?.email}</p>
                  <span className="inline-flex items-center w-fit text-amber-200 border border-amber-300 bg-amber-700/40 px-2 py-0.5 rounded-lg text-xs">
                    {user?.role && `Administrador`}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex p-3 lg:p-4 bg-slate-700/30 rounded-xl shrink-0">
                <HiShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-slate-300" />
              </div>
            </div>
          </div>
        )}

        {showBar && (
          <>
            {/* ============[ NAVEGACIÓN DE TABS   ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-1.5 sm:p-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <div className="flex gap-1 sm:gap-2 min-w-max sm:min-w-0 sm:justify-around">
                <button
                  onClick={() => setActiveTab("validations")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "validations"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  <span className="hidden sm:inline">Solicitudes</span>
                  <span className="sm:hidden">Solicitudes</span>
                </button>

                <button
                  onClick={() => setActiveTab("courses")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "courses"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiBookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  Cursos
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "users"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  Users
                </button>

                <button
                  onClick={() => setActiveTab("finances")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "finances"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiCurrencyDollar className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  Finanzas
                </button>

                <button
                  onClick={() => setActiveTab("newsletter")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "newsletter"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiMail className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  Newsletter
                </button>

                <button
                  onClick={() => setActiveTab("admins")}
                  className={`cursor-pointer flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === "admins"
                      ? "bg-button/50 text-font-light"
                      : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
                  }`}
                >
                  <HiUserGroup className="w-4 h-4 sm:w-5 sm:h-5 text-accent-light shrink-0" />
                  Admins
                </button>
              </div>
            </div>
          </>
        )}

        {/* ============[ CONTENIDO DE LOS TABS ]============= */}
        <div className="relative overflow-hidden min-h-[400px] sm:min-h-[600px]">
          {/* ============[ VISTA PRINCIPAL DE TABS ]============= */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isShowingDetail
                ? "-translate-x-full opacity-0 pointer-events-none absolute w-full"
                : "translate-x-0 opacity-100"
            }`}
          >
            {activeTab === "admins" && <AdminForm />}
            {activeTab === "validations" && <ValidationsPage onViewDetail={openDetail} />}
            {activeTab === "courses" && <CoursesPage onViewDetail={openDetail} />}
            {activeTab === "users" && <UsersPage onViewDetail={openDetail} />}
            {activeTab === "finances" && <FinancesPage />}
            {activeTab === "newsletter" && <NewsletterManagement />}
          </div>

          {/* ============[ VISTA DE DETALLES ]============= */}
          <div
            className={`${
              isShowingDetail ? "relative" : "absolute"
            } top-0 left-0 w-full transition-all duration-300 ease-in-out ${
              isShowingDetail ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            {detailView.tab === "users" && (
              <>
                {isLoadingDetail && (
                  <div className="fixed min-h-screen inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="text-center">
                      <Loader size="medium" />
                      <p className="text-slate-400 mt-4 text-sm sm:text-base">
                        Cargando información del usuario...
                      </p>
                    </div>
                  </div>
                )}

                {detailUser ? (
                  <UserDetails user={detailUser} onBack={closeDetail} />
                ) : !isLoadingDetail ? (
                  <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <div className="text-center">
                      <HiUserCircle className="w-16 h-16 sm:w-24 sm:h-24 text-slate-600 mx-auto mb-4" />
                      <h2 className="text-xl sm:text-2xl font-bold text-font-light mb-2">
                        Usuario no encontrado
                      </h2>
                      <p className="text-slate-400 mb-6 text-sm sm:text-base">
                        No se pudo cargar la información del usuario
                      </p>
                      <button
                        onClick={closeDetail}
                        className="bg-button/80 cursor-pointer hover:bg-button text-font-light px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all text-sm sm:text-base"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {detailView.tab === "courses" && detailView.id && (
              <CourseDetails courseId={detailView.id} onBack={closeDetail} />
            )}

            {detailView.tab === "validations" && detailView.id && (
              <>
                {detailView.validationType === "professor" && (
                  <ProfileValidationDetails profileId={detailView.id} onBack={closeDetail} />
                )}
                {detailView.validationType === "course" && (
                  <CourseValidationDetails courseId={detailView.id} onBack={closeDetail} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============[ MODAL   ]============= */}
      {selectedValidation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-font-light">Detalle de Solicitud</h2>
              <button
                onClick={() => setSelectedValidation(null)}
                className="cursor-pointer text-slate-400 hover:text-font-light transition-colors shrink-0"
              >
                <HiXCircle className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                <h3 className="text-font-light font-semibold mb-2 text-sm sm:text-base">
                  Información del Usuario
                </h3>
                <p className="text-slate-300 text-sm sm:text-base break-words">
                  <span className="text-slate-400">Nombre:</span> {selectedValidation.userName}
                </p>
                <p className="text-slate-300 text-sm sm:text-base break-all">
                  <span className="text-slate-400">Email:</span> {selectedValidation.userEmail}
                </p>
                <p className="text-slate-300 text-sm sm:text-base">
                  <span className="text-slate-400">Tipo:</span>{" "}
                  {getValidationTypeLabel(selectedValidation.type)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                <h3 className="text-font-light font-semibold mb-2 text-sm sm:text-base">Datos Enviados</h3>
                <pre className="text-slate-300 text-xs sm:text-sm overflow-x-auto">
                  {JSON.stringify(selectedValidation.data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

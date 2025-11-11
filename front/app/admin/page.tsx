"use client";
import CoursesPage from "@/components/admin/CoursesPage";
import OverviewTab from "@/components/admin/OverviewTab";
import UserDetails from "@/components/admin/UserDetails";
import { useAdmin } from "@/context/AdminContext";
import { TabType, ValidationRequest } from "@/types/admin.types";
import { User } from "@/types/user.types";
import Loader from "@/components/Loaders/Loader";
import { useState } from "react";
import UsersPage from "@/components/admin/UsersPage";
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
import CourseDetails from "@/components/admin/CourseDetails";

type ValidationType =
  | "professor"
  | "course_create"
  | "course_edit"
  | "profile_edit"
  | "role_change";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedValidation, setSelectedValidation] =
    useState<ValidationRequest | null>(null);

  const [detailView, setDetailView] = useState<{
    tab: TabType | null;
    id: string | null;
  }>({ tab: null, id: null });

  // ============[ ESTADOS DE LOADING Y USER ]=============
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const { fetchUserById } = useAdmin();

  // ============[ FUNCIÓN PARA ABRIR DETALLES CON FETCH ]=============
  const openDetail = async (tab: TabType, id: string) => {
    if (tab === "users") {
      setIsLoadingDetail(true);
      setDetailView({ tab, id });

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
      setDetailView({ tab, id });
    }
  };

  // ============[ FUNCIÓN PARA CERRAR DETALLES Y LIMPIAR ]=============
  const closeDetail = () => {
    setDetailView({ tab: null, id: null });
    setDetailUser(null);
    setIsLoadingDetail(false);
  };

  const isShowingDetail = detailView.tab !== null;

  // ============[ TYPE DE VALIDATION ]=============
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

  // ============[ STYLES DE STATUS ]=============
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      inactive: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      banned: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      pending: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active
    );
  };

  const handleApproveValidation = (id: string) => {
    console.log("Aprobar solicitud:", id);
  };

  const handleRejectValidation = (id: string) => {
    console.log("Rechazar solicitud:", id);
  };

  const handleSendAdminInvite = () => {
    console.log("Enviar invitación de admin");
  };

  // ============[ COMPONENTE DE ADMINS ]=============
  const AdminsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-font-light">
          Gestión de Administradores
        </h2>
        <button
          onClick={handleSendAdminInvite}
          className="cursor-pointer bg-button hover:bg-button/80 text-font-light px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <HiMail className="w-5 h-5" />
          Enviar Invitación
        </button>
      </div>

      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-font-light mb-4">
          Enviar Invitación de Admin
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-2 block">
              Email del nuevo admin
            </label>
            <input
              type="email"
              placeholder="admin@devcore.com"
              className="w-full bg-background2 border border-slate-700 rounded-lg px-4 py-3 text-font-light focus:outline-none focus:ring-2 focus:ring-button"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm mb-2 block">
              Mensaje personalizado (opcional)
            </label>
            <textarea
              placeholder="Escribe un mensaje de bienvenida..."
              rows={4}
              className="w-full bg-background2 border border-slate-700 rounded-lg px-4 py-3 text-font-light focus:outline-none focus:ring-2 focus:ring-button resize-none"
            />
          </div>
          <button className="cursor-pointer w-full bg-button/80 hover:bg-button text-font-light py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
            <HiMail className="w-5 h-5" />
            Enviar Invitación
          </button>
          <p className="text-slate-400 text-sm text-center">
            Se enviará un link de registro profesional al email especificado
          </p>
        </div>
      </div>

      <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-font-light mb-4">
          Administradores Actuales
        </h3>
        <div className="space-y-3">
          {[
            {
              id: "1",
              name: "Admin Principal",
              email: "admin@devcore.com",
              role: "Super Admin",
              since: "2024-01-01",
            },
            {
              id: "2",
              name: "María Admin",
              email: "maria.admin@devcore.com",
              role: "Admin",
              since: "2024-06-15",
            },
          ].map((admin) => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-font-light font-bold border border-slate-600">
                  {admin.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-font-light font-semibold">
                    {admin.name}
                  </h4>
                  <p className="text-slate-400 text-sm">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-xs font-medium">
                    {admin.role}
                  </span>
                  <p className="text-slate-500 text-xs mt-1">
                    Desde {new Date(admin.since).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============[ HEADER ]============= */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-font-light mb-2">
                Panel de Administración
              </h1>
              <p className="text-slate-400">
                Gestiona todos los aspectos de tu plataforma
              </p>
            </div>
            <div className="p-4 bg-slate-700/30 rounded-xl">
              <HiShieldCheck className="w-10 h-10 text-slate-300" />
            </div>
          </div>
        </div>
        {/* ============[ NAVEGACIÓN DE TABS ]============= */}
        <div className="bg-background2/40 border  border-slate-700/50 rounded-xl p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max justify-around">
            <button
              onClick={() => setActiveTab("overview")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "overview"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiChartBar className="w-5 h-5" />
              Vista General
            </button>

            <button
              onClick={() => setActiveTab("validations")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all relative ${
                activeTab === "validations"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiShieldCheck className="w-5 h-5 text-accent-light" />
              Validaciones
              {10 > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-300/80 text-slate-600 text-xs font-bold rounded-full w-5.5 h-5.5 flex items-center  justify-center">
                  12
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("courses")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "courses"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiBookOpen className="w-5 h-5 text-accent-light" />
              Cursos
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "users"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiUsers className="w-5 h-5 text-accent-light" />
              Users
            </button>

            <button
              onClick={() => setActiveTab("finances")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "finances"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiCurrencyDollar className="w-5 h-5 text-accent-light" />
              Finanzas
            </button>

            <button
              onClick={() => setActiveTab("admins")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === "admins"
                  ? "bg-button/50 text-font-light"
                  : "text-slate-400 hover:text-font-light hover:bg-slate-800/50"
              }`}
            >
              <HiUserGroup className="w-5 h-5 text-accent-light" />
              Admins
            </button>
          </div>
        </div>

        {/* ============[ CONTENIDO DE LOS TABS ]============= */}
        <div className="relative overflow-hidden min-h-[600px]">
          {/* ============[ VISTA PRINCIPAL DE TABS ]============= */}
          <div
            className={`transition-all duration-300 ease-in-out ${
              isShowingDetail
                ? "-translate-x-full opacity-0 pointer-events-none absolute w-full"
                : "translate-x-0 opacity-100"
            }`}
          >
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "admins" && <AdminsTab />}
            {activeTab === "users" && <UsersPage onViewDetail={openDetail} />}
            {activeTab === "courses" && (
              <CoursesPage onViewDetail={openDetail} />
            )}
          </div>

          {/* ============[ VISTA DE DETALLES de USER CON TRANSICIÓN ]============= */}
          <div
            className={`${
              isShowingDetail ? "relative" : "absolute"
            } top-0 left-0 w-full transition-all duration-300 ease-in-out ${
              isShowingDetail
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 pointer-events-none"
            }`}
          >
            {detailView.tab === "users" && (
              <>
                {/* ============[ LOADING OVERLAY ]============= */}
                {isLoadingDetail && (
                  <div className="fixed min-h-screen inset-0 bg-background/80 backdrop-blur-sm flex  justify-center z-50">
                    <div className="text-center">
                      <Loader size="medium" />
                      <p className="text-slate-400 mt-4">
                        Cargando información del usuario...
                      </p>
                    </div>
                  </div>
                )}

                {/* ============[ USER DETAIL ]============= */}
                {detailUser ? (
                  <UserDetails user={detailUser} onBack={closeDetail} />
                ) : !isLoadingDetail ? (
                  // ============[ ERROR STATE ]=============
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                      <HiUserCircle className="w-24 h-24 text-slate-600 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">
                        Usuario no encontrado
                      </h2>
                      <p className="text-slate-400 mb-6">
                        No se pudo cargar la información del usuario
                      </p>
                      <button
                        onClick={closeDetail}
                        className="bg-button/80 cursor-pointer hover:bg-button text-font-light px-6 py-2 rounded-lg font-semibold transition-all"
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
            {/* ============[ COURSE DETAIL ]============= */}
            {detailView.tab === "courses" && detailView.id && (
              <CourseDetails courseId={detailView.id} onBack={closeDetail} />
            )}
          </div>
        </div>
      </div>

      {/* ============[ MODAL DE DETALLE DE VALIDACIÓN ]============= */}
      {selectedValidation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-font-light">
                Detalle de Solicitud
              </h2>
              <button
                onClick={() => setSelectedValidation(null)}
                className="cursor-pointer text-slate-400 hover:text-font-light transition-colors"
              >
                <HiXCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-font-light font-semibold mb-2">
                  Información del Usuario
                </h3>
                <p className="text-slate-300">
                  <span className="text-slate-400">Nombre:</span>{" "}
                  {selectedValidation.userName}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Email:</span>{" "}
                  {selectedValidation.userEmail}
                </p>
                <p className="text-slate-300">
                  <span className="text-slate-400">Tipo:</span>{" "}
                  {getValidationTypeLabel(selectedValidation.type)}
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="text-font-light font-semibold mb-2">
                  Datos Enviados
                </h3>
                <pre className="text-slate-300 text-sm overflow-x-auto">
                  {JSON.stringify(selectedValidation.data, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleApproveValidation(selectedValidation.id);
                    setSelectedValidation(null);
                  }}
                  className="cursor-pointer flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-3 rounded-lg font-medium transition-all"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => {
                    handleRejectValidation(selectedValidation.id);
                    setSelectedValidation(null);
                  }}
                  className="cursor-pointer flex-1 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 py-3 rounded-lg font-medium transition-all"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

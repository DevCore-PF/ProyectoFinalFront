"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import { toastSuccess, toastError, toastConfirm } from "@/helpers/alerts.helper";
import { RxCross2 } from "react-icons/rx";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiXCircle,
  HiUser,
  HiMail,
  HiPhone,
  HiAcademicCap,
  HiDocumentText,
  HiExternalLink,
  HiCalendar,
  HiShieldCheck,
  HiExclamation,
} from "react-icons/hi";
import Loader from "../Loaders/Loader";
import TinyLoader from "../Loaders/TinyLoader";
import { ProfessorProfileAdmin } from "@/types/admin.types";
import RejectedReasonModal from "./RejectedReasonModal";
import { useAuth } from "@/context/UserContext";
import { approveTeacherService, rejectTeacherService } from "@/services/admin.service";

interface ProfessorValidationDetailsProps {
  profileId: string;
  onBack: () => void;
}

const ProfessorValidationDetails = ({ profileId, onBack }: ProfessorValidationDetailsProps) => {
  const { professorProfiles, approveProfile, refreshProfiles, rejectProfile } = useAdmin();
  const [professor, setProfessor] = useState<ProfessorProfileAdmin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");
  const { token } = useAuth();
  useEffect(() => {
    const foundProfessor = professorProfiles.find((p) => p.id === profileId);
    if (foundProfessor) {
      setProfessor(foundProfessor);
    }
    console.log("este es mi porfesor", foundProfessor);

    setIsLoading(false);
  }, [profileId, professorProfiles]);

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
      pending: "bg-blue-500/10 text-blue-300 border-blue-500/20",
      approved: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      rejected: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const handleApproveStudent = async () => {
    toastConfirm(
      "¿Aprobar solicitud de profesor?",
      async () => {
        setLoadingApprove(true);
        try {
          if (professor?.user.id && token) {
            await approveTeacherService(token, professor.user.id);
            await refreshProfiles();
            toastSuccess("Solicitud aprobada correctamente");
          }
        } catch (error) {
          console.error(error);
          toastError("Error al aprobar la solicitud");
        } finally {
          setLoadingApprove(false);
        }
      },
      () => {}
    );
  };
  const handleRejectStudent = async () => {
    if (professor?.approvalStatus === "pending") {
      setIsModalOpen(true);
    }
  };
  const handleRejectStudentConfirm = async () => {
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
      "¿Rechazar solicitud de profesor?",
      async () => {
        setLoadingReject(true);
        console.log("Request a backend:", {
          url: `${API_URL}/profiles/reject-teacher/${professor?.user.id}`,
          method: "PATCH",
          body: JSON.stringify({ reason: rejectedReason }),
        });
        try {
          if (!professor?.user.id || typeof professor.user.id !== "string") {
            toastError("ID de usuario inválido para rechazo");
            setLoadingReject(false);
            setRejectedReason("");
            return;
          }
          if (professor?.user.id && token) {
            await rejectTeacherService(token, professor.user.id, rejectedReason);
            await refreshProfiles();
            toastSuccess("Solicitud rechazada");
          }
        } catch (error) {
          console.error(error);
          toastError("Error al rechazar la solicitud");
        } finally {
          setLoadingReject(false);
          setRejectedReason("");
        }
      },
      () => {}
    );
  };
  const handleApprove = async (profileId: string) => {
    toastConfirm(
      "¿Aprobar solicitud de profesor?",
      async () => {
        setLoadingApprove(true);
        try {
          await approveProfile(profileId);
          refreshProfiles;
          toastSuccess("Solicitud aprobada correctamente");
        } catch (error) {
          console.error(error);
          toastError("Error al aprobar la solicitud");
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
      "¿Rechazar solicitud de profesor?",
      async () => {
        setLoadingReject(true);
        try {
          if (professor?.id) {
            await rejectProfile(professor?.id, rejectedReason);
          }
          toastSuccess("Solicitud rechazada");
        } catch (error) {
          console.error(error);
          toastError("Error al rechazar la solicitud");
        } finally {
          setLoadingReject(false);
        }
      },
      () => {}
    );
  };

  const handleReject = async () => {
    if (professor?.approvalStatus === "pending") {
      setIsModalOpen(true);
      return;
    }
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
  if (!professor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <HiUser className="w-16 h-16 sm:w-24 sm:h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-font-light mb-2">Profesor no encontrado</h2>
          <p className="text-slate-400 mb-6 text-sm sm:text-base">
            No se pudo cargar la información del profesor
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
          {professor.approvalStatus === "pending" && (
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg shrink-0">
                  <HiExclamation className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-blue-200 font-semibold text-base sm:text-lg">Solicitud Pendiente</p>
                  <p className="text-blue-200/80 text-xs sm:text-sm">
                    Esta solicitud está esperando aprobación. Revisa la información y decide si aprobar o
                    rechazar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {professor.approvalStatus === "rejected" && (
            <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-amber-500/20 rounded-lg shrink-0">
                  <HiXCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-amber-200 font-semibold text-base sm:text-lg">Solicitud Rechazada</p>
                  <p className="text-amber-200/80 text-xs sm:text-sm">
                    Esta solicitud fue rechazada previamente.
                  </p>
                  <p className="text-amber-200/80 text-xs sm:text-sm break-words">
                    Motivo: {professor.rejectionReason ? professor.rejectionReason : "No se encontró motivo"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {professor.approvalStatus === "approved" && (
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 sm:p-4">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-emerald-500/20 rounded-lg shrink-0">
                  <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <p className="text-emerald-200 font-semibold text-base sm:text-lg">Solicitud Aprobada</p>
                  <p className="text-emerald-100 text-xs sm:text-sm">
                    Este profesor fue aprobado y puede crear cursos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============[ MAIN HEADER ]============ */}
          <div className="mt-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center shrink-0">
                  {professor.user.image ? (
                    <img
                      src={professor.user.image}
                      alt={professor.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="w-8 h-8 sm:w-10 sm:h-10 text-font-light" />
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h1 className="text-2xl sm:text-3xl font-bold text-font-light mb-1 break-words">
                    {professor.user.name}
                  </h1>
                  <p className="text-slate-400 mb-2 sm:mb-3 text-sm sm:text-base">{professor.profession}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                        professor.approvalStatus
                      )}`}
                    >
                      {getStatusLabel(professor.approvalStatus)}
                    </span>
                    {professor.user.isEmailVerified && (
                      <span className="px-2 sm:px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-lg text-xs font-medium">
                        Email Verificado
                      </span>
                    )}
                    {professor.user.isActive && (
                      <span className="px-2 sm:px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-lg text-xs font-medium">
                        Usuario Activo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ============[ ACTION BUTTONS ]============ */}
              {professor.approvalStatus === "pending" && professor.user.role  === "student" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                  <button
                    onClick={handleRejectStudent}
                    disabled={loadingReject || loadingApprove}
                    className="flex items-center justify-center cursor-pointer gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm sm:text-base"
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
                    onClick={handleApproveStudent}
                    disabled={loadingApprove || loadingReject}
                    className="flex items-center justify-center cursor-pointer gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm sm:text-base"
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
                        Aprobar
                      </>
                    )}
                  </button>
                </div>
              )}

              {professor.approvalStatus === "pending" && professor.user.role === "teacher" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                  <button
                    onClick={handleReject}
                    disabled={loadingReject || loadingApprove}
                    className="flex items-center justify-center cursor-pointer gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm sm:text-base"
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
                    onClick={() => handleApprove(professor.id)}
                    disabled={loadingApprove || loadingReject}
                    className="flex items-center justify-center cursor-pointer gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 text-sm sm:text-base"
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
                        Aprobar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============[ CONTENT GRID ]============ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* ============[ LEFT COLUMN ]============ */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Información de contacto */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiUser className="w-5 h-5 sm:w-6 sm:h-6" />
                Información de Contacto
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 flex items-center gap-2">
                    <HiMail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Email
                  </p>
                  <p className="text-font-light text-sm sm:text-base break-all">{professor.user.email}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1 flex items-center gap-2">
                    <HiPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Teléfono
                  </p>
                  <p className="text-font-light text-sm sm:text-base">{professor.phone}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">ID de Usuario</p>
                  <p className="text-font-light font-mono text-xs bg-slate-800/50 px-2 sm:px-3 py-1.5 sm:py-2 rounded break-all">
                    {professor.user.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de cuenta */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                Detalles de Cuenta
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Rol</span>
                  <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded text-xs font-medium">
                    {professor.user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Cuenta Google</span>
                  <span className={professor.user.isGoogleAccount ? "text-emerald-300" : "text-slate-300"}>
                    {professor.user.isGoogleAccount ? (
                      <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <RxCross2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Cuenta GitHub</span>
                  <span className={professor.user.isGitHubAccount ? "text-emerald-300" : "text-slate-300"}>
                    {professor.user.isGitHubAccount ? (
                      <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <RxCross2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Perfil Completo</span>
                  <span
                    className={professor.user.hasCompletedProfile ? "text-emerald-300" : "text-slate-300"}
                  >
                    {professor.user.hasCompletedProfile ? (
                      <HiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <RxCross2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
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
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Registro de usuario</p>
                  <p className="text-font-light text-xs sm:text-sm">{formatDate(professor.user.createdAt)}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-1">Última actualización</p>
                  <p className="text-font-light text-xs sm:text-sm">{formatDate(professor.user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============[ RIGHT COLUMN ]============ */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Información profesional */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiAcademicCap className="w-5 h-5 sm:w-6 sm:h-6" />
                Información Profesional
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-2">Profesión</p>
                  <p className="text-font-light text-base sm:text-lg font-medium">{professor.profession}</p>
                </div>

                {professor.speciality && (
                  <div>
                    <p className="text-slate-400 text-xs sm:text-sm mb-2">Especialidad</p>
                    <p className="text-font-light text-sm sm:text-base">{professor.speciality}</p>
                  </div>
                )}

                <div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-2">Biografía</p>
                  {professor.biography ? (
                    <p className="text-font-light leading-relaxed bg-slate-800/30 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                      {professor.biography}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic text-sm">Sin biografía proporcionada</p>
                  )}
                </div>
              </div>
            </div>

            {/* Enlaces profesionales */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                Enlaces Profesionales
              </h2>
              {professor.professionalLinks && professor.professionalLinks.length > 0 ? (
                <div className="space-y-2 sm:space-y-3">
                  {professor.professionalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2.5 sm:p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                    >
                      <HiExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-accent-light shrink-0" />
                      <span className="text-font-light text-xs sm:text-sm truncate">{link}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">No hay enlaces profesionales proporcionados</p>
              )}
            </div>

            {/* Certificados */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiDocumentText className="w-5 h-5 sm:w-6 sm:h-6" />
                Certificados
              </h2>
              {professor.certificates && professor.certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {professor.certificates.map((cert, index) => (
                    <a
                      key={index}
                      href={cert}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-lg border border-slate-700/50 hover:border-accent-light/50 transition-all"
                    >
                      <img
                        src={cert}
                        alt={`Certificado ${index + 1}`}
                        className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3 sm:pb-4">
                        <span className="text-font-light text-xs sm:text-sm font-medium flex items-center gap-2">
                          <HiExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Ver certificado
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">No hay certificados cargados</p>
              )}
            </div>

            {/* Términos aceptados */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-font-light mb-3 sm:mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                Términos y Condiciones
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Términos generales</span>
                  {professor.agreedToTerms ? (
                    <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <RxCross2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Políticas de información</span>
                  {professor.agreedToInfo ? (
                    <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <RxCross2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300 text-xs sm:text-sm">Términos de aprobación</span>
                  {professor.agreedToAproveed ? (
                    <HiCheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300" />
                  ) : (
                    <RxCross2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  )}
                </div>
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
          onConfirm={professor?.user.role === "student" ? handleRejectStudentConfirm : confirmRejected}
        />
      )}
    </div>
  );
};

export default ProfessorValidationDetails;

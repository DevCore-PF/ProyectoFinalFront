"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  toastSuccess,
  toastError,
  toastConfirm,
} from "@/helpers/alerts.helper";
import { FaCheck } from "react-icons/fa6";
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

interface ProfessorValidationDetailsProps {
  profileId: string;
  onBack: () => void;
}

const ProfessorValidationDetails = ({
  profileId,
  onBack,
}: ProfessorValidationDetailsProps) => {
  const { professorProfiles, approveValidation, refreshProfiles } = useAdmin();
  const [professor, setProfessor] = useState<ProfessorProfileAdmin | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  useEffect(() => {
    const foundProfessor = professorProfiles.find((p) => p.id === profileId);
    if (foundProfessor) {
      setProfessor(foundProfessor);
    }
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
  const handleApprove = async (profileId: string) => {
    toastConfirm(
      "¿Aprobar solicitud de profesor?",
      async () => {
        setLoadingApprove(true);
        try {
          await approveValidation(profileId);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectedReason, setRejectedReason] = useState("");
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
          // TODO: Llamar al servicio de rechazo
          // await rejectProfessor(professorId);
          toastSuccess("Solicitud rechazada");
          // onBack();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!professor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HiUser className="w-24 h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-font-light mb-2">
            Profesor no encontrado
          </h2>
          <p className="text-slate-400 mb-6">
            No se pudo cargar la información del profesor
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
          {professor.approvalStatus === "pending" && (
            <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <HiExclamation className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 font-semibold text-lg">
                    Solicitud Pendiente
                  </p>
                  <p className="text-blue-200/80 text-sm">
                    Esta solicitud está esperando aprobación. Revisa la
                    información y decide si aprobar o rechazar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {professor.approvalStatus === "rejected" && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <HiXCircle className="w-6 h-6 text-red-300" />
                </div>
                <div>
                  <p className="text-amber-200 font-semibold text-lg">
                    Solicitud Rechazada
                  </p>
                  <p className="text-amber-200/80 text-sm">
                    Esta solicitud fue rechazada previamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {professor.approvalStatus === "approved" && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <HiCheckCircle className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <p className="text-emerald-200 font-semibold text-lg">
                    Solicitud Aprobada
                  </p>
                  <p className="text-emerald-100 text-sm">
                    Este profesor fue aprobado y puede crear cursos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header principal */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-button to-accent-light flex items-center justify-center flex-shrink-0">
                  {professor.user.image ? (
                    <img
                      src={professor.user.image}
                      alt={professor.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="w-10 h-10 text-font-light" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-bold text-font-light mb-1">
                    {professor.user.name}
                  </h1>
                  <p className="text-slate-400 mb-3">{professor.profession}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusBadge(
                        professor.approvalStatus
                      )}`}
                    >
                      {getStatusLabel(professor.approvalStatus)}
                    </span>
                    {professor.user.isEmailVerified && (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-lg text-xs font-medium">
                        Email Verificado
                      </span>
                    )}
                    {professor.user.isActive && (
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-lg text-xs font-medium">
                        Usuario Activo
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción solo si está pendiente */}
              {professor.approvalStatus === "pending" && (
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
                    onClick={() => handleApprove(professor.id)}
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
                        Aprobar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid de información */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info del usuario */}
          <div className="lg:col-span-1 space-y-6">
            {/* Información de contacto */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiUser className="w-6 h-6" />
                Información de Contacto
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                    <HiMail className="w-4 h-4" />
                    Email
                  </p>
                  <p className="text-font-light">{professor.user.email}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                    <HiPhone className="w-4 h-4" />
                    Teléfono
                  </p>
                  <p className="text-font-light">{professor.phone}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">ID de Usuario</p>
                  <p className="text-font-light font-mono text-xs bg-slate-800/50 px-3 py-2 rounded break-all">
                    {professor.user.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Información de cuenta */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-6 h-6" />
                Detalles de Cuenta
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Rol</span>
                  <span className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded text-xs font-medium">
                    {professor.user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Cuenta Google</span>
                  <span
                    className={
                      professor.user.isGoogleAccount
                        ? "text-emerald-200"
                        : "text-slate-300"
                    }
                  >
                    {professor.user.isGoogleAccount ? (
                      <FaCheck />
                    ) : (
                      <RxCross2 />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Cuenta GitHub</span>
                  <span
                    className={
                      professor.user.isGitHubAccount
                        ? "text-emerald-300"
                        : "text-slate-300"
                    }
                  >
                    {professor.user.isGitHubAccount ? (
                      <FaCheck />
                    ) : (
                      <RxCross2 />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">
                    Perfil Completo
                  </span>
                  <span
                    className={
                      professor.user.hasCompletedProfile
                        ? "text-emerald-200"
                        : "text-slate-300"
                    }
                  >
                    {professor.user.hasCompletedProfile ? (
                      <FaCheck />
                    ) : (
                      <RxCross2 />
                    )}
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
                  <p className="text-slate-400 text-sm mb-1">
                    Registro de usuario
                  </p>
                  <p className="text-font-light text-sm">
                    {formatDate(professor.user.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">
                    Última actualización
                  </p>
                  <p className="text-font-light text-sm">
                    {formatDate(professor.user.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Info profesional */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información profesional */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiAcademicCap className="w-6 h-6" />
                Información Profesional
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Profesión</p>
                  <p className="text-font-light text-lg font-medium">
                    {professor.profession}
                  </p>
                </div>

                {professor.speciality && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Especialidad</p>
                    <p className="text-font-light">{professor.speciality}</p>
                  </div>
                )}

                <div>
                  <p className="text-slate-400 text-sm mb-2">Biografía</p>
                  {professor.biography ? (
                    <p className="text-font-light leading-relaxed bg-slate-800/30 p-4 rounded-lg">
                      {professor.biography}
                    </p>
                  ) : (
                    <p className="text-slate-500 italic">
                      Sin biografía proporcionada
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Enlaces profesionales */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiExternalLink className="w-6 h-6" />
                Enlaces Profesionales
              </h2>
              {professor.professionalLinks &&
              professor.professionalLinks.length > 0 ? (
                <div className="space-y-3">
                  {professor.professionalLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                    >
                      <HiExternalLink className="w-4 h-4 text-slate-400 group-hover:text-accent-light" />
                      <span className="text-font-light text-sm truncate">
                        {link}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  No hay enlaces profesionales proporcionados
                </p>
              )}
            </div>

            {/* Certificados */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiDocumentText className="w-6 h-6" />
                Certificados
              </h2>
              {professor.certificates && professor.certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                        <span className="text-font-light text-sm font-medium flex items-center gap-2">
                          <HiExternalLink className="w-4 h-4" />
                          Ver certificado
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">
                  No hay certificados cargados
                </p>
              )}
            </div>

            {/* Términos aceptados */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiShieldCheck className="w-6 h-6" />
                Términos y Condiciones
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Términos generales</span>
                  {professor.agreedToTerms ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-red-300" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">
                    Políticas de información
                  </span>
                  {professor.agreedToInfo ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-red-300" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Términos de aprobación</span>
                  {professor.agreedToAproveed ? (
                    <HiCheckCircle className="w-5 h-5 text-emerald-300" />
                  ) : (
                    <HiXCircle className="w-5 h-5 text-red-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default ProfessorValidationDetails;

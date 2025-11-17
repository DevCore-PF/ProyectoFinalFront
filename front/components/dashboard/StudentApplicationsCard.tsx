"use client";

import React, { useState } from "react";
import { HiAcademicCap } from "react-icons/hi";
import TeacherApplicationCard from "@/components/TeacherApplicationCard";
import TeacherRequestModal from "@/components/TeacherRequestModal";
import useStudentTeacherRequest from "@/hooks/useStudentTeacherRequest";

interface StudentApplicationsCardProps {
  title: string;
}

const StudentApplicationsCard = ({ title }: StudentApplicationsCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    applicationStatus,
    canApply,
    hasApplication,
    isPending,
    isSubmitting,
  } = useStudentTeacherRequest();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-transparent backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-slate-200">
          {title}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Revisa el estado de tus postulaciones para convertirte en profesor
        </p>
      </div>

      {/* Si está cargando */}
      {applicationStatus.isLoading ? (
        <div className="text-center text-slate-400 py-16 bg-slate-900/30 rounded-xl border border-slate-700/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm">Verificando estado de postulaciones...</p>
        </div>
      ) : hasApplication ? (
        /* Si tiene solicitud, mostrar la card de estado */
        <TeacherApplicationCard
          status={applicationStatus.status}
          message={applicationStatus.message}
          rejectionReason={applicationStatus.rejectionReason}
        />
      ) : (
        /* Si no tiene solicitud, mostrar opción para aplicar */
        <div className="text-center text-slate-400 py-16 bg-slate-900/30 rounded-xl border border-slate-700/20">
          <HiAcademicCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-slate-300 mb-2">
            No tienes postulaciones aún
          </p>
          <p className="text-sm mb-6">
            ¡Postúlate para convertirte en profesor y comparte tu conocimiento!
          </p>
          <button
            onClick={handleOpenModal}
            disabled={!canApply}
            className="inline-flex items-center gap-2 bg-button hover:bg-button/80 px-6 py-3 rounded-lg text-font-light font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <HiAcademicCap className="w-5 h-5" />
            Postularme como Profesor
          </button>
        </div>
      )}

      {/* Modal para solicitud */}
      <TeacherRequestModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default StudentApplicationsCard;

"use client";
import { ValidationMessageProps } from "@/types/professionalValidation.types";
import React from "react";
import {
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiDocumentAdd,
} from "react-icons/hi";

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  status,
  className = "",
  onActionClick,
}) => {
  const getValidationConfig = () => {
    switch (status) {
      case "approved":
        return {
          icon: <HiCheckCircle className="w-6 h-6" />,
          iconColor: "text-green-400",
          bgColor: "bg-green-500/10",
          borderColor: "border-green-400/30",
          title: "¡Perfil Aprobado!",
          description:
            "Tu perfil de profesor ha sido verificado y aprobado. Ya puedes crear y publicar cursos.",
          actionButton: null,
        };
      case "pending":
        return {
          icon: <HiClock className="w-6 h-6" />,
          iconColor: "text-yellow-300",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-400/30",
          title: "Perfil en Revisión",
          description:
            "Tu perfil está siendo revisado por nuestro equipo. Te notificaremos cuando esté aprobado.",
          actionButton: null,
        };
        case "rejected":
        return {
          icon: <HiXCircle className="w-6 h-6" />,
          iconColor: "text-amber-300",
          bgColor: "bg-amber-500/10",
          borderColor: "border-amber-400/30",
          title: "Perfil Rechazado",
          description:
            "Tu perfil necesita modificaciones. Revisa la información y vuelve a enviarla.",

          actionButton: {
            text: "Editar Perfil",
            onClick: onActionClick || (() => {}),
          },
        };

      case "not-submitted":
      default:
        return {
          icon: <HiDocumentAdd className="w-6 h-6 " />,
          iconColor: "text-blue-300",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-400/30",
          title: "Completa tu Perfil de Profesor",
          description:
            "Para poder crear cursos, primero debes completar y enviar tu perfil profesional para verificación.",
          actionButton: {
            text: "Completar Perfil",
            onClick: onActionClick || (() => {}),
          },
        };
    }
  };

  const config = getValidationConfig();

  return (
    <div
      className={`
      bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-4 sm:p-6 
      ${config.bgColor} ${config.borderColor} 
      transition-all duration-300 hover:border-opacity-50
      ${className}
    `}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div
          className={`
          p-2.5 sm:p-3 rounded-xl ${config.bgColor} ${config.iconColor}
          flex-shrink-0
        `}
        >
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-200 mb-2 break-words">
            {config.title}
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 break-words">
            {config.description}
          </p>

          {/* Action Button */}
          {config.actionButton && (
            <button
              onClick={config.actionButton.onClick}
              className={`
                cursor-pointer 
                px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm
                ${config.iconColor} ${config.bgColor}
                border ${config.borderColor}
                hover:scale-101 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
                w-full sm:w-auto
              `}
            >
              {config.actionButton.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;

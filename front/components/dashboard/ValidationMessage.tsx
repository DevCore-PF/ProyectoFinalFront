"use client";
import React from 'react';
import { 
  HiCheckCircle, 
  HiClock, 
  HiXCircle, 
  HiDocumentAdd 
} from 'react-icons/hi';

interface ValidationMessageProps {
  status: 'approved' | 'pending' | 'rejected' | 'not-submitted';
  className?: string;
  onActionClick?: () => void;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ 
  status, 
  className = '',
  onActionClick
}) => {
  const getValidationConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: <HiCheckCircle className="w-6 h-6" />,
          iconColor: 'text-green-500',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          title: '¡Perfil Aprobado!',
          description: 'Tu perfil de profesor ha sido verificado y aprobado. Ya puedes crear y publicar cursos.',
          actionButton: null
        };
      
      case 'pending':
        return {
          icon: <HiClock className="w-6 h-6" />,
          iconColor: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          title: 'Perfil en Revisión',
          description: 'Tu perfil está siendo revisado por nuestro equipo. Te notificaremos cuando esté aprobado.',
          actionButton: null
        };
      
      case 'rejected':
        return {
          icon: <HiXCircle className="w-6 h-6" />,
          iconColor: 'text-red-500',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          title: 'Perfil Rechazado',
          description: 'Tu perfil necesita modificaciones. Revisa la información y vuelve a enviarla.',
          actionButton: {
            text: 'Editar Perfil',
            onClick: onActionClick || (() => {})
          }
        };
      
      case 'not-submitted':
      default:
        return {
          icon: <HiDocumentAdd className="w-6 h-6" />,
          iconColor: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          title: 'Completa tu Perfil de Profesor',
          description: 'Para poder crear cursos, primero debes completar y enviar tu perfil profesional para verificación.',
          actionButton: {
            text: 'Completar Perfil',
            onClick: onActionClick || (() => {})
          }
        };
    }
  };

  const config = getValidationConfig();

  return (
    <div className={`
      bg-slate-900/50 backdrop-blur-sm border rounded-2xl p-6 
      ${config.bgColor} ${config.borderColor} 
      transition-all duration-300 hover:border-opacity-50
      ${className}
    `}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          p-3 rounded-xl ${config.bgColor} ${config.iconColor}
          flex-shrink-0
        `}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            {config.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            {config.description}
          </p>

          {/* Action Button */}
          {config.actionButton && (
            <button
              onClick={config.actionButton.onClick}
              className={`
                px-4 py-2 rounded-lg font-medium text-sm
                ${config.iconColor} ${config.bgColor}
                border ${config.borderColor}
                hover:bg-opacity-20 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
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
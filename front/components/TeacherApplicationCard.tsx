import React from 'react';
import { FaClock, FaCheckCircle, FaTimesCircle, FaFileAlt, FaRedo } from 'react-icons/fa';

interface TeacherApplicationCardProps {
  status: 'pending' | 'approved' | 'rejected' | null;
  message: string | null;
  onReapply?: () => void;
  isLoading?: boolean;
}

const TeacherApplicationCard: React.FC<TeacherApplicationCardProps> = ({
  status,
  message,
  onReapply,
  isLoading = false,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <FaClock className="w-5 h-5" />,
          iconColor: "text-yellow-400",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-400/30",
          title: "Solicitud en Revisión",
          description: message || "Tu solicitud para ser profesor está siendo revisada por nuestro equipo.",
          showButton: false,
        };
      case 'approved':
        return {
          icon: <FaCheckCircle className="w-5 h-5" />,
          iconColor: "text-green-400",
          bgColor: "bg-green-500/10", 
          borderColor: "border-green-400/30",
          title: "¡Solicitud Aprobada!",
          description: message || "¡Felicitaciones! Tu solicitud ha sido aprobada. Ahora eres profesor.",
          showButton: false,
        };
      case 'rejected':
        return {
          icon: <FaTimesCircle className="w-5 h-5" />,
          iconColor: "text-red-400",
          bgColor: "bg-red-500/10",
          borderColor: "border-red-400/30", 
          title: "Solicitud Rechazada",
          description: message || "Tu solicitud ha sido rechazada. Puedes actualizar tu información y volver a aplicar.",
          showButton: true,
        };
      default:
        return {
          icon: <FaFileAlt className="w-5 h-5" />,
          iconColor: "text-blue-400",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-400/30",
          title: "Sin Solicitudes",
          description: "No tienes solicitudes para ser profesor.",
          showButton: false,
        };
    }
  };

  const config = getStatusConfig();

  if (!status) {
    return (
      <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-6 text-font-light">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-12 h-12 ${config.bgColor} rounded-full mb-4`}>
            <div className={config.iconColor}>
              {config.icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            Sin Solicitudes
          </h3>
          <p className="text-sm text-slate-400">
            Aún no has enviado ninguna solicitud para ser profesor.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background2/40 border ${config.borderColor} rounded-2xl p-6 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300`}>
      <div className="flex items-start space-x-4">
        {/* Icono de estado */}
        <div className={`flex-shrink-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
          <div className={config.iconColor}>
            {config.icon}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            Solicitud para ser Profesor
          </h3>
          
          <div className="mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.iconColor} border ${config.borderColor}`}>
              {config.title}
            </span>
          </div>

          <p className="text-sm text-slate-300 mb-4 leading-relaxed">
            {config.description}
          </p>

          {/* Información adicional según estado */}
          {status === 'pending' && (
            <div className="text-xs text-slate-400 space-y-1">
              <p>• Recibirás una notificación por email cuando sea revisada</p>
              <p>• El proceso de revisión puede tomar entre 24-48 horas</p>
            </div>
          )}

          {status === 'approved' && (
            <div className="text-xs text-green-400">
              <p>• Ya puedes acceder a todas las funciones de profesor</p>
            </div>
          )}

          {/* Botón para reenviar solo si fue rechazada */}
          {config.showButton && onReapply && (
            <div className="mt-4">
              <button
                onClick={onReapply}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 text-red-300 hover:text-red-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaRedo className="w-4 h-4 mr-2" />
                {isLoading ? 'Enviando...' : 'Reenviar Solicitud'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherApplicationCard;
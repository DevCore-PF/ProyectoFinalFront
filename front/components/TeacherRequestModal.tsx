import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import ProfessionalValidationForm from '@/components/dashboard/ProfessionalValidationForm';
import useStudentTeacherRequest from '@/hooks/useStudentTeacherRequest';
import { toastSuccess, toastError } from '@/helpers/alerts.helper';

interface TeacherRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeacherRequestModal: React.FC<TeacherRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { submitTeacherRequest, isSubmitting, canApply, isPending } = useStudentTeacherRequest();
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSubmit = async (formData: FormData) => {
    // Verificar si puede aplicar antes de enviar
    if (!canApply) {
      if (isPending) {
        toastError('Ya has enviado tu solicitud. Tu perfil está en revisión por nuestro equipo.');
      } else {
        toastError('No puedes enviar una nueva solicitud en este momento.');
      }
      return;
    }

    try {
      await submitTeacherRequest(formData);
      toastSuccess('¡Solicitud enviada exitosamente! Te notificaremos cuando sea revisada.');
      handleClose();
    } catch (error) {
      // Verificar si el error es porque ya tiene una solicitud en revisión
      const errorMessage = error instanceof Error ? error.message : '';
      
      if (errorMessage.includes('revisión') || errorMessage.includes('pendiente') || errorMessage.includes('ya enviaste')) {
        toastError('Ya has enviado tu solicitud. Tu perfil está en revisión por nuestro equipo.');
      } else {
        toastError('Error al enviar la solicitud. Inténtalo de nuevo.');
      }
      
      console.error('Error submitting teacher request:', error);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // No permitir cerrar mientras se envía
    
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 z-[9999] transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-background border border-slate-700/50 rounded-2xl w-full max-w-5xl shadow-2xl transform transition-all duration-300 mx-auto my-auto ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={handleContentClick}
        style={{
          height: '85vh',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div>
            <h2 className="text-2xl font-bold text-font-light">
              Solicitud para ser Profesor
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Completa tu perfil profesional para convertirte en instructor
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto custom-scrollbar bg-background"
          style={{
            padding: '24px',
            minHeight: 0
          }}
        >
          {/* Información importante */}
          <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-sm">ℹ</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-blue-300 mb-1">
                  Información importante
                </h3>
                <ul className="text-xs text-blue-200 space-y-1">
                  <li>• Tu solicitud será revisada por nuestro equipo de administración</li>
                  <li>• Recibirás una notificación por email con el resultado</li>
                  <li>• El proceso de revisión puede tomar entre 24-48 horas</li>
                  <li>• Todos los campos marcados son obligatorios</li>
                  <li>• Debes adjuntar al menos un certificado profesional</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <ProfessionalValidationForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            className="space-y-6"
          />
        </div>

        {/* Footer con información adicional */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-background2/50">
          <p className="text-xs text-slate-400 text-center">
            Al enviar esta solicitud, confirmas que toda la información proporcionada es veraz y exacta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherRequestModal;
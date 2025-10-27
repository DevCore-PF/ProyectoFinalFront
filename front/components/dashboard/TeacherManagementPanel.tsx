import React from 'react';
import Image from 'next/image';
import { HiPlus, HiUpload, HiPencil, HiVideoCamera, HiChartBar, HiCurrencyDollar, HiEye } from 'react-icons/hi';

interface ManagementOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface TeacherManagementPanelProps {
  className?: string;
}

const TeacherManagementPanel: React.FC<TeacherManagementPanelProps> = ({ className = '' }) => {
  const managementOptions: ManagementOption[] = [
    {
      id: 'create-course',
      title: 'Crear nuevo curso',
      description: 'Inicia el flujo de creación desde cero.',
      icon: <HiPlus className="text-xl" />,
      onClick: () => console.log('Crear nuevo curso')
    },
    {
      id: 'upload-resources',
      title: 'Subir recursos',
      description: 'Adjunta PDFs, archivos de apoyo etc.',
      icon: <HiUpload className="text-xl" />,
      onClick: () => console.log('Subir recursos')
    },
    {
      id: 'edit-course',
      title: 'Editar curso existente',
      description: 'Modifica título, descripción o precio.',
      icon: <HiPencil className="text-xl" />,
      onClick: () => console.log('Editar curso existente')
    },
    {
      id: 'add-video',
      title: 'Agregar un nuevo video',
      description: 'Añade lecciones a un curso ya publicado o en borrador.',
      icon: <HiVideoCamera className="text-xl" />,
      onClick: () => console.log('Agregar nuevo video')
    },
    {
      id: 'statistics',
      title: 'Ver mis estadísticas',
      description: 'Accede a métricas de rendimiento de tus cursos.',
      icon: <HiChartBar className="text-xl" />,
      onClick: () => console.log('Ver estadísticas')
    },
    {
      id: 'income',
      title: 'Consultar ingresos',
      description: 'Mira el alcance e historial de pagos por curso.',
      icon: <HiCurrencyDollar className="text-xl" />,
      onClick: () => console.log('Consultar ingresos')
    },
    {
      id: 'pending-courses',
      title: 'Ver cursos en revisión o pendientes',
      description: 'Revisa el proceso de aprobación de tus cursos.',
      icon: <HiEye className="text-xl" />,
      onClick: () => console.log('Ver cursos pendientes')
    }
  ];

  return (
    <div className={`rounded-xl p-6 text-white font-body ${className}`} style={{ backgroundColor: '#3F4273' }}>
      <div className="flex items-center space-x-3 mb-6">
        <Image 
          src="/icons/settingsIcon.svg" 
          alt="Panel de Gestión" 
          width={24} 
          height={24}
          style={{ 
            filter: 'brightness(0) saturate(100%) invert(96%) sepia(16%) saturate(290%) hue-rotate(22deg) brightness(103%) contrast(96%)'
          }}
        />
        <h2 className="text-xl font-medium">PANEL DE GESTIÓN</h2>
      </div>
      <p className="text-sm text-gray-300 font-light mb-6">
        Breve descripción de sección panel de gestión
      </p>
      
      <div className="space-y-0">
        {managementOptions.map((option, index) => (
          <div key={option.id}>
            <button
              onClick={option.onClick}
              className="w-full p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer text-left flex items-start space-x-3"
            >
              <div className="text-white mt-1">
                {option.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-white text-sm mb-1">{option.title}</h3>
                <p className="text-xs text-gray-300 font-light leading-relaxed">{option.description}</p>
              </div>
            </button>
            {index < managementOptions.length - 1 && (
              <div className="h-px bg-gray-600 mx-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherManagementPanel;
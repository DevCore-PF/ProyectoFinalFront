import React from 'react';
import { HiCog, HiUser, HiBell, HiLockClosed } from 'react-icons/hi';

interface ProfileSettingsProps {
  className?: string;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ className = '' }) => {
  const settingsOptions = [
    {
      id: 'profile',
      title: 'Editar Perfil',
      description: 'Actualiza tu información personal',
      icon: <HiUser className="text-xl" />,
      onClick: () => console.log('Editar perfil')
    },
    {
      id: 'notifications',
      title: 'Notificaciones',
      description: 'Gestiona tus preferencias de notificaciones',
      icon: <HiBell className="text-xl" />,
      onClick: () => console.log('Configurar notificaciones')
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Cambia tu contraseña y configuración de seguridad',
      icon: <HiLockClosed className="text-xl" />,
      onClick: () => console.log('Configurar seguridad')
    },
    {
      id: 'general',
      title: 'Configuración General',
      description: 'Ajustes generales de la cuenta',
      icon: <HiCog className="text-xl" />,
      onClick: () => console.log('Configuración general')
    }
  ];

  return (
    <div className={`rounded-xl p-6 text-white font-body ${className}`} style={{ backgroundColor: '#3F4273' }}>
      <h2 className="text-xl font-medium mb-6 text-center">Ajustes de Perfil</h2>
      
      <div className="space-y-3">
        {settingsOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.onClick}
            className="w-full p-4 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer text-left flex items-center space-x-3"
          >
            <div className="text-white">
              {option.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-white text-sm">{option.title}</h3>
              <p className="text-xs text-gray-300 font-light">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileSettings;
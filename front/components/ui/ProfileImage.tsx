import React from 'react';
import Image from 'next/image';

interface ProfileImageProps {
  user?: {
    profileImage?: string;
    name?: string;
  };
  size?: number;
  className?: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ 
  user, 
  size = 64, 
  className = '',
  showEditButton = false,
  onEditClick
}) => {
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const initials = getInitials(user?.name);

  return (
    <div className={`relative ${className}`}>
      <div 
        className="relative overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`Foto de perfil de ${user.name || 'Usuario'}`}
            width={size}
            height={size}
            className="w-full h-full object-cover"
            onError={(e) => {
              
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : null}
        
        
        <div 
          className={`absolute inset-0 flex items-center justify-center text-white font-bold ${
            user?.profileImage ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ fontSize: size * 0.3 }}
        >
          {initials}
        </div>
      </div>
      
      {showEditButton && (
        <button
          onClick={onEditClick}
          className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          title="Cambiar foto de perfil"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProfileImage;
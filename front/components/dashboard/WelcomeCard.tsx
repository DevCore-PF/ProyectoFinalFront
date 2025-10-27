import React from 'react';
import { HiCog } from 'react-icons/hi';

interface WelcomeCardProps {
  userName: string;
  userEmail: string;
  weeklyGoalProgress?: number; // porcentaje de 0-100
  goalHours?: number;
  currentHours?: number;
  showWeeklyGoal?: boolean; // prop para controlar la meta semanal en card correspondiente
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({
  userName,
  userEmail,
  weeklyGoalProgress = 0,
  goalHours = 0,
  currentHours = 0,
  showWeeklyGoal = true // usado para evitar armar componente muy pequeño y no reutilizable
}) => {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="rounded-xl p-8 text-white shadow-lg font-body" style={{ backgroundColor: '#3F4273' }}>
      <div className="mb-6">
        <p className="text-gray-300 text-sm mb-3 font-normal">{currentDate}</p>
        <h1 className="text-3xl font-medium mb-2" style={{ fontWeight: 500 }}>¡Bienvenid@ {userName}!</h1>
        <p className="text-gray-300 text-base font-light">{userEmail}</p>
      </div>
      
      
      {showWeeklyGoal && (
        <div className="rounded-lg p-6 mb-4" style={{ backgroundColor: '#2B2C4F' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-base font-medium">Meta semanal</span>
            <span className="text-base font-medium">{weeklyGoalProgress}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-4 mb-3">
            <div 
              className="h-4 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${weeklyGoalProgress}%`,
                backgroundColor: '#FBEDBC'
              }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-300 font-light">
            Llevas {currentHours} horas de {goalHours} horas
          </p>
        </div>
      )}
      
      
      <button 
        onClick={() => console.log('Navegando a ajustes de perfil')}
        className="flex items-center space-x-2 mt-4 text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer"
      >
        <HiCog className="text-lg" />
        <span className="text-sm font-light">Ajustes de perfil</span>
      </button>
    </div>
  );
};

export default WelcomeCard;
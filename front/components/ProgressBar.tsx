'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  className = '' 
}) => {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">
          Progreso del curso
        </span>
        <span className="text-sm text-gray-400">
          {current} de {total} lecciones
        </span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
        <div
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {percentage}% completado
        </span>
        {percentage === 100 && (
          <span className="text-xs text-green-400 font-medium">
            🎉 ¡Curso completado!
          </span>
        )}
      </div>
    </div>
  );
};
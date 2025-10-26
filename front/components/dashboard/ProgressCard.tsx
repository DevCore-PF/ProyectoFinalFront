import React from 'react';

interface ProgressItem {
  id: string;
  name: string;
  progress: number; // Porcentaje de 0-100
  color: string;
}

interface ProgressCardProps {
  title: string;
  progressItems: ProgressItem[];
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, progressItems }) => {
  return (
    <div className="rounded-xl p-8 text-white font-body" style={{ backgroundColor: '#3F4273' }}>
      <h2 className="text-2xl font-medium mb-8">{title}</h2>
      
      <div className="space-y-6">
        {progressItems.map((item) => (
          <div key={item.id} className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-normal">{item.name}</span>
              <span className="text-lg font-medium">{item.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ease-out`}
                style={{ 
                  width: `${item.progress}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      {progressItems.length === 0 && (
        <div className="text-center text-gray-300 py-12">
          <p className="text-lg font-normal">No hay progreso registrado aún.</p>
          <p className="text-sm mt-3 font-light">¡Comienza tu primer curso para ver tu progreso aquí!</p>
        </div>
      )}
    </div>
  );
};

export default ProgressCard;
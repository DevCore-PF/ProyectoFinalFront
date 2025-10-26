import React from 'react';
import { HiEye, HiEyeOff, HiStar } from 'react-icons/hi';

interface CourseData {
  id: string;
  title: string;
  students: number;
  rating: number;
  price: number;
  status: 'Publicado' | 'Borrador' | 'En revisión';
  createdDate: string;
  lastUpdate: string;
  totalDuration: string;
  visibility: 'Público' | 'Privado';
}

interface CourseCardProps {
  course: CourseData;
  onViewDetails: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Publicado': return '#10B981';
      case 'Borrador': return '#F59E0B';
      case 'En revisión': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <div className="mb-4">
      <div className="rounded-xl p-6 font-body" style={{ backgroundColor: '#3F4273' }}>
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white mb-2">{course.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>{course.students} alumnos</span>
              <div className="flex items-center space-x-1">
                <HiStar className="text-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <span>${course.price.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-2"
              style={{ backgroundColor: getStatusColor(course.status) }}
            >
              {course.status}
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-400 font-light">Creado:</span>
            <p className="text-white font-normal">{course.createdDate}</p>
          </div>
          <div>
            <span className="text-gray-400 font-light">Última actualización:</span>
            <p className="text-white font-normal">{course.lastUpdate}</p>
          </div>
        </div>

        
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            <span className="text-gray-400 font-light">Duración total: </span>
            <span className="text-white font-normal">{course.totalDuration}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-400 font-light">Visibilidad:</span>
            <div className="flex items-center space-x-1 text-white">
              {course.visibility === 'Público' ? (
                <HiEye className="text-green-400" />
              ) : (
                <HiEyeOff className="text-gray-400" />
              )}
              <span className="font-normal">{course.visibility}</span>
            </div>
          </div>
        </div>

        
        <button
          onClick={() => onViewDetails(course.id)}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 hover:opacity-90"
          style={{ 
            backgroundColor: '#FBEDBC',
            color: '#242645'
          }}
        >
          Ver detalles
        </button>
      </div>
      
      
      <div className="h-px bg-gray-600 mt-4"></div>
    </div>
  );
};

export default CourseCard;
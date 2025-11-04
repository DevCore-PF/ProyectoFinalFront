import React from 'react';
import { useRouter } from 'next/navigation';
import { Course, CourseCategory, CourseDifficulty, CourseType } from '@/types/course.types';
import { categoryConfig } from '@/helpers/course.helpers';

interface RealCourseCardProps {
  course: Course;
}

const RealCourseCard: React.FC<RealCourseCardProps> = ({ course }) => {
  const router = useRouter();

  // Obtener configuración de categoría
  const config = categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
  const Icon = config.icon;

  // Mapear dificultades al formato de display
  const difficultyMap = {
    [CourseDifficulty.BEGINNER]: 'Principiante',
    [CourseDifficulty.INTERMEDIATE]: 'Intermedio',
    [CourseDifficulty.ADVANCED]: 'Avanzado'
  };

  // Mapear tipo al formato de display
  const typeMap = {
    [CourseType.COURSE]: 'Curso',
    [CourseType.CAREER]: 'Carrera'
  };

  // Crear temario basado en las lecciones
  const syllabus = course.lessons ? course.lessons.map((lesson) => lesson.title) : [];

  return (
    <div 
      onClick={() => router.push(`/course/${course.id}`)}
      className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
        {/* Ícono lateral izquierdo */}
        <div className="flex-shrink-0">
          <div className={`bg-gradient-to-br ${config.iconGradient} p-4 rounded-xl shadow-lg w-20 h-20 flex items-center justify-center`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white text-2xl font-bold flex-1">
                {course.title}
              </h3>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-green-400 text-lg font-bold">
                  ${course.price}
                </span>
                <button className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30">
                  Ver Curso
                </button>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
              {course.duration}
            </span>
            <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
              {difficultyMap[course.difficulty]}
            </span>
            <span className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1.5 rounded-lg font-semibold`}>
              {course.category}
            </span>
            <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-3 py-1.5 rounded-lg font-semibold">
              {typeMap[course.type]}
            </span>
          </div>

          {/* Temario compacto */}
          <div className="border-t border-slate-700/50 pt-4">
            <h4 className="text-white font-semibold text-sm mb-3">Temario</h4>
            {syllabus.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {syllabus.map((topic: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`${config.textColor} font-bold text-xs`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-400 text-xs truncate">{topic}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs">Sin lecciones disponibles</p>
            )}
            <div className="mt-3 text-slate-500 text-xs">
              Por {course.professor?.user?.name || 'Instructor desconocido'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealCourseCard;
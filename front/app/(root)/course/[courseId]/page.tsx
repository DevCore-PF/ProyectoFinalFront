'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '@/types/course.types';
import { getCourseByIdService } from '@/services/course.services';
import { categoryConfig } from '@/helpers/course.helpers';
import { CourseCategory, CourseDifficulty, CourseType } from '@/types/course.types';
import { 
  HiArrowLeft, 
  HiPlay, 
  HiDocumentText, 
  HiChevronDown, 
  HiChevronUp, 
  HiClock,
  HiAcademicCap,
  HiTag,
  HiCheckCircle,
  HiLockClosed
} from "react-icons/hi";

// Helper function para extraer el nombre del archivo de la URL de Cloudinary
const getFileNameFromCloudinaryUrl = (url: string): string => {
  try {
    // Extraer el nombre del archivo de la URL
    // Formato típico: https://res.cloudinary.com/.../upload/v.../nombreArchivo.ext
    const urlParts = url.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    
    // Si tiene parámetros de query, removerlos
    const fileName = fileNameWithExtension.split('?')[0];
    
    // Decodificar caracteres especiales si existen
    return decodeURIComponent(fileName);
  } catch (error) {
    console.error('Error extracting filename from URL:', error);
    return 'Archivo';
  }
};

// Helper function para obtener solo el nombre sin extensión (para mostrar más limpio)
const getCleanFileName = (url: string): string => {
  const fullName = getFileNameFromCloudinaryUrl(url);
  const nameWithoutExtension = fullName.replace(/\.[^/.]+$/, ''); // Remover extensión
  
  // Si el nombre es muy largo, truncarlo pero mantener el inicio y final
  if (nameWithoutExtension.length > 50) {
    return nameWithoutExtension.substring(0, 25) + '...' + nameWithoutExtension.substring(nameWithoutExtension.length - 20);
  }
  
  return nameWithoutExtension;
};

// Helper function para capitalizar la primera letra
const capitalizeFileName = (fileName: string): string => {
  return fileName.charAt(0).toUpperCase() + fileName.slice(1);
};

const CourseDetailPage: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  
  // Estado para manejar las lecciones completadas
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  
  const { courseId } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const courseData = await getCourseByIdService(courseId as string);
        setCourse(courseData);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Cargar progreso desde localStorage
  useEffect(() => {
    if (courseId) {
      const savedProgress = localStorage.getItem(`course-progress-${courseId}`);
      if (savedProgress) {
        try {
          const progressArray = JSON.parse(savedProgress);
          setCompletedLessons(new Set(progressArray));
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    }
  }, [courseId]);

  // Función para marcar/desmarcar lección como completada
  const toggleLessonCompletion = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
    
    // Guardar en localStorage
    localStorage.setItem(`course-progress-${courseId}`, JSON.stringify(Array.from(newCompleted)));
  };

  // Función para verificar si una lección está disponible
  const isLessonAvailable = (lessonId: string): boolean => {
    if (!course?.lessons) return false;
    
    const lessonIndex = course.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return false;
    if (lessonIndex === 0) return true; // Primera lección siempre disponible
    
    // Verificar que todas las lecciones anteriores estén completadas
    for (let i = 0; i < lessonIndex; i++) {
      const previousLessonId = course.lessons[i].id;
      if (!completedLessons.has(previousLessonId)) {
        return false;
      }
    }
    return true;
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7e4bde]"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || 'Curso no encontrado'}</p>
          <button 
            onClick={() => router.back()} 
            className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Obtener configuración de categoría
  const config = categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
  const Icon = config.icon;

  // Mapear dificultades y tipos
  const difficultyMap = {
    [CourseDifficulty.BEGINNER]: 'Principiante',
    [CourseDifficulty.INTERMEDIATE]: 'Intermedio',
    [CourseDifficulty.ADVANCED]: 'Avanzado'
  };

  const typeMap = {
    [CourseType.COURSE]: 'Curso',
    [CourseType.CAREER]: 'Carrera'
  };

  // Función para obtener colores de dificultad
  const getDifficultyColors = (difficulty: CourseDifficulty) => {
    const difficultyText = difficultyMap[difficulty] || difficulty;
    switch (difficultyText?.toLowerCase()) {
      case 'principiante':
      case 'beginner':
      case 'básico':
        return 'bg-green-400/10 border border-green-400/30 text-green-400';
      case 'intermedio':
      case 'intermediate':
        return 'bg-yellow-400/10 border border-yellow-400/30 text-yellow-400';
      case 'avanzado':
      case 'advanced':
        return 'bg-red-400/10 border border-red-400/30 text-red-400';
      default:
        return 'bg-slate-700/50 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header con botón de volver */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
        </div>

        {/* Información del curso */}
        <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Ícono del curso */}
            <div className="flex-shrink-0">
              <div className={`bg-gradient-to-br ${config.iconGradient} p-6 rounded-xl shadow-lg w-24 h-24 flex items-center justify-center`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Detalles del curso */}
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {course.title}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Tags del curso */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg">
                  <HiClock className="w-4 h-4" />
                  <span className="text-sm font-medium">{course.duration}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getDifficultyColors(course.difficulty)}`}>
                  <HiAcademicCap className="w-4 h-4" />
                  <span className="text-sm font-medium">{difficultyMap[course.difficulty]}</span>
                </div>
                <div className={`flex items-center gap-2 ${config.badgeColor} border px-4 py-2 rounded-lg`}>
                  <HiTag className="w-4 h-4" />
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    {course.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold">
                    {typeMap[course.type]}
                  </span>
                </div>
              </div>

              {/* Precio e instructor */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="text-2xl font-bold text-green-400">
                  ${course.price}
                </div>
                <div className="text-slate-400">
                  <span className="text-sm">Por </span>
                  <span className="text-white font-semibold">
                    {course.professor?.user?.name || 'Instructor'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido del curso */}
        <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Contenido del curso</h2>
          
          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => {
                const isCompleted = completedLessons.has(lesson.id);
                const isAvailable = isLessonAvailable(lesson.id);
                const isLocked = !isAvailable && !isCompleted;
                
                return (
                  <div 
                    key={lesson.id} 
                    className={`border rounded-lg overflow-hidden ${
                      isLocked 
                        ? 'border-slate-700/30 opacity-70' 
                        : isCompleted
                        ? 'border-green-500/50'
                        : 'border-slate-600/50'
                    }`}
                  >
                    {/* Header de la lección */}
                    <button
                      onClick={() => isAvailable && toggleLesson(lesson.id)}
                      disabled={isLocked}
                      className={`w-full p-4 transition-colors flex items-center justify-between text-left ${
                        isLocked
                          ? 'bg-slate-800/10 cursor-not-allowed'
                          : 'bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold text-sm">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {isCompleted && (
                            <HiCheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {isLocked && (
                            <HiLockClosed className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                        <h3 className={`font-semibold ${
                          isLocked ? 'text-slate-500' : 'text-white'
                        }`}>
                          {lesson.title}
                          {isLocked && ' (Bloqueada)'}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">
                          {lesson.urlVideos.length + lesson.urlPdfs.length} recursos
                        </span>
                        {!isLocked && (
                          expandedLessons.has(lesson.id) ? (
                            <HiChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <HiChevronDown className="w-5 h-5 text-slate-400" />
                          )
                        )}
                      </div>
                    </button>

                  {/* Contenido de la lección (expandible) */}
                  {expandedLessons.has(lesson.id) && (
                    <div className="p-4 bg-slate-900/20 border-t border-slate-600/30">
                      {/* Videos */}
                      {lesson.urlVideos.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                            <HiPlay className="w-4 h-4" />
                            Videos ({lesson.urlVideos.length})
                          </h4>
                          <div className="space-y-2">
                            {lesson.urlVideos.map((videoUrl, videoIndex) => {
                              const fileName = getCleanFileName(videoUrl);
                              const fullFileName = getFileNameFromCloudinaryUrl(videoUrl);
                              return (
                                <a
                                  key={videoIndex}
                                  href={videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={fullFileName} // Tooltip con nombre completo
                                  className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                >
                                  <HiPlay className="w-4 h-4 text-blue-400" />
                                  <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {capitalizeFileName(fileName)}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* PDFs */}
                      {lesson.urlPdfs.length > 0 && (
                        <div>
                          <h4 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                            <HiDocumentText className="w-4 h-4" />
                            Documentos ({lesson.urlPdfs.length})
                          </h4>
                          <div className="space-y-2">
                            {lesson.urlPdfs.map((pdfUrl, pdfIndex) => {
                              const fileName = getCleanFileName(pdfUrl);
                              const fullFileName = getFileNameFromCloudinaryUrl(pdfUrl);
                              return (
                                <a
                                  key={pdfIndex}
                                  href={pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={fullFileName} // Tooltip con nombre completo
                                  className="flex items-center gap-3 p-3 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors group"
                                >
                                  <HiDocumentText className="w-4 h-4 text-red-400" />
                                  <span className="text-slate-300 group-hover:text-white transition-colors">
                                    {capitalizeFileName(fileName)}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Si no hay recursos */}
                      {lesson.urlVideos.length === 0 && lesson.urlPdfs.length === 0 && (
                        <p className="text-slate-500 text-sm">No hay recursos disponibles para esta lección.</p>
                      )}

                      {/* Checkbox de finalización */}
                      <div className="mt-6 pt-4 border-t border-slate-600/30">
                        <button
                          onClick={() => toggleLessonCompletion(lesson.id)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isCompleted
                              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                              : 'bg-slate-700/30 border border-slate-600/30 text-slate-300 hover:bg-slate-700/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isCompleted
                              ? 'border-green-500 bg-green-500'
                              : 'border-slate-400'
                          }`}>
                            {isCompleted && (
                              <HiCheckCircle className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium">
                            {isCompleted ? '✓ Lección completada' : 'Marcar lección como completada'}
                          </span>
                        </button>
                        {isCompleted && index < course.lessons.length - 1 && (
                          <p className="text-green-400/70 text-sm mt-2 ml-8">
                            🎉 ¡Excelente! Ahora puedes acceder a la siguiente lección.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">Este curso aún no tiene lecciones disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
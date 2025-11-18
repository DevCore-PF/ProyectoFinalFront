'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/UserContext';
import { lessonProgressService, ProgressResponse } from '@/services/lesson-progress.service';

interface Lesson {
  id: string;
  title: string;
}

export const useLessonProgress = (courseId: string, isCourseCreator: boolean = false, hasAccess: boolean = false) => {
  const { token } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [totalCompleted, setTotalCompleted] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchProgress = async () => {
      if (!courseId) {
        setLoading(false);
        return;
      }

      // Si no hay token o no tiene acceso al curso, inicializar con valores por defecto
      if (!token || !hasAccess) {
        setCompletedLessons([]);
        setTotalCompleted(0);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        const progress: ProgressResponse = await lessonProgressService.getCompletedLessons(
          courseId, 
          token
        );

        if (progress.lessons) {
          setCompletedLessons(progress.lessons.map(lesson => lesson.id));
          setTotalCompleted(progress.totalCompleted || 0);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching lesson progress:', err);
        setError('Error al cargar el progreso de lecciones');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, token, hasAccess]);

  
  const markLessonCompleted = async (lessonId: string) => {
    if (!token) {
      setError('Usuario no autenticado');
      return false;
    }

    try {
      await lessonProgressService.markLessonCompleted(lessonId, token);
      
      
      setCompletedLessons(prev => {
        if (!prev.includes(lessonId)) {
          const newCompleted = [...prev, lessonId];
          setTotalCompleted(newCompleted.length);
          return newCompleted;
        }
        return prev;
      });

      return true;
    } catch (err) {
      console.error('Error marking lesson as completed:', err);
      setError('Error al marcar lección como completada');
      return false;
    }
  };

  
  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  
  const isLessonEnabled = (lessonIndex: number, lessons: Lesson[]) => {
    // Si el usuario es el creador del curso, puede acceder a todas las lecciones
    if (isCourseCreator) return true;
    
    // La primera lección siempre está habilitada para visualización
    if (lessonIndex === 0) return true; 
    
    // Si no hay token, solo la primera lección está "habilitada" para expandir
    if (!token) return false;
    
    // Para usuarios logueados, verificar progreso secuencial
    if (lessons[lessonIndex - 1]) {
      return isLessonCompleted(lessons[lessonIndex - 1].id);
    }
    
    return false;
  };

  
  const isCourseCompleted = (totalLessons: number) => {
    return totalCompleted === totalLessons && totalLessons > 0;
  };

  return {
    completedLessons,
    totalCompleted,
    loading,
    error,
    markLessonCompleted,
    isLessonCompleted,
    isLessonEnabled,
    isCourseCompleted,
    setError,
  };
};
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/UserContext';
import { purchasedCoursesService, PurchasedCourse } from '@/services/purchased-courses.service';

export const usePurchasedCourses = () => {
  const { token } = useAuth();
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener información detallada de lecciones de un curso
  const getCourseWithLessonsDetail = async (course: PurchasedCourse): Promise<PurchasedCourse> => {
    if (!token) return course;
    
    try {
      // Obtener lecciones completadas
      const completedLessonsData = await purchasedCoursesService.getCompletedLessons(token, course.id);
      
      // Validar que completedLessonsData y lessons existan
      if (!completedLessonsData || !Array.isArray(completedLessonsData.lessons)) {
        return course;
      }
      
      // Crear un set de IDs de lecciones completadas para búsqueda rápida
      const completedLessonIds = new Set(
        completedLessonsData.lessons.map(lesson => lesson.id)
      );
      
      // Si el curso ya tiene lecciones del backend, actualizarlas
      const lessonsWithProgress = course.lessons && course.lessons.length > 0
        ? course.lessons.map(lesson => ({
            ...lesson,
            completed: completedLessonIds.has(lesson.id),
            completedAt: completedLessonsData.lessons.find(completedLesson => 
              completedLesson.id === lesson.id
            )?.completedAt || null
          }))
        : [];

      return {
        ...course,
        lessons: lessonsWithProgress,
        completedLessons: completedLessonsData.totalCompleted,
        // Recalcular el progreso basado en lecciones completadas vs totales
        progress: course.totalLessons && course.totalLessons > 0 
          ? (completedLessonsData.totalCompleted / course.totalLessons) * 100 
          : 0
      };
    } catch (err) {
      console.error(`Error obteniendo detalles de lecciones para curso ${course.id}:`, err);
      return course; // Devolver el curso sin detalles de lecciones si hay error
    }
  };

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Obtener cursos comprados básicos
        const courses = await purchasedCoursesService.getMyPurchasedCourses(token);
        
        // Obtener detalles de lecciones para cada curso
        const coursesWithDetails = await Promise.all(
          courses.map(course => getCourseWithLessonsDetail(course))
        );
        
        setPurchasedCourses(coursesWithDetails);
      } catch (err) {
        console.error('Error fetching purchased courses:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar cursos comprados');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedCourses();
  }, [token]);

  const refetch = async () => {
    if (!token) return;
    
    try {
      setError(null);
      const courses = await purchasedCoursesService.getMyPurchasedCourses(token);
      const coursesWithDetails = await Promise.all(
        courses.map(course => getCourseWithLessonsDetail(course))
      );
      setPurchasedCourses(coursesWithDetails);
    } catch (err) {
      console.error('Error refetching purchased courses:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar cursos comprados');
    }
  };

  return {
    purchasedCourses,
    loading,
    error,
    refetch,
    setError,
  };
};
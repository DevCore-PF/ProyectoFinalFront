import { useState, useEffect } from 'react';
import { usePurchasedCourses } from './usePurchasedCourses';
import { useLessonProgress } from './useLessonProgress';
import { Course } from '@/types/course.types';

export interface StudentMetrics {
  totalCourses: number;
  coursesInProgress: number;
  completedCourses: number;
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  weeklyProgress: number;
  weeklyGoal: number;
  loading: boolean;
  error: string | null;
}

export const useStudentMetrics = () => {
  const { purchasedCourses, loading: coursesLoading, error: coursesError } = usePurchasedCourses();
  const [metrics, setMetrics] = useState<StudentMetrics>({
    totalCourses: 0,
    coursesInProgress: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
    overallProgress: 0,
    weeklyProgress: 0,
    weeklyGoal: 75, // Meta del 75% de progreso promedio
    loading: true,
    error: null,
  });

  useEffect(() => {
    const calculateMetrics = async () => {
      if (coursesLoading || !purchasedCourses) return;
      
      try {
        let totalLessons = 0;
        let totalCompleted = 0;
        let coursesInProgress = 0;
        let completedCourses = 0;
        let progressSum = 0;

        // Calcular métricas para cada curso comprado
        for (const course of purchasedCourses) {
          const courseLessons = course.lessons?.length || 0;
          totalLessons += courseLessons;
          
          // Simular progreso del curso basado en lecciones completadas
          // En un caso real esto vendría de la API de progreso de lecciones
          let courseProgress = 0;
          
          // Si el curso tiene lecciones, calcular progreso
          if (courseLessons > 0) {
            // Simular lecciones completadas (en realidad vendría del backend)
            const mockCompletedLessons = Math.floor(Math.random() * (courseLessons + 1));
            courseProgress = (mockCompletedLessons / courseLessons) * 100;
            totalCompleted += mockCompletedLessons;
          }

          progressSum += courseProgress;

          if (courseProgress === 100) {
            completedCourses++;
          } else if (courseProgress > 0) {
            coursesInProgress++;
          }
        }

        const overallProgress = purchasedCourses.length > 0 
          ? progressSum / purchasedCourses.length 
          : 0;

        // Para el progreso semanal, usar el porcentaje real de lecciones completadas
        const weeklyProgress = totalLessons > 0 
          ? Math.round((totalCompleted / totalLessons) * 100)
          : 0;

        setMetrics({
          totalCourses: purchasedCourses.length,
          coursesInProgress,
          completedCourses,
          totalLessons,
          completedLessons: totalCompleted,
          overallProgress: Math.round(overallProgress),
          weeklyProgress,
          weeklyGoal: 75,
          loading: false,
          error: null,
        });

      } catch (error) {
        setMetrics(prev => ({
          ...prev,
          loading: false,
          error: 'Error al calcular métricas del estudiante',
        }));
      }
    };

    calculateMetrics();
  }, [purchasedCourses, coursesLoading]);

  return {
    ...metrics,
    loading: coursesLoading || metrics.loading,
    error: coursesError || metrics.error,
  };
};
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import { getProfessorCoursesService } from "@/services/course.services";
import { Course, CourseVisibility } from "@/types/course.types";

export const useProfessorCourses = () => {
  const { user, token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    if (!user?.professorProfile || typeof user.professorProfile !== "object" || !user.professorProfile.id || !token) {
      console.log("🔍 No se pueden cargar cursos:", {
        hasProfessorProfile: !!user?.professorProfile,
        isObject: typeof user?.professorProfile === "object",
        hasId: user?.professorProfile && typeof user.professorProfile === "object" ? !!user.professorProfile.id : false,
        hasToken: !!token
      });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔍 Cargando cursos del profesor:", user.professorProfile.id);
      const professorCourses = await getProfessorCoursesService(
        user.professorProfile.id,
        token
      );
      
      // Filtro adicional de seguridad: solo cursos creados por este profesor
      const currentProfessorId = user.professorProfile && typeof user.professorProfile === "object" ? user.professorProfile.id : null;
      const filteredCourses = professorCourses.filter(course => 
        course.professor && course.professor.id === currentProfessorId
      );
      
      console.log("✅ Cursos obtenidos del backend:", professorCourses);
      console.log("✅ Cursos filtrados para el profesor:", filteredCourses);
      console.log("📊 Total cursos del profesor:", filteredCourses.length);
      console.log("🔍 ID del profesor actual:", currentProfessorId);
      
      // Debug: mostrar la visibilidad de cada curso
      if (filteredCourses.length > 0) {
        console.log("🔍 Visibilidad de cada curso:", filteredCourses.map(course => ({
          courseId: course.id,
          courseTitle: course.title,
          status: course.status,
          visibility: course.visibility
        })));
      }
      
      // Debug: mostrar los IDs de profesores de los cursos obtenidos
      if (professorCourses.length > 0) {
        console.log("🔍 IDs de profesores en los cursos:", professorCourses.map(course => ({
          courseId: course.id,
          courseTitle: course.title,
          professorId: course.professor?.id
        })));
      }
      
      setCourses(filteredCourses);
    } catch (err) {
      console.error("❌ Error al cargar cursos:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar cursos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar cursos cuando el usuario y token estén disponibles
  useEffect(() => {
    loadCourses();
  }, [user?.professorProfile && typeof user.professorProfile === "object" ? user.professorProfile.id : null, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshCourses = () => {
    loadCourses();
  };

  // Función para actualizar la visibilidad de un curso específico sin refetch
  const updateCourseVisibility = (courseId: string, newVisibility: CourseVisibility) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, visibility: newVisibility }
          : course
      )
    );
  };

  return {
    courses,
    isLoading,
    error,
    refreshCourses,
    updateCourseVisibility,
    hasCourses: courses.length > 0,
  };
};
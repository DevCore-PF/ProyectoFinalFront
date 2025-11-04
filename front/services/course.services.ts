const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

import { 
  CreateCourseFormData, 
  CreateLessonFormData, 
  CreateCourseResponse, 
  CreateLessonResponse,
  Course 
} from "@/types/course.types";

/**
 * Crear un nuevo curso
 */
export const createCourseService = async (
  professorId: string,
  courseData: CreateCourseFormData,
  token: string
): Promise<CreateCourseResponse> => {
  try {
    const response = await fetch(`${API_URL}/courses/${professorId}/create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        title: courseData.title,
        description: courseData.description,
        price: courseData.price.toString(),
        duration: courseData.duration,
        difficulty: courseData.difficulty,
        category: courseData.category,
        type: courseData.type,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear el curso");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear curso:", error);
    throw error;
  }
};

/**
 * Agregar lección a un curso
 */
export const createLessonService = async (
  courseId: string,
  lessonData: CreateLessonFormData,
  token: string
): Promise<CreateLessonResponse> => {
  try {
    const formData = new FormData();
    
    // Agregar título de la lección
    formData.append('title', lessonData.title);
    
    // Agregar videos
    lessonData.videos.forEach((video) => {
      formData.append('videos', video);
    });
    
    // Agregar PDFs
    lessonData.pdfs.forEach((pdf) => {
      formData.append('pdfs', pdf);
    });

    const response = await fetch(`${API_URL}/courses/${courseId}/lessons`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // No incluir Content-Type para FormData - el browser lo configura automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al crear la lección");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al crear lección:", error);
    throw error;
  }
};

/**
 * Obtener cursos del profesor
 */
export const getProfessorCoursesService = async (
  professorId: string,
  token: string
): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_URL}/courses?professor=${professorId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener cursos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
};

/**
 * Obtener todos los cursos públicos
 */
export const getAllCoursesService = async (): Promise<Course[]> => {
  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener cursos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    throw error;
  }
};

/**
 * Obtener curso por ID
 */
export const getCourseByIdService = async (
  courseId: string,
  token?: string
): Promise<Course> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener curso");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener curso:", error);
    throw error;
  }
};
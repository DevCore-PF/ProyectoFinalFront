import { Course } from "@/types/course.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obtener todos los cursos públicos (para la página /courses)
export const getAllPublicCoursesService = async (): Promise<Course[]> => {
  try {
    const data = await fetch(`${API_URL}/courses/public`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.ok) {
      throw new Error("Hubo un problema al obtener los cursos públicos");
    }

    const response = await data.json();
    return response;
  } catch (error) {
    console.error("Error con la lista de cursos públicos: ", error);
    throw error;
  }
};

// Obtener todos los cursos (para admin/teacher dashboard)
export const getAllCoursesService = async (): Promise<Course[]> => {
  try {
    const data = await fetch(`${API_URL}/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!data.ok) {
      throw new Error("Hubo un problema al obtener los cursos");
    }

    const response = await data.json();
    return response;
  } catch (error) {
    console.error("Error con la lista de cursos: ", error);
    throw error;
  }
};

export const getTeacherCoursesService = async (
  professorId: string
): Promise<Course[]> => {
  try {
    const allCourses = await getAllCoursesService();

    const teacherCourses = allCourses.filter(
      (course) => course.professor?.id === professorId
    );

    return teacherCourses;
  } catch (error) {
    console.error("Error in getTeacherCoursesService:", error);
    throw error;
  }
};

export const enrollmentService = {
  getMyEnrollments: async (token: string) => {
    const response = await fetch(
      `${API_URL}/enrollments/my-enrollments`, // Ajusta la ruta según tu backend
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener cursos");
    }

    return response.json();
  },

  hasEnrollment: async (token: string, courseId: string) => {
    const response = await fetch(`${API_URL}/enrollments/check/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al verificar curso");
    }

    return response.json();
  },
};

// const API_URL = "/api";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const getAllCoursesService = async () => {
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


export const enrollmentService = {
  getMyEnrollments: async (token: string) => {
    const response = await fetch(
      `${API_URL}/enrollments/my-enrollments`, // Ajusta la ruta según tu backend
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener cursos');
    }

    return response.json();
  },

  hasEnrollment: async (token: string, courseId: string) => {
    const response = await fetch(
      `${API_URL}/enrollments/check/${courseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al verificar curso');
    }

    return response.json();
  }
};
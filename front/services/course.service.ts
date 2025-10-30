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
      const errorText = await data.text(); // Cambia a .text() primero
      console.error("Response error:", errorText);
      throw new Error("Hubo un problema al obtener los cursos");
    }

    const response = await data.json();
    console.log("esta es mi data de cursos", response);
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
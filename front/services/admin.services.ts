import { CourseFilters, GetAllCoursesAdminParams } from "@/types/admin.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUsersService = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getActiveUsersService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios activos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getInactiveUsersService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/inactive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener usuarios activos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserByIdService = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al conseguir usuario por id");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deactivateUserService = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messege || "Error al benear usurio");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      const text = await response.text();
      return { message: text };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activateUserService = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/activate/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.messge || "Error al activar usuario");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const activateDeactivateCourseService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar estado de curso");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const changeVisivilityService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/courses/change/visibility/${courseId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al cambiar estado de curso");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCourseFeedbackService = async (
  token: string,
  courseId: string
) => {
  try {
    const response = await fetch(
      `${API_URL}/course-feedback/${courseId}/feedbacks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener feedback");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCoursesAdminService = async (
  token: string,
  params?: GetAllCoursesAdminParams
) => {
  try {
    // Construir los query parameters
    const queryParams = new URLSearchParams();

    if (params?.title) {
      queryParams.append("title", params.title);
    }
    if (params?.category) {
      queryParams.append("category", params.category);
    }
    if (params?.difficulty) {
      queryParams.append("difficulty", params.difficulty);
    }
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }
    if (params?.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }

    const response = await fetch(
      `${API_URL}/courses/admin${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener cursos desde admin");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const getProfessorCourses = async (token: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/profiles/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener cursos del profesor");
    }
    const data = await response.json();
    console.log("esta es la respuesta de cursos del profe", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

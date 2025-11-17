import { CourseFilters } from "@/types/admin.types";

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
  // /course-feedback/{courseId}/feedbacks
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

export const filterCoursesService = async (filters: CourseFilters = {}) => {
  const { title, category, difficulty } = filters;

  const params = new URLSearchParams();

  if (title) params.append("title", title);
  if (category) params.append("category", category);
  if (difficulty) params.append("difficulty", difficulty);

  const query = params.toString();
  const url = query ? `/api/courses?${query}` : `/api/courses`;

  const response = await fetch(url, { method: "GET" });
  if (!response.ok) throw new Error("Error al obtener los cursos");

  return await response.json();
};

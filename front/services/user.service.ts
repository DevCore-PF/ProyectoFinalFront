const API_URL = process.env.NEXT_PUBLIC_API_URL;
//Types

import { RegisterResponse, LoginResponse } from "@/types/auth.types";

import { RegisterFormData, LoginFormData } from "@/types/auth.types";
import {
  UploadImageResponse,
  UserUpdateResponse,
  UpdateUserFormData,
  UpdateRoleResponse,
  User,
} from "@/types/user.types";

export const registerUserService = async (
  values: RegisterFormData
): Promise<RegisterResponse> => {
  try {
    const data = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!data.ok) {
      let errorMessage = "Error en el registro";
      try {
        const error = await data.json();
        errorMessage = error.message || errorMessage;
      } catch (jsonError) {
        // Si no es JSON válido, usar el status text
        errorMessage = `Error en el registro: ${data.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const response = await data.json();
    return response;
  } catch (error) {
    console.error("Error al registrar: ", error);
    // Re-lanzar el error para que sea capturado en el componente
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error desconocido en el registro");
  }
};

export const loginUserService = async (
  values: LoginFormData
): Promise<LoginResponse> => {
  try {
    const data = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!data.ok) {
      let errorMessage = "Error en el login";
      try {
        const error = await data.json();
        errorMessage = error.message || errorMessage;
      } catch (jsonError) {
        // Si no es JSON válido, usar el status text
        errorMessage = `Error en el login: ${data.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const response = await data.json();
    return response;
  } catch (error) {
    console.error("Error al loguearse: ", error);
    // Re-lanzar el error para que sea capturado en el componente
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error desconocido en el login");
  }
};

export const getCurrentUserService = async (
  token: string,
  id: number | string
) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error obteniendo usuario");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al conseguir el servicio atual: ", error);
    throw error;
  }
};

export const updateCheckboxService = async (token: string, id: string) => {
  try {
    const data = await fetch(`${API_URL}/users/checkbox/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "applicaction/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!data.ok) {
      const error = await data.json();
      throw new Error(error.message || "Error al seleccionar el rol");
    }
    const response = await data.json();

    return response;
  } catch (error) {
    console.error("Error al acutalizar checkbox:", error);
    throw error;
  }
};

export const updateRoleService = async (
  role: string,
  token: string
): Promise<UpdateRoleResponse> => {
  try {
    const data = await fetch(`${API_URL}/auth/select-role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({ role }),
    });
    if (!data.ok) {
      const error = await data.json();
      throw new Error(error.message || "Error al seleccionar el rol");
    }
    const response = await data.json();

    return response;
  } catch (error) {
    console.error("Error al actualizar rol:", error);
    throw error;
  }
};

export const uploadProfileImageService = async (
  userId: string,
  imageFile: File,
  token: string
): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch(`${API_URL}/users/${userId}/upload/profile`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = "Error al subir la imagen";
      try {
        const error = await response.json();
        errorMessage = error.message || error.error || errorMessage;
        console.error("Error del servidor:", error);
      } catch {
        const textError = await response.text();
        console.error("Respuesta del servidor:", textError);
        errorMessage = `Error ${response.status}: ${textError}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();


    // Intenta extraer la URL de diferentes posibles campos
    let imageUrl =
      data.secure_url ||
      data.imageUrl ||
      data.profileImage ||
      data.image ||
      data.url ||
      data.data?.profileImage ||
      data.data?.image ||
      data.data?.url ||
      data.user?.profileImage ||
      data.user?.image;

    // Si no se encuentra la URL en la respuesta, obtener datos actualizados del usuario
    if (!imageUrl) {
      // No URL found in response, getting updated user data
      try {
        const updatedUserData = await getCurrentUserService(token, userId);
        // User data updated successfully

        // Buscar la imagen en los datos actualizados
        const updatedUserWithImage = updatedUserData as User & {
          image?: string;
          profileImageUrl?: string;
        };
        imageUrl =
          updatedUserData.profileImage ||
          updatedUserWithImage.image ||
          updatedUserWithImage.profileImageUrl;

        if (imageUrl) {
          // Image URL found in updated data
        }
      } catch (fetchError) {
        console.error("Error obteniendo datos actualizados:", fetchError);
      }
    }

    // Si aún no tenemos URL, usar un placeholder temporal
    if (!imageUrl) {
      console.warn(
        "⚠️ No se pudo obtener URL de imagen, usando timestamp como indicador"
      );
      // Usar un indicador para que el frontend sepa que debe refrescar los datos del usuario
      imageUrl = `refresh_user_data_${Date.now()}`;
    }

    return {
      success: true,
      imageUrl: imageUrl,
      message: data.message || "Imagen subida correctamente",
    };
  } catch (error) {
    console.error("Error al subir imagen:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Error de conexión con el servidor. Verifica tu conexión a internet."
      );
    }

    throw error;
  }
};

//

export const getUserProfileService = async (
  userId: string,
  token: string
): Promise<UserUpdateResponse> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el perfil");
    }

    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error;
  }
};

export const updateUserProfileService = async (
  data: UpdateUserFormData,
  token: string
): Promise<UserUpdateResponse | undefined> => {
  try {
    const response = await fetch(`${API_URL}/users/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al actualizar el perfil");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
  }
};

export const resendEmailService = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Error al reenviar el email de verificación"
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error al reenviar verificacion", error);
    throw error;
  }
};
// /
export const getCoursesByIdServices = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/users/me/purchased-courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al recibir los cursos comprados");
    }
    const data = response.json();
    return data;
  } catch (error) {
    console.log("Error al reenviar verificacion", error);
    throw error;
  }
};

export const logoutService = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error("Error triggering abandoned cart emails");
    }
    const data = response.json();
    
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

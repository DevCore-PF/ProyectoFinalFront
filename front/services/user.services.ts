const API_URL = "/api";
//Types
import { RegisterResponse } from "@/types/api.types";
import { RegisterFormData, LoginFormData } from "@/types/auth.types";
import { UploadImageResponse, UserUpdateResponse } from "@/types/user.types";

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
      const error = await data.json();
      throw new Error(error.message || "Error en el registro");
    }

    console.log("esta es data", data);
    const response = await data.json();
    console.log("esta es response", response);

    return response;
  } catch (error) {
    console.error("Error al registrar: ", error);
    throw error;
  }
};

export const loginUserService = async (values: LoginFormData) => {
  try {
    const data = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!data.ok) {
      const error = await data.json();
      throw new Error(error.message || "Error en el login");
    }

    const response = await data.json();
    return response;
  } catch (error) {
    console.error("Error al loguearse: ", error);
    throw error;
  }
};
export const getCurrentUserService = async (token: string, id: number) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error obteniendo usuario");
    }
    return response.json();
  } catch (error) {
    console.error("Error al conseguir el servicio atual: ", error);
    throw error;
  }
};

export const updateRoleService = async (role: string, token: string) => {
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
    console.error("Error al registrar:", error);
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
      } catch (parseError) {
        const textError = await response.text();
        console.error("Respuesta del servidor:", textError);
        errorMessage = `Error ${response.status}: ${textError}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // 🔍 LOG PARA VER QUÉ DEVUELVE EL BACKEND
    console.log("Respuesta completa del backend:", data);

    // Intenta extraer la URL de diferentes posibles campos
    const imageUrl =
      data.secure_url ||
      data.imageUrl ||
      data.profileImage ||
      data.image ||
      data.url ||
      data.data?.profileImage ||
      data.data?.image ||
      data.data?.url;

    if (!imageUrl) {
      console.error(
        "No se encontró URL en la respuesta. Estructura completa:",
        JSON.stringify(data, null, 2)
      );
      throw new Error("No se recibió la URL de la imagen del servidor");
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

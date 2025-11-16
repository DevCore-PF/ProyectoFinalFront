//Types
import { UserUpdateResponse } from "@/types/user.types";
import Cookies from "js-cookie";
export const updateUserInSession = (updatedUser: UserUpdateResponse): void => {
  try {
    // Normalizar la imagen de perfil antes de guardar
    const userWithImage = updatedUser as UserUpdateResponse & {
      image?: string;
    };
    const normalizedUser = {
      ...updatedUser,
      profileImage: updatedUser.profileImage || userWithImage.image,
    };

    sessionStorage.setItem("user", JSON.stringify(normalizedUser));
    sessionStorage.setItem("userTimestamp", Date.now().toString());
 
  } catch (error) {
    console.error("Error al actualizar SessionStorage:", error);
  }
};

export const removeUserFromSession = (): void => {
  try {
    sessionStorage.removeItem("user");
  } catch (error) {
    console.error("Error al eliminar usuario de sesión:", error);
  }
};

export const removeTokenFromSession = (): void => {
  try {
    sessionStorage.removeItem("token");
  } catch (error) {
    console.error("Error al eliminar token:", error);
  }
};
export const removeTimestampFromSession = (): void => {
  try {
    sessionStorage.removeItem("userTimestamp");
  } catch (error) {
    console.error("Error al eliminar timestamp:", error);
  }
};

export const clearSession = (): void => {
  try {
    removeUserFromSession();
    removeTokenFromSession();
    removeTimestampFromSession();

    Cookies.remove("auth-token");
  } catch (error) {
    console.error("Error al limpiar sesión:", error);
  }
};

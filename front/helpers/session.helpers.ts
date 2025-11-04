//Types
import { UserUpdateResponse } from "@/types/user.types";

export const updateUserInSession = (updatedUser: UserUpdateResponse): void => {
  try {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
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

export const clearSession = (): void => {
  try {
    removeUserFromSession();
    removeTokenFromSession();
  } catch (error) {
    console.error("Error al limpiar sesión:", error);
  }
};
// ////////////////////////////////////////////////////////////

// export const saveUserToSession = (user): void => {
//   try {
//     sessionStorage.setItem("user", JSON.stringify(user));
//   } catch (error) {
//     console.error("Error al guardar usuario en sesión:", error);
//   }
// };

// export const getUserFromSession = () => {
//   try {
//     const userData = sessionStorage.getItem("user");
//     return userData ? JSON.parse(userData) : null;
//   } catch (error) {
//     console.error("Error al obtener usuario de sesión:", error);
//     return null;
//   }
// };

// export const saveTokenToSession = (token: string): void => {
//   try {
//     sessionStorage.setItem("token", token);
//   } catch (error) {
//     console.error("Error al guardar token:", error);
//   }
// };

// export const getTokenFromSession = (): string | null => {
//   try {
//     return sessionStorage.getItem("token");
//   } catch (error) {
//     console.error("Error al obtener token:", error);
//     return null;
//   }
// };

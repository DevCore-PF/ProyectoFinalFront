const API_URL = "http://localhost:3001";
import { registerType } from "../validators/registerSchema";

export const registerUser = async (values: registerType) => {
  try {
    const data = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(values),
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.password,
      }),
    });
    if (!data.ok) {
      const error = await data.json();
      throw new Error(error.message || "Error en el registro");
    }
    return data.json();
  } catch (error) {
    console.error("Error al registrar:", error);
    throw error;
  }
};

interface RoleSelectionPayload {
  role: string;
}

export const selectUserRole = async (
  role: string,
  token: string
): Promise<boolean> => {
  if (!token) {
    throw new Error("Token de autenticación no proporcionado.");
  }

  const payload: RoleSelectionPayload = { role };

  try {
    const response = await fetch(`${API_URL}/auth/select-role`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      const errorMessage =
        errorData.message ||
        `Error del servidor: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Error en selectUserRole:", error);
    throw new Error(`Fallo en la conexión: ${(error as Error).message}`);
  }
};

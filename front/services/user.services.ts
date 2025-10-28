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

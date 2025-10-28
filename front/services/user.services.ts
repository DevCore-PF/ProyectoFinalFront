const API_URL = "/api";
import { LoginType } from "@/validators/loginSchema";
import { RegisterResponse, RegisterType } from "../validators/registerSchema";

export const registerUserService = async (
  values: RegisterType
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

export const loginUserService = async (values: LoginType) => {
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
// {
// esto devuelve login
//   "user": {
//     "id": "8f394f59-f0f6-472b-ae58-031f757c76e1",
//     "email": "lauramussa94@gmail.com",
//     "name": "Laura Daniela ",
//     "role": "student",
//     "hasCompletedProfile": false
//   },
//   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZjM5NGY1OS1mMGY2LTQ3MmItYWU1OC0wMzFmNzU3Yzc2ZTEiLCJlbWFpbCI6ImxhdXJhbXVzc2E5NEBnbWFpbC5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc2MTY2NzM3MSwiZXhwIjoxNzYxNjcwOTcxfQ.iQlKP8K54nXBh8TYbg5yTE7qWgTFxW870hlncfPv57I"
// }

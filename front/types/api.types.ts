
//AGREGAR RESPUESTAS FALTANTES

export interface RegisterResponse {
  access_token: string;
  user: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
    isEmailVerified: false;
  };
}
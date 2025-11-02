
//AGREGAR RESPUESTAS FALTANTES

export interface RegisterResponse {
  access_token: string;
  userReturn: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
    isEmailVerified: boolean;
    profileImage?: string;
  };
}

export interface LoginResponse {
  access_token: string;
  userReturn: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
    isEmailVerified: boolean;
    profileImage?: string;
  };
}

export interface UpdateRoleResponse {
  access_token?: string;
  userReturn: {
    email: string;
    hasCompletedProfile: boolean;
    id: string;
    name: string;
    role: "student" | "teacher" | "admin" | null;
    isEmailVerified: boolean;
    profileImage?: string;
  };
}
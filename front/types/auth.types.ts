import { ProfessorProfile } from "./api.types";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  checkBoxTerms: boolean;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
export interface User {
  email: string;
  hasCompletedProfile: boolean;
  id: string | number;
  name: string;
  role: "student" | "teacher" | "admin" | null;
  isEmailVerified: false;
  resetPasswordToken: null;
  resetPasswordExpires: null;
  checkBoxTerms: boolean;
  emailVerificationToken: string;
  googleId: null;
  image: null;
  isActive: boolean;
  isGoogleAccount: false;
  isGitAcocount: false;
  professorProfile?: ProfessorProfile | false;
  profileImage?: string;
}

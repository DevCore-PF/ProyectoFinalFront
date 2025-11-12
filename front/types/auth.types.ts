// import { ProfessorProfile } from "./api.types";
// import { Course } from "./course.types";

// export interface LoginFormData {
//   email: string;
//   password: string;
// }

// export interface RegisterFormData {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   checkBoxTerms: boolean;
// }

// export interface JwtPayload {
//   sub: string;
//   email: string;
//   role: string;
//   iat: number;
//   exp: number;
// }
// export enum ValidationStatus {
//   Peding = "pending",
//   Aproved = "approved",
//   Rejected = "rejected",
// }
// export enum UserValidationStatus {}
// export interface User {
//   email: string;
//   hasCompletedProfile: boolean;
//   id: string;
//   name: string;
//   role: "student" | "teacher" | "admin" | null;
//   isEmailVerified: false;
//   resetPasswordToken: null;
//   resetPasswordExpires: null;
//   checkBoxTerms: boolean;
//   emailVerificationToken: string;
//   googleId: null;
//   isActive: boolean;
//   isGoogleAccount: false;
//   isGitAcocount: false;
//   professorProfile?: ProfessorProfile | false;
//   profileImage?: string;
//   createdAt: string;
//   enrollments: {
//     courseList: Course[];
//   };
// }
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
  id: string ;
  name: string;
  role: "student" | "teacher" | "admin" | null;
  isEmailVerified: false;
  resetPasswordToken: null;
  resetPasswordExpires: null;
  checkBoxTerms: boolean;
  emailVerificationToken: string;
  googleId: null;
  isActive: boolean;
  isGoogleAccount: false;
  isGitAcocount: false;
  professorProfile?: ProfessorProfile | false;
  profileImage?: string;
  // Nuevos campos opcionales
  ciudad?: string;
  direccion?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  genero?: "masculino" | "femenino" | "otro";

export interface LoginResponse {
  access_token: string;
  userReturn: User;
}

export interface RegisterResponse {
  access_token: string;
  userReturn: User;
}

import { User } from "./user.types";
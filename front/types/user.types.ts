import { Course } from "./course.types";
import Image from "next/image";
import { ProfessorProfile } from "./professor.types";
export type UserRole = "student" | "teacher" | "admin";
export interface User {
  id: string;
  name: string;
  email: string;
  // Campos adicionales del perfil
  ciudad?: string;
  direccion?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  genero?: "masculino" | "femenino" | "otro";
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  checkBoxTerms: boolean;
  hasCompletedProfile: boolean;
  profileImage?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  emailVerificationToken?: string;
  googleId?: string | null;
  isGoogleAccount: boolean;
  isGitHubAccount: boolean;
  createdAt: string;
  updatedAt?: string;
  enrollments: {
    courseList: [];
  };
  professorProfile: ProfessorProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  address?: string;
  // Nuevos campos opcionales
  ciudad?: string;
  direccion?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  genero?: "masculino" | "femenino" | "otro";
}

export interface UpdateUserFormData {
  ciudad?: string;
  direccion?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: "masculino" | "femenino" | "otro";
}

export interface UserUpdateResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  // Campos adicionales del perfil
  ciudad?: string;
  direccion?: string;
  dni?: string;
  telefono?: string;
  fechaNacimiento?: string | Date;
  genero?: "masculino" | "femenino" | "otro";
}

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

export interface UpdateRoleResponse {
  access_token?: string;
  userReturn: User;
}

// Dashboard Cards Types
export interface RecommendedCourse {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: string;
}

export interface RecommendedCourseProps {
  courses: RecommendedCourse[];
}

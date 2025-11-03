//AGREGAR RESPUESTAS FALTANTES

import { User } from "./auth.types";

// Enum para estado de aprobación de profesores
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Interface para perfil de profesor
export interface ProfessorProfile {
  id: string;
  phone?: string;
  profession: string;
  specialty: string;
  biography?: string;
  certificates: string[];
  professionalLinks?: string[];
  agreedToTerms: boolean;
  agreedToInfo: boolean;
  agreedToAproveed: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Interface extendida para Usuario con perfil de profesor
export interface UserWithProfile {
  email: string;
  hasCompletedProfile: boolean;
  id: string;
  name: string;
  role: "student" | "teacher" | "admin" | null;
  isEmailVerified: boolean;
  profileImage?: string;
  professorProfile?: ProfessorProfile;
}

export interface RegisterResponse {
  access_token: string;
  userReturn: User;
}

export interface LoginResponse {
  access_token: string;
  userReturn: UserWithProfile;
}

export interface UpdateRoleResponse {
  access_token?: string;
  userReturn: UserWithProfile;
}

// DTOs para formulario de profesor
export interface CreateProfessorProfileDto {
  phone?: string;
  profession: string;
  speciality: string; // Note: backend usa 'speciality' no 'specialty'
  biography?: string;
  certificates: File[];
  professionalLinks?: string[];
  agreedToTerms: boolean;
  agreedToInfo: boolean;
  agreedToAproveed: boolean;
}

// Response al crear/actualizar perfil de profesor
export interface ProfessorProfileResponse {
  id: string;
  phone?: string;
  profession: string;
  specialty: string;
  biography?: string;
  certificates: string[];
  professionalLinks?: string[];
  agreedToTerms: boolean;
  agreedToInfo: boolean;
  agreedToAproveed: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

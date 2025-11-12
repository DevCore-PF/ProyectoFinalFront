
// import { User } from "./auth.types";

// // Enum para estado de aprobación de profesores
// export enum ApprovalStatus {
//   PENDING = "pending",
//   APPROVED = "approved",
//   REJECTED = "rejected",
// }

// // Interface para perfil de profesor
// export interface ProfessorProfile {
//   id: string;
//   phone?: string;
//   profession: string;
//   speciality: string;
//   biography?: string;
//   certificates: string[];
//   professionalLinks?: string[];
//   agreedToTerms: boolean;
//   agreedToInfo: boolean;
//   agreedToAproveed: boolean;
//   approvalStatus: ApprovalStatus;
//   createdAt: Date;
//   updatedAt: Date;
// }


// export interface RegisterResponse {
//   access_token: string;
//   userReturn: User;
// }

// export interface LoginResponse {
//   access_token: string;
//   userReturn: User;
// }

// export interface UpdateRoleResponse {
//   access_token?: string;
//   userReturn: User;
// }

// // DTOs para formulario de profesor
// export interface CreateProfessorProfileDto {
//   phone?: string;
//   profession: string;
//   speciality: string; 
//   biography?: string;
//   certificates: File[];
//   professionalLinks?: string[];
//   agreedToTerms: boolean;
//   agreedToInfo: boolean;
//   agreedToAproveed: boolean;
// }

// // Response al crear/actualizar perfil de profesor
// export interface ProfessorProfileResponse {
//   id: string;
//   phone?: string;
//   profession: string;
//   speciality: string;
//   biography?: string;
//   certificates: string[];
//   professionalLinks?: string[];
//   agreedToTerms: boolean;
//   agreedToInfo: boolean;
//   agreedToAproveed: boolean;
//   approvalStatus: ApprovalStatus;
//   createdAt: Date;
//   updatedAt: Date;
// }

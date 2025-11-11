// Enums
export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum ValidationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  NOT_SUBMITTED = "not-submitted",
}

// Professor Profile
export interface ProfessorProfile {
  id: string;
  phone?: string;
  profession: string;
  speciality: string;
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

// Validation Status
export interface TeacherValidationStatus {
  isValidated: boolean;
  status: ValidationStatus;
  hasCompletedProfile: boolean;
  canCreateCourses: boolean;
  message: string;
}

// Validation Context
export interface ValidationContextState {
  validationStatus: TeacherValidationStatus | null;
  isLoading: boolean;
  error: string | null;
}

// Validation Messages
export interface ValidationMessage {
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

// Component Props
export interface ValidationMessageProps {
  status: ValidationStatus;
  className?: string;
  onActionClick?: () => void;
}

export interface ValidationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

// Form Data
export interface ProfessionalFormData {
  phone: string;
  profession: string;
  speciality: string;
  biography: string;
  certificates: (File | null)[];
  professionalLinks: string[];
  agreedToTerms: boolean;
  agreedToInfo: boolean;
  agreedToAproveed: boolean;
}

// DTOs
export interface CreateProfessorProfileDto {
  phone?: string;
  profession: string;
  speciality: string;
  biography?: string;
  certificates: File[];
  professionalLinks?: string[];
  agreedToTerms: boolean;
  agreedToInfo: boolean;
  agreedToAproveed: boolean;
}

// API Responses
export interface ProfessorProfileResponse {
  id: string;
  phone?: string;
  profession: string;
  speciality: string;
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

// Service State
export interface ValidationServiceState {
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
}
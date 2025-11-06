// Tipos específicos para validación de profesores

export interface TeacherValidationStatus {
  isValidated: boolean;
  status: "pending" | "approved" | "rejected" | "not-submitted";
  hasCompletedProfile: boolean;
  canCreateCourses: boolean;
  message: string;
}

// Interface para el estado del contexto de validación
export interface ValidationContextState {
  validationStatus: TeacherValidationStatus | null;
  isLoading: boolean;
  error: string | null;
}

// Tipos para mensajes de validación
export interface ValidationMessage {
  type: "success" | "warning" | "error" | "info";
  title: string;
  description: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

// Props para componentes de validación
export interface ValidationMessageProps {
  status: "approved" | "pending" | "rejected" | "not-submitted";
  className?: string;
  onActionClick?: () => void;
}

export interface ValidationFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting?: boolean;
  className?: string;
}

// Tipos para el formulario de validación profesional
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

// Estados de carga para servicios
export interface ValidationServiceState {
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
}

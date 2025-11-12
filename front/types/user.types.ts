import { ReactNode } from "react";

export interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
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

export interface UserProfile {
  id: string ;
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

///////CARDS DE DASHBOARD DE USUARIO ALUMNO
export interface ProgressItem {
  id: string | number;
  name: string;
  progress: number;
}

export interface ProgressCardProps {
  title: string;
  progressItems: ProgressItem[];
}

export interface QuickAccessItem {
  id: string | number;
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export interface QuickAccessCardProps {
  items: QuickAccessItem[];
}

export interface RecomendedCourse {
  id: string;
  name: string;
  description: string;
  duration: string;
  rating: string;
}

export interface RecomendedCoursePorps {
  courses: RecomendedCourse[];
}

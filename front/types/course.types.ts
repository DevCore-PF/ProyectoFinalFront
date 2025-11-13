// Enums
export enum CourseDifficulty {
  BEGINNER = "PRINCIPIANTE",
  INTERMEDIATE = "INTERMEDIO",
  ADVANCED = "AVANZADO",
}

export enum CourseCategory {
  FRONTEND = "Front End",
  BACKEND = "Backend",
  DATA_SCIENCE = "Data Science",
  DATABASE = "Database",
  VIDEO_GAMES = "Video Games",
  MOBILE_DEVELOPMENT = "Mobile Development",
}

export enum CourseStatus {
  DRAFT = "EN REVISION",
  PUBLISHED = "PUBLICADO",
  REJECT = "RECHAZADO",
}

export enum CourseVisibility {
  PUBLIC = "PUBLICO",
  PRIVATE = "PRIVADO"
}
export interface CourseCardProps {
  course: Course;
  viewDetails: (id: string) => void;
}

export enum CourseType {
  COURSE = "Curso",
  CAREER = "Carrera",
}

// Main Interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  difficulty: CourseDifficulty;
  category: CourseCategory;
  type: CourseType;
  status: CourseStatus;
  visibility: CourseVisibility;
  createdAt: string;
  updatedAt: string;
  professor: ProfessorInfo;
  lessons: Lesson[];
  isActive: boolean;
  feedback: CourseReview;
  // Datos adicionales para admin
  sales?: number;
  revenue?: number;
  rating?: number;
}
// export enum Visibility {
//   PUBLICO = "PUBLICO",
//   PRIVADO = "PRIVADO",
// }
export interface CourseReview {
  id: string;
  rating: number; /////del 1 al 5 porque son estrellitas
  feedback: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}
export interface ProfessorInfo {
  id: string;
  profession: string;
  speciality: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  urlVideos: string[];
  urlPdfs: string[];
  aditionalData?: string[];
  createdAt: string;
  updatedAt: string;
}

// Form Data
export interface CreateCourseFormData {
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: CourseDifficulty;
  category: CourseCategory;
  type: CourseType;
}

export interface CreateLessonFormData {
  title: string;
  videos: File[];
  pdfs: File[];
}

// API Responses
export interface CreateCourseResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: CourseDifficulty;
  category: CourseCategory;
  type: CourseType;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonResponse {
  id: string;
  title: string;
  urlVideos: string[];
  urlPdfs: string[];
  aditionalData?: string[];
  createdAt: string;
  updatedAt: string;
}

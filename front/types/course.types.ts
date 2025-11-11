
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

export enum CourseType {
  COURSE = "Curso",
  CAREER = "Carrera",
}

export enum CourseStatus {
  REJECTED = "RECHAZADO",
  IN_REVIEW = "EN REVISION",
  PUBLISHED = "PUBLICADO",
}

// Main Interfaces
export interface Course {
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
  professor: ProfessorInfo;
  lessons: Lesson[];
  // Datos adicionales para admin
  sales?: number;
  revenue?: number;
  rating?: number;
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
  createdAt: string;
  updatedAt: string;
}
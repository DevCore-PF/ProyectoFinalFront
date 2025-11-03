// Enums que coinciden con el backend
export enum CourseDifficulty {
  BEGINNER = 'PRINCIPIANTE',
  INTERMEDIATE = 'INTERMEDIO',
  ADVANCED = 'AVANZADO'
}

export enum CourseCategory {
  FRONTEND = 'Front End',
  BACKEND = 'Backend',
  DATA_SCIENCE = 'Data Science',
  DATABASE = 'Database',
  VIDEO_GAMES = 'Video Games',
  MOBILE_DEVELOPMENT = 'Mobile Development'
}

export enum CourseType {
  COURSE = 'Curso',
  CAREER = 'Carrera'
}

export enum CourseStatus {
  DRAFT = 'EN REVISION',
  PUBLISHED = 'PUBLICADO'
}

// Interfaces para formularios
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

// Interfaces para respuestas del backend
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
  professor: {
    id: string;
    profession: string;
    specialty: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  urlVideos: string[];
  urlPdfs: string[];
  createdAt: string;
  updatedAt: string;
}

// Respuestas de la API
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
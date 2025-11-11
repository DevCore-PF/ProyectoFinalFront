// import { ReactNode } from "react";

// export interface UploadImageResponse {
//   success: boolean;
//   imageUrl: string;
//   message: string;
// }

// export interface UserUpdateResponse {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   profileImage?: string;
// }

// export interface UserProfile {
//   id: string ;
//   name: string;
//   email: string;
//   role: string;
//   profileImage?: string;
//   phone?: string;
//   address?: string;
// }

// ///////CARDS DE DASHBOARD DE USUARIO ALUMNO
// export interface ProgressItem {
//   id: string | number;
//   name: string;
//   progress: number;
// }

// export interface ProgressCardProps {
//   title: string;
//   progressItems: ProgressItem[];
// }

// export interface QuickAccessItem {
//   id: string | number;
//   title: string;
//   description: string;
//   icon: ReactNode;
//   onClick: () => void;
// }

// export interface QuickAccessCardProps {
//   items: QuickAccessItem[];
// }

// export interface RecomendedCourse {
//   id: string;
//   name: string;
//   description: string;
//   duration: string;
//   rating: string;
// }

// export interface RecomendedCoursePorps {
//   courses: RecomendedCourse[];
// }
import { Course } from "./course.types";
import Image from "next/image";
export type UserRole = "student" | "teacher" | "admin";
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  checkBoxTerms: boolean;
  hasCompletedProfile: boolean;
  image?: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  emailVerificationToken?: string;
  googleId?: string | null;
  isGoogleAccount: boolean;
  isGitAcocount: boolean;
  createdAt: string;
  updatedAt?: string;
  enrollments: {
    courseList: [];
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  phone?: string;
  address?: string;
}

export interface UserUpdateResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
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
  icon: React.ReactNode;
  onClick: () => void;
}

export interface QuickAccessCardProps {
  items: QuickAccessItem[];
}

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

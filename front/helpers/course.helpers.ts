import {
  FaCode,
  FaDatabase,
  FaMobileAlt,
  FaGamepad,
  FaServer,
  FaChartBar,
} from "react-icons/fa";
import { CourseCategory } from "@/types/course.types";

// Configuración de categorías que coincide exactamente con /courses
export const categoryConfig = {
  [CourseCategory.FRONTEND]: {
    icon: FaCode,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-500/10 border-blue-500/30",
    textColor: "text-blue-300",
  },
  [CourseCategory.BACKEND]: {
    icon: FaServer,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconGradient: "from-green-500 to-emerald-500",
    badgeColor: "bg-green-500/10 border-green-500/30",
    textColor: "text-green-400",
  },
  [CourseCategory.MOBILE_DEVELOPMENT]: {
    icon: FaMobileAlt,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconGradient: "from-purple-500 to-pink-500",
    badgeColor: "bg-purple-500/10 border-purple-500/30",
    textColor: "text-purple-400",
  },
  [CourseCategory.DATA_SCIENCE]: {
    icon: FaChartBar,
    gradient: "from-orange-500/20 to-amber-500/20",
    iconGradient: "from-orange-500 to-amber-500",
    badgeColor: "bg-orange-500/10 border-orange-500/30",
    textColor: "text-orange-400",
  },
  [CourseCategory.DATABASE]: {
    icon: FaDatabase,
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconGradient: "from-teal-500 to-cyan-500",
    badgeColor: "bg-teal-500/10 border-teal-500/30",
    textColor: "text-teal-400",
  },
  [CourseCategory.VIDEO_GAMES]: {
    icon: FaGamepad,
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconGradient: "from-purple-500 to-indigo-500",
    badgeColor: "bg-purple-500/10 border-purple-500/30",
    textColor: "text-purple-400",
  },
};

// Función para obtener configuración de categoría
export const getCategoryConfig = (category: CourseCategory) => {
  return categoryConfig[category] || categoryConfig[CourseCategory.FRONTEND];
};

// Opciones para el select de categorías
export const categoryOptions = [
  { value: CourseCategory.FRONTEND, label: "Frontend Development" },
  { value: CourseCategory.BACKEND, label: "Backend Development" },
  { value: CourseCategory.MOBILE_DEVELOPMENT, label: "Mobile Development" },
  { value: CourseCategory.DATA_SCIENCE, label: "Data Science" },
  { value: CourseCategory.DATABASE, label: "Database" },
  { value: CourseCategory.VIDEO_GAMES, label: "Video Games" },
];

// Función para obtener el nombre de display de la categoría
export const getCategoryDisplayName = (category: CourseCategory): string => {
  const option = categoryOptions.find((opt) => opt.value === category);
  return option?.label || category;
};

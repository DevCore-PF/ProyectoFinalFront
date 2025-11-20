import {
  FaCode,
  FaServer,
  FaMobileAlt,
  FaChartBar,
  FaDatabase,
  FaGamepad,
  FaPaintBrush,
  FaShieldAlt,
  FaCogs,
  FaBrain,
  FaRobot,
  FaBullhorn,
  FaGlobe,
  FaCheckCircle,
  FaRocket,FaBug,
  FaChartLine
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
  [CourseCategory.UIUX]: {
    icon: FaPaintBrush, 
    gradient: "from-pink-500/20 to-rose-500/20",
    iconGradient: "from-pink-500 to-rose-500",
    badgeColor: "bg-pink-500/10 border-pink-500/30",
    textColor: "text-pink-400",
  },
  [CourseCategory.Cybersecurity]: {
    icon: FaShieldAlt, 
    gradient: "from-red-500/20 to-rose-500/20",
    iconGradient: "from-red-500 to-rose-500",
    badgeColor: "bg-red-500/10 border-red-500/30",
    textColor: "text-red-400",
  },
  [CourseCategory.DevOps]: {
    icon: FaCogs,
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconGradient: "from-indigo-500 to-blue-500",
    badgeColor: "bg-indigo-500/10 border-indigo-500/30",
    textColor: "text-indigo-400",
  },
  [CourseCategory.ArtificialIntelligence]: {
    icon: FaBrain,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconGradient: "from-violet-500 to-purple-500",
    badgeColor: "bg-violet-500/10 border-violet-500/30",
    textColor: "text-violet-400",
  },
  [CourseCategory.MachineLearning]: {
    icon: FaRobot,
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    iconGradient: "from-fuchsia-500 to-pink-500",
    badgeColor: "bg-fuchsia-500/10 border-fuchsia-500/30",
    textColor: "text-fuchsia-400",
  },
  [CourseCategory.DigitalMarketing]: {
    icon: FaChartLine, 
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconGradient: "from-yellow-500 to-orange-500",
    badgeColor: "bg-yellow-500/10 border-yellow-500/30",
    textColor: "text-yellow-400",
  },
  [CourseCategory.WebDevelopment]: {
    icon: FaGlobe, 
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconGradient: "from-cyan-500 to-blue-500",
    badgeColor: "bg-cyan-500/10 border-cyan-500/30",
    textColor: "text-cyan-400",
  },
  [CourseCategory.QA]: {
    icon: FaBug, 
    gradient: "from-lime-500/20 to-green-500/20",
    iconGradient: "from-lime-500 to-green-500",
    badgeColor: "bg-lime-500/10 border-lime-500/30",
    textColor: "text-lime-400",
  },
  [CourseCategory.Automation]: {
    icon: FaRocket, 
    gradient: "from-sky-500/20 to-indigo-500/20",
    iconGradient: "from-sky-500 to-indigo-500",
    badgeColor: "bg-sky-500/10 border-sky-500/30",
    textColor: "text-sky-400",
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
  { value: CourseCategory.UIUX, label: "Dieseño UI/UX" },
  { value: CourseCategory.Cybersecurity, label: "Ciberseguridad" },
  { value: CourseCategory.DevOps, label: "DevOps" },
  { value: CourseCategory.ArtificialIntelligence, label: "Inteligencia Artificial" },
  { value: CourseCategory.MachineLearning, label: "Aprendizaje Automático" },
  { value: CourseCategory.DigitalMarketing, label: "Marketing Digital" },
  { value: CourseCategory.WebDevelopment, label: "Desarrollo Web" },
  { value: CourseCategory.QA, label: "Control de Calidad y Pruebas" },
  { value: CourseCategory.Automation, label: "Automatización" },
];

// Función para obtener el nombre de display de la categoría
export const getCategoryDisplayName = (category: CourseCategory): string => {
  const option = categoryOptions.find((opt) => opt.value === category);
  return option?.label || category;
};

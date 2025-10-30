import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiPython,
  SiFigma,
  SiSwift,
} from "react-icons/si";
import { GrMysql } from "react-icons/gr";
import {
  HiPlus,
  HiUpload,
  HiPencil,
  HiChartBar,
  HiCurrencyDollar,
  HiEye,
} from "react-icons/hi";

import { HiBookOpen, HiCheckCircle } from "react-icons/hi";
export const courses = [
  {
    id: 1,
    title: "HTML",
    description:
      "Familiarízate con los bloques fundamentales del desarrollo web. Aprende la estructura de las páginas web y crea tu primer proyecto usando desde cero.",
    icon: SiHtml5,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
    category: "CURSO",
    careerPath: false,
  },
  {
    id: 2,
    title: "CSS",
    description:
      "Da vida y estilo a tus páginas web. Con CSS podrás diseñar interfaces atractivas y crear experiencias visuales profesionales.",
    icon: SiCss3,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-400/10",
    category: "CURSO",
    careerPath: false,
  },
  {
    id: 3,
    title: "JavaScript",
    description:
      "Sumérgete en el lenguaje que da vida a la web. Con JavaScript vas a poder manipular elementos, crear interactividad y desarrollar experiencias interactivas.",
    icon: SiJavascript,
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    category: "CURSO",
    careerPath: false,
  },
  {
    id: 4,
    title: "Desarrollo Front-end",
    description:
      "Adquirí conocimientos en HTML, CSS y JavaScript para construir interfaces atractivas. Aprendé a crear aplicaciones dinámicas y adaptables en todos los dispositivos.",
    icon: SiReact,
    iconColor: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    category: "RUTA PROFESIONAL",
    careerPath: true,
    techs: [SiHtml5, SiCss3, SiJavascript, SiReact],
  },
  {
    id: 5,
    title: "Desarrollo Full-Stack",
    description:
      "Dominá los fundamentos del desarrollo front-end y back-end. Aprendé a crear interfaces de usuario dinámicas y desarrollá tus propias herramientas. ¡Creá una aplicación de web desde cero!",
    icon: SiNodedotjs,
    iconColor: "text-green-500",
    bgColor: "bg-green-500/10",
    category: "RUTA PROFESIONAL",
    careerPath: true,
    techs: [SiHtml5, SiCss3, SiJavascript, SiReact, SiNodedotjs, SiMongodb],
  },
  {
    id: 6,
    title: "Desarrollo con Python",
    description:
      "Aprende Python desde cero entendiendo rápidamente desde aplicaciones web sencillas hasta soluciones de inteligencia artificial.",
    icon: SiPython,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
    category: "RUTA PROFESIONAL",

    careerPath: true,
    techs: [SiPython],
  },
  {
    id: 7,
    title: "SQL",
    description:
      "Dominá esta habilidad esencial para el análisis y gestión de datos. Aprende a crear, consultar y administrar bases de datos.",
    icon: GrMysql,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-600/10",
    category: "CURSO",
    careerPath: false,
  },
  {
    id: 8,
    title: "Diseño UI",
    description:
      "Aprende a diseñar interfaces atractivas y funcionales. Descubrí las claves del color.",
    icon: SiFigma,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
    category: "CURSO",
    careerPath: false,
  },
  {
    id: 9,
    title: "Swift",
    description:
      "Dominá Swift, el lenguaje de Apple para crear aplicaciones rápidas, fiables y de alto rendimiento en entornos del ecosistema Apple.",
    icon: SiSwift,
    iconColor: "text-orange-400",
    bgColor: "bg-orange-400/10",
    category: "CURSO",
    careerPath: false,
  },
];

export const teacherCourses = [
  {
    id: "1",
    title: "Desarrollo Front-end",
    students: 32,
    rating: 4.1,
    price: 52.0,
    status: "Publicado",
    createdDate: "05/07/2025",
    lastUpdate: "10/08/2025",
    totalDuration: "16h",
    visibility: "Público",
  },
  {
    id: "2",
    title: "HTML Avanzado",
    students: 0,
    rating: 0.0,
    price: 16.0,
    status: "Borrador",
    createdDate: "05/07/2025",
    lastUpdate: "10/08/2025",
    totalDuration: "2h",
    visibility: "Privado",
  },
  {
    id: "3",
    title: "CSS y Sass Profesional",
    students: 18,
    rating: 4.7,
    price: 35.0,
    status: "En revisión",
    createdDate: "01/08/2025",
    lastUpdate: "15/08/2025",
    totalDuration: "10h",
    visibility: "Privado",
  },
];
export const teacherManagementOptions = [
  {
    id: "create-course",
    title: "Crear nuevo curso",
    icon: <HiPlus className="w-4 h-4" />,
    onClick: () => console.log("Crear nuevo curso"),
  },
  {
    id: "upload-resources",
    title: "Subir recursos",
    icon: <HiUpload className="w-4 h-4" />,
    onClick: () => console.log("Subir recursos"),
  },
  {
    id: "edit-course",
    title: "Editar curso",
    icon: <HiPencil className="w-4 h-4" />,
    onClick: () => console.log("Editar curso"),
  },
  {
    id: "statistics",
    title: "Ver estadísticas",
    icon: <HiChartBar className="w-4 h-4" />,
    onClick: () => console.log("Ver estadísticas"),
  },
  {
    id: "income",
    title: "Consultar ingresos",
    icon: <HiCurrencyDollar className="w-4 h-4" />,
    onClick: () => console.log("Consultar ingresos"),
  },
  {
    id: "pending-courses",
    title: "Cursos en revisión",
    icon: <HiEye className="w-4 h-4" />,
    onClick: () => console.log("Ver cursos pendientes"),
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Damian Duchaisnes",
    country: "France",
    flag: "🇫🇷",
    text: "Las habilidades de programación que adquirí con las cursos de DevCore me dieron más confianza para crear por mi cuenta.",
    image: "/images/user1.png",
  },
  {
    id: 2,
    name: "Sam Phelan",
    country: "USA",
    flag: "🇺🇸",
    text: "He probado varias plataformas de aprendizaje y DevCore sin duda como DevCore. Aprender ha mucho más fácil y divertido.",
    image: "/images/user6.png",
  },
  {
    id: 3,
    name: "Ana Laura Rodríguez",
    country: "ARG",
    flag: "🇦🇷",
    text: "El curso de diseño web me brindó una base sólida. Los instructores eran expertos y siempre dispuestos a ayudar, y el entorno de aprendizaje, aunque grabado, resultó muy interactivo y motivador. Lo recomiendo totalmente.",
    image: "/images/user3.png",
  },
];

export const featuresChooseUs = [
  {
    id: 1,
    number: "01",
    title: "Horario de estudio flexible",
    description:
      "Organiza tus cursos según tus compromisos y responsabilidades.",
  },
  {
    id: 2,
    number: "02",
    title: "Instrucciones de expertos",
    description:
      "Aprende de profesionales con experiencia real en diseño y desarrollo.",
  },
  {
    id: 3,
    number: "03",
    title: "Variedad de cursos",
    description:
      "Explora una amplia gama de temas de diseño y desarrollo sobre distintos temas.",
  },
  {
    id: 4,
    number: "04",
    title: "Contenido actualizado",
    description:
      "Accede a tutoriales actualizados que reflejan las últimas tendencias y prácticas de la industria.",
  },
  {
    id: 5,
    number: "05",
    title: "Proyectos y ejercicios prácticos",
    description:
      "Desarrolla tus habilidades que requiere una experiencia en el mundo real.",
  },
  {
    id: 6,
    number: "06",
    title: "Entorno de aprendizaje interactivo",
    description:
      "Conéctate con otros estudiantes, intercambia ideas y recibe retroalimentación.",
  },
];

export const faqs = [
  {
    question: "¿Puedo inscribirme en varios cursos al mismo tiempo?",
    answer:
      "¡Desde! Puedes explotar en todos los cursos que quieras y acceder a ellos cuando te resulte más cómodo.",
  },
  {
    question: "¿Qué tipo de soporte ofrecen los instructores?",
    answer:
      "Nuestros instructores ofrecen soporte a través de foros de discusión, sesiones de Q&A en vivo y respuestas directas a tus preguntas dentro de la plataforma.",
  },
  {
    question:
      "¿Los cursos son a tu propio ritmo o tienen fechas fijas de inicio y fin?",
    answer:
      "Todos nuestros cursos son a tu propio ritmo, lo que significa que puedes comenzar cuando quieras y avanzar según tu disponibilidad.",
  },
  {
    question: "¿Hay requisitos previos para inscribirme?",
    answer:
      "La mayoría de nuestros cursos no requieren conocimientos previos, aunque algunos cursos avanzados pueden requerir experiencia básica en el tema.",
  },
  {
    question: "¿Puedo descargar el material para verlo sin conexión?",
    answer:
      "Sí, con el Plan Pro puedes descargar los materiales del curso y las lecciones en video para acceder a ellos sin conexión en cualquier momento.",
  },
];

export const recommendedCourses = [
  {
    id: "1",
    name: "React Avanzado",
    description: "Domina hooks, context y patrones avanzados",
    duration: "12 horas",
    rating: "4.8",
  },
  {
    id: "2",
    name: "TypeScript desde cero",
    description: "Aprende tipado estático para JavaScript",
    duration: "8 horas",
    rating: "4.9",
  },
  {
    id: "3",
    name: "Node.js y Express",
    description: "Crea APIs robustas con Node",
    duration: "15 horas",
    rating: "4.7",
  },
];

export const progressData = [
  { id: "1", name: "Diseño UX", progress: 28 },
  { id: "2", name: "JavaScript", progress: 70 },
  { id: "3", name: "CSS", progress: 60 },
];

export const studentData = {
  userName: "Sofia",
  userEmail: "sofiarodriguez@gmail.com",
  weeklyGoalProgress: 68,
  goalHours: 4,
  currentHours: 2.7,
};

export const quickAccessItems = [
  {
    id: "courses",
    title: "CURSOS",
    description: "Accede a todos los cursos en los que estás inscripto.",
    icon: <HiBookOpen className="w-6 h-6 text-accent-light" />,
    onClick: () => console.log("Navegando a cursos"),
  },
  {
    id: "tasks",
    title: "TAREAS",
    description: "Completa las tareas asignadas a cada lección.",
    icon: <HiCheckCircle className="w-6 h-6 text-accent-light" />,
    onClick: () => console.log("Navegando a tareas"),
  },
];

export const teacherFeaturedCourses = [
  { id: 1, title: "Introducción a React", revenue: 12247.55, trend: "+15%" },
  { id: 2, title: "JavaScript Avanzado", revenue: 11331.11, trend: "+8%" },
];

  export const teacherRecentActivity = [
    {
      id: 1,
      type: "review",
      text: "Nueva reseña 5★ en 'Introducción a React'",
      time: "Hace 2 horas",
    },
    {
      id: 2,
      type: "enrollment",
      text: "15 nuevos estudiantes esta semana",
      time: "Hace 5 horas",
    },
    {
      id: 3,
      type: "update",
      text: "Actualización completada en 'JavaScript Avanzado'",
      time: "Hace 1 día",
    },
  ];
  export const teacherData = {
    userName: "Carolina",
    userEmail: "carolinaperez@gmail.com",
  };
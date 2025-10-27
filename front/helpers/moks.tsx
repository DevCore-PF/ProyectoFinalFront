import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiPython,
  SiMysql,
  SiFigma,
  SiSwift,
} from "react-icons/si";
import { GrMysql } from "react-icons/gr";
import {
  HiChevronDown,
  HiPlus,
  HiUpload,
  HiPencil,
  HiChartBar,
  HiCurrencyDollar,
  HiEye,
} from "react-icons/hi";

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

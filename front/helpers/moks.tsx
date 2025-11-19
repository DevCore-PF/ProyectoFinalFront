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
import { HiPlus, HiPencil, HiChartBar, HiCurrencyDollar, HiLink } from "react-icons/hi";
import { FaUser, FaChalkboardTeacher, FaCreditCard, FaShieldAlt, FaGraduationCap } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi";
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
    description: "Aprende a diseñar interfaces atractivas y funcionales. Descubrí las claves del color.",
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
    description: "Descrpcion del curso",
    difficulty: "Intermedio",
    duration: "7 hs",
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
    description: "Descrpcion del curso",
    difficulty: "Intermedio",
    duration: "7 hs",
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
    description: "Descrpcion del curso",
    difficulty: "Intermedio",
    duration: "7 hs",
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
    onClick: () => {
      console.log("Navegando a crear curso...");
      // Esta función será sobrescrita en el componente
    },
  },
  {
    id: "additional-content",
    title: "Agregar contenido adicional",
    icon: <HiLink className="w-4 h-4" />,
    onClick: () => console.log("Agregar contenido adicional"),
  },
  {
    id: "statistics",
    title: "Ver cursos más vendidos",
    icon: <HiChartBar className="w-4 h-4" />,
    onClick: () => {
      const topCoursesSection = document.getElementById("top-courses-section");
      if (topCoursesSection) {
        topCoursesSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
  {
    id: "income",
    title: "Consultar ingresos",
    icon: <HiCurrencyDollar className="w-4 h-4" />,
    onClick: () => {
      window.location.href = "/teacher-dashboard/earnings";
    },
  },
  {
    id: "purchase-history",
    title: "Historial de compras",
    icon: <HiShoppingCart className="w-4 h-4" />,
    onClick: () => {
      window.location.href = "/dashboard";
    },
  },
];

export const studentManagementOptions = [
  {
    id: "profile-settings",
    title: "Ajustes de perfil",
    icon: <FaUser className="w-4 h-4" />,
    onClick: () => {
      window.location.href = "/dashboard";
    },
  },
  {
    id: "become-professor",
    title: "Postularme para profesor",
    icon: <FaChalkboardTeacher className="w-4 h-4" />,
    onClick: () => {
      // Este onClick no se usa para become-professor, se maneja directamente en el componente
      console.log("Esta función no debería ejecutarse");
    },
    disabled: false, // Se sobreescribirá en el componente
  },
  {
    id: "purchase-history",
    title: "Historial de compras",
    icon: <HiShoppingCart className="w-4 h-4" />,
    onClick: () => {
      window.location.href = "/purchase-history";
    },
  },
  // {
  //   id: "upload-resources",
  //   title: "???????",
  //   icon: <HiUpload className="w-4 h-4" />,
  //   onClick: () => console.log("Subir recursos"),
  // },
  // {
  //   id: "edit-course",
  //   title: "Editar curso",
  //   icon: <HiPencil className="w-4 h-4" />,
  //   onClick: () => console.log("Editar curso"),
  // },
  // {
  //   id: "statistics",
  //   title: "Ver estadísticas",
  //   icon: <HiChartBar className="w-4 h-4" />,
  //   onClick: () => console.log("Ver estadísticas"),
  // },
  // {
  //   id: "income",
  //   title: "Consultar ingresos",
  //   icon: <HiCurrencyDollar className="w-4 h-4" />,
  //   onClick: () => console.log("Consultar ingresos"),
  // },
  // {
  //   id: "pending-courses",
  //   title: "Cursos en revisión",
  //   icon: <HiEye className="w-4 h-4" />,
  //   onClick: () => console.log("Ver cursos pendientes"),
  // },
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
    description: "Organiza tus cursos según tus compromisos y responsabilidades.",
  },
  {
    id: 2,
    number: "02",
    title: "Instrucciones de expertos",
    description: "Aprende de profesionales con experiencia real en diseño y desarrollo.",
  },
  {
    id: 3,
    number: "03",
    title: "Variedad de cursos",
    description: "Explora una amplia gama de temas de diseño y desarrollo sobre distintos temas.",
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
    description: "Desarrolla tus habilidades que requiere una experiencia en el mundo real.",
  },
  {
    id: 6,
    number: "06",
    title: "Entorno de aprendizaje interactivo",
    description: "Conéctate con otros estudiantes, intercambia ideas y recibe retroalimentación.",
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
    question: "¿Los cursos son a tu propio ritmo o tienen fechas fijas de inicio y fin?",
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
    title: "React Avanzado",
    description: "Domina hooks, context y patrones avanzados",
    duration: "12 horas",
    rating: "4.8",
  },
  {
    id: "2",
    title: "TypeScript desde cero",
    description: "Aprende tipado estático para JavaScript",
    duration: "8 horas",
    rating: "4.9",
  },
  {
    id: "3",
    title: "Node.js y Express",
    description: "Crea APIs robustas con Node",
    duration: "15 horas",
    rating: "4.7",
  },
];

export const teacherData = {
  userName: "Carolina",
  userEmail: "carolinaperez@gmail.com",
};

export const memberships = [
  {
    name: "Mensual",
    price: 29,
    period: "/mes",
    duration: "1 mes",
    features: [
      "Acceso ilimitado a todos los cursos",
      "Nuevos cursos cada semana",
      "Certificados de finalización",
      "Soporte prioritario",
      "Descarga de recursos",
      "Comunidad exclusiva",
    ],
    popular: false,
  },
  {
    name: "Trimestral",
    price: 69,
    period: "/3 meses",
    duration: "3 meses",
    savings: "Ahorra 20%",
    features: [
      "Acceso ilimitado a todos los cursos",
      "Nuevos cursos cada semana",
      "Certificados de finalización",
      "Soporte prioritario",
      "Descarga de recursos",
      "Comunidad exclusiva",
      "Proyectos prácticos guiados",
    ],
    popular: true,
  },
  {
    name: "Anual",
    price: 199,
    period: "/año",
    duration: "12 meses",
    savings: "Ahorra 43%",
    features: [
      "Acceso ilimitado a todos los cursos",
      "Nuevos cursos cada semana",
      "Certificados de finalización",
      "Soporte prioritario VIP",
      "Descarga de recursos",
      "Comunidad exclusiva",
      "Proyectos prácticos guiados",
      "Mentoría 1 a 1 mensual",
      "Acceso anticipado a contenido",
    ],
    popular: false,
  },
];
export const faqCategories = [
  { id: "estudiantes", label: "Para Estudiantes", icon: FaGraduationCap },
  { id: "instructores", label: "Para Instructores", icon: FaChalkboardTeacher },
  { id: "pagos", label: "Pagos y Reembolsos", icon: FaCreditCard },
  { id: "cuenta", label: "Cuenta y Perfil", icon: FaUser },
  { id: "seguridad", label: "Seguridad", icon: FaShieldAlt },
];

export const faqsByCategory = {
  estudiantes: [
    {
      question: "¿Cómo me inscribo en un curso?",
      answer:
        "Para inscribirte en un curso, navega por nuestro catálogo, selecciona el curso que te interesa y haz clic en 'Inscribirse ahora'. Completa el proceso de pago y tendrás acceso inmediato al contenido del curso.",
    },
    {
      question: "¿Puedo acceder a los cursos desde mi móvil?",
      answer:
        "Sí, nuestra plataforma es totalmente   y está optimizada para dispositivos móviles. Puedes acceder a tus cursos desde cualquier navegador móvil o tablet.",
    },
    {
      question: "¿Los cursos tienen fecha de vencimiento?",
      answer:
        "No, una vez que compras un curso tienes acceso de por vida al contenido. Puedes volver a ver las lecciones tantas veces como quieras, a tu propio ritmo.",
    },
    {
      question: "¿Recibiré un certificado al completar un curso?",
      answer:
        "Sí, al completar exitosamente un curso recibirás un certificado digital verificable que puedes compartir en LinkedIn o incluir en tu CV profesional.",
    },
    {
      question: "¿Puedo descargar los videos de las clases?",
      answer:
        "La descarga de videos depende del instructor. Algunos cursos permiten descargar el contenido para verlo offline, mientras que otros solo están disponibles en streaming.",
    },
    {
      question: "¿Hay algún requisito previo para tomar los cursos?",
      answer:
        "Los requisitos varían según el curso. Cada curso tiene una sección de 'Requisitos' donde el instructor detalla el conocimiento previo necesario. Muchos cursos están diseñados para principiantes.",
    },
  ],
  instructores: [
    {
      question: "¿Cómo puedo empezar a vender cursos en la plataforma?",
      answer:
        "Regístrate como instructor, completa tu perfil profesional y envía tu solicitud. Una vez aprobado, podrás crear tu primer curso usando nuestras herramientas de creación de contenido.",
    },
    {
      question: "¿Qué porcentaje de las ventas recibo como instructor?",
      answer:
        "Los instructores reciben el 70% de las ventas directas de sus cursos. Si el estudiante llega a través de nuestros canales de marketing, la comisión es del 50%.",
    },
    {
      question: "¿Cuánto tiempo toma que mi curso sea aprobado?",
      answer:
        "El proceso de revisión usualmente toma entre 2 a 5 días hábiles. Nuestro equipo revisa el contenido para asegurar que cumpla con nuestros estándares de calidad.",
    },
    {
      question: "¿Qué formato de video debo usar para mis clases?",
      answer:
        "Recomendamos videos en formato MP4 con resolución mínima de 720p (HD). La plataforma soporta también formatos MOV y AVI. El tamaño máximo por video es de 4GB.",
    },
    {
      question: "¿Cómo recibo mis pagos?",
      answer:
        "Los pagos se procesan mensualmente a través de transferencia bancaria o PayPal. Debes alcanzar un mínimo de $50 USD en ganancias para solicitar un retiro.",
    },
    {
      question: "¿Puedo actualizar mi curso después de publicarlo?",
      answer:
        "Sí, puedes actualizar tu curso en cualquier momento. Puedes añadir nuevas lecciones, actualizar contenido existente o mejorar los materiales complementarios.",
    },
    {
      question: "¿Necesito equipo profesional para grabar mis cursos?",
      answer:
        "No necesariamente. Con un micrófono decente, buena iluminación y una cámara HD (incluso de smartphone) puedes crear contenido de calidad. Lo más importante es el valor educativo.",
    },
    {
      question: "¿Puedo ofrecer cupones de descuento para mis cursos?",
      answer:
        "Sí, tienes total control para crear cupones de descuento personalizados, establecer fechas de vencimiento y límites de uso para tus cursos.",
    },
  ],
  pagos: [
    {
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), PayPal, y transferencias bancarias locales según tu país.",
    },
    {
      question: "¿Puedo obtener un reembolso?",
      answer:
        "Sí, ofrecemos una garantía de reembolso de 30 días. Si no estás satisfecho con un curso, puedes solicitar un reembolso completo dentro de los primeros 30 días de la compra.",
    },
    {
      question: "¿Los precios incluyen impuestos?",
      answer:
        "Los precios mostrados pueden no incluir impuestos locales como IVA o sales tax, que se calcularán durante el checkout según tu ubicación.",
    },
    {
      question: "¿Puedo comprar cursos como regalo?",
      answer:
        "Sí, puedes comprar cualquier curso como regalo. Durante el checkout, selecciona la opción 'Regalar este curso' y enviaremos un código al destinatario.",
    },
    {
      question: "¿Ofrecen planes de suscripción?",
      answer:
        "Actualmente ofrecemos compras individuales de cursos. Estamos trabajando en un plan de suscripción que dará acceso a múltiples cursos por una tarifa mensual.",
    },
  ],
  cuenta: [
    {
      question: "¿Cómo cambio mi contraseña?",
      answer:
        "Ve a Configuración > Seguridad > Cambiar Contraseña. Ingresa tu contraseña actual y la nueva contraseña. Te recomendamos usar una contraseña fuerte con al menos 8 caracteres.",
    },
    {
      question: "¿Puedo cambiar mi correo electrónico asociado?",
      answer:
        "Sí, puedes actualizar tu correo electrónico desde la sección de Configuración de Cuenta. Necesitarás verificar el nuevo correo electrónico para completar el cambio.",
    },
    {
      question: "¿Cómo elimino mi cuenta?",
      answer:
        "Puedes solicitar la eliminación de tu cuenta desde Configuración > Privacidad > Eliminar Cuenta. Ten en cuenta que esta acción es irreversible y perderás acceso a todos tus cursos.",
    },
    {
      question: "¿Puedo tener múltiples perfiles en una cuenta?",
      answer:
        "No, cada cuenta está asociada a un único usuario. Si necesitas cuentas separadas para uso personal y profesional, deberás crear cuentas diferentes.",
    },
  ],
  seguridad: [
    {
      question: "¿Mis datos de pago están seguros?",
      answer:
        "Sí, utilizamos encriptación SSL de nivel bancario y no almacenamos información completa de tarjetas de crédito. Todos los pagos son procesados por procesadores certificados PCI-DSS.",
    },
    {
      question: "¿Ofrecen autenticación de dos factores?",
      answer:
        "Sí, recomendamos encarecidamente activar la autenticación de dos factores (2FA) desde la configuración de seguridad para proteger tu cuenta.",
    },
    {
      question: "¿Qué hago si creo que mi cuenta fue comprometida?",
      answer:
        "Cambia tu contraseña inmediatamente y contacta a nuestro equipo de soporte en security@devcore.com. Revisaremos tu cuenta y tomaremos las medidas necesarias.",
    },
    {
      question: "¿Comparten mi información personal con terceros?",
      answer:
        "No vendemos tu información personal. Solo compartimos datos necesarios con procesadores de pago y servicios esenciales para el funcionamiento de la plataforma, siempre bajo estrictos acuerdos de confidencialidad.",
    },
  ],
};

export const getDifficultyColors = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case "principiante":
    case "beginner":
    case "básico":
      return "bg-green-400/10 border border-green-400/30 text-green-400";
    case "intermedio":
    case "intermediate":
      return "bg-yellow-400/10 border border-yellow-400/30 text-yellow-400";
    case "avanzado":
    case "advanced":
      return "bg-amber-400/10 border border-amber-400/30 text-amber-400";
    default:
      return "bg-slate-700/50 text-slate-300";
  }
};

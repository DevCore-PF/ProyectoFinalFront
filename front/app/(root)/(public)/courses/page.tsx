'use client'
import React from 'react';
import { 
  FaCode, 
  FaDatabase, 
  FaMobileAlt, 
  FaCloud, 
  FaShieldAlt, 
  FaGamepad, 
  FaPaintBrush, 
  FaServer,
  FaChartBar,
  FaRobot
} from 'react-icons/fa';

// Configuración de categorías
const categoryConfig = {
  'Frontend Development': {
    icon: FaCode,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconGradient: 'from-blue-500 to-cyan-500',
    badgeColor: 'bg-blue-500/10 border-blue-500/30',
    textColor: 'text-blue-400'
  },
  'Backend Development': {
    icon: FaServer,
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconGradient: 'from-green-500 to-emerald-500',
    badgeColor: 'bg-green-500/10 border-green-500/30',
    textColor: 'text-green-400'
  },
  'Mobile Development': {
    icon: FaMobileAlt,
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconGradient: 'from-purple-500 to-pink-500',
    badgeColor: 'bg-purple-500/10 border-purple-500/30',
    textColor: 'text-purple-400'
  },
  'Data Science': {
    icon: FaChartBar,
    gradient: 'from-orange-500/20 to-red-500/20',
    iconGradient: 'from-orange-500 to-red-500',
    badgeColor: 'bg-orange-500/10 border-orange-500/30',
    textColor: 'text-orange-400'
  },
  'Database': {
    icon: FaDatabase,
    gradient: 'from-teal-500/20 to-cyan-500/20',
    iconGradient: 'from-teal-500 to-cyan-500',
    badgeColor: 'bg-teal-500/10 border-teal-500/30',
    textColor: 'text-teal-400'
  },
  'Cloud Computing': {
    icon: FaCloud,
    gradient: 'from-indigo-500/20 to-blue-500/20',
    iconGradient: 'from-indigo-500 to-blue-500',
    badgeColor: 'bg-indigo-500/10 border-indigo-500/30',
    textColor: 'text-indigo-400'
  },
  'Artificial Intelligence': {
    icon: FaRobot,
    gradient: 'from-pink-500/20 to-rose-500/20',
    iconGradient: 'from-pink-500 to-rose-500',
    badgeColor: 'bg-pink-500/10 border-pink-500/30',
    textColor: 'text-pink-400'
  },
  'Cybersecurity': {
    icon: FaShieldAlt,
    gradient: 'from-red-500/20 to-pink-500/20',
    iconGradient: 'from-red-500 to-pink-500',
    badgeColor: 'bg-red-500/10 border-red-500/30',
    textColor: 'text-red-400'
  },
  'Game Development': {
    icon: FaGamepad,
    gradient: 'from-violet-500/20 to-purple-500/20',
    iconGradient: 'from-violet-500 to-purple-500',
    badgeColor: 'bg-violet-500/10 border-violet-500/30',
    textColor: 'text-violet-400'
  },
  'UI/UX Design': {
    icon: FaPaintBrush,
    gradient: 'from-yellow-500/20 to-orange-500/20',
    iconGradient: 'from-yellow-500 to-orange-500',
    badgeColor: 'bg-yellow-500/10 border-yellow-500/30',
    textColor: 'text-yellow-400'
  }
};

// Datos de cursos mockeados
const coursesData = [
  {
    id: 1,
    category: 'Frontend Development',
    title: 'Desarrollo Front-end Completo',
    description: 'Adquirí conocimientos en HTML, CSS y JavaScript para construir interfaces web. Aprendé a utilizar React para crear aplicaciones atractivas y orientadas al usuario.',
    duration: '24 horas',
    level: 'Intermedio',
    instructor: 'Ana García',
    syllabus: [
      'Fundamentos de HTML5',
      'Estilos y maquetación con CSS',
      'JavaScript ES6+',
      'React y Hooks',
      'Estado global con Redux',
      'Testing con Jest'
    ]
  },
  {
    id: 2,
    category: 'Backend Development',
    title: 'Node.js y APIs REST',
    description: 'Construye APIs robustas y escalables con Node.js, Express y MongoDB. Aprende autenticación, validación y mejores prácticas de desarrollo backend.',
    duration: '30 horas',
    level: 'Avanzado',
    instructor: 'Carlos Mendoza',
    syllabus: [
      'Fundamentos de Node.js',
      'Express.js framework',
      'Bases de datos con MongoDB',
      'Autenticación JWT',
      'Validación de datos',
      'Testing de APIs'
    ]
  },
  {
    id: 3,
    category: 'Mobile Development',
    title: 'React Native para iOS y Android',
    description: 'Desarrolla aplicaciones móviles nativas para iOS y Android usando React Native. Desde configuración hasta publicación en stores.',
    duration: '28 horas',
    level: 'Intermedio',
    instructor: 'María López',
    syllabus: [
      'Configuración del entorno',
      'Componentes nativos',
      'Navegación entre pantallas',
      'Estado y gestión de datos',
      'APIs y servicios web',
      'Publicación en stores'
    ]
  },
  {
    id: 4,
    category: 'Data Science',
    title: 'Machine Learning con Python',
    description: 'Aprende análisis de datos y machine learning usando Python, pandas, scikit-learn y TensorFlow para resolver problemas del mundo real.',
    duration: '40 horas',
    level: 'Avanzado',
    instructor: 'Dr. Roberto Silva',
    syllabus: [
      'Python para Data Science',
      'Análisis exploratorio de datos',
      'Algoritmos de ML supervisado',
      'Deep Learning básico',
      'Visualización de datos',
      'Proyectos prácticos'
    ]
  },
  {
    id: 5,
    category: 'Database',
    title: 'Bases de Datos PostgreSQL',
    description: 'Domina PostgreSQL desde conceptos básicos hasta técnicas avanzadas de optimización y administración de bases de datos empresariales.',
    duration: '22 horas',
    level: 'Intermedio',
    instructor: 'Luis Rodríguez',
    syllabus: [
      'Diseño de bases de datos',
      'Consultas SQL avanzadas',
      'Índices y optimización',
      'Procedimientos almacenados',
      'Backup y recuperación',
      'Monitoreo y tuning'
    ]
  },
  {
    id: 6,
    category: 'Cloud Computing',
    title: 'AWS para Desarrolladores',
    description: 'Aprende a desplegar y gestionar aplicaciones en AWS. Desde EC2 hasta servicios serverless como Lambda y API Gateway.',
    duration: '35 horas',
    level: 'Intermedio',
    instructor: 'Elena Torres',
    syllabus: [
      'Introducción a AWS',
      'EC2 y Auto Scaling',
      'S3 y CloudFront',
      'RDS y DynamoDB',
      'Lambda Functions',
      'CI/CD con AWS CodePipeline'
    ]
  }
];

// Componente de tarjeta de curso usando Layout 1
const CourseCard = ({ course, config }: { course: any, config: any }) => {
  const Icon = config.icon;
  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70">
      <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
        {/* Ícono lateral izquierdo */}
        <div className="flex-shrink-0">
          <div className={`bg-gradient-to-br ${config.iconGradient} p-4 rounded-xl shadow-lg w-20 h-20 flex items-center justify-center`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-white text-2xl font-bold flex-1">
                {course.title}
              </h3>
              <button className="ml-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30">
                Ver Curso
              </button>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
              {course.duration}
            </span>
            <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
              {course.level}
            </span>
            <span className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1.5 rounded-lg font-semibold`}>
              {course.category}
            </span>
          </div>

          {/* Temario compacto */}
          <div className="border-t border-slate-700/50 pt-4">
            <h4 className="text-white font-semibold text-sm mb-3">Temario</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {course.syllabus.map((topic: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`${config.textColor} font-bold text-xs`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-slate-400 text-xs truncate">{topic}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 text-slate-500 text-xs">Por {course.instructor}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la página de cursos
const CoursesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] p-8 md:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Nuestros Cursos
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Descubre una amplia variedad de cursos especializados para impulsar tu carrera en tecnología
          </p>
        </div>
        
        {/* Grid de cursos */}
        <div className="space-y-8">
          {coursesData.map((course) => {
            const config = categoryConfig[course.category as keyof typeof categoryConfig];
            return (
              <CourseCard
                key={course.id}
                course={course}
                config={config}
              />
            );
          })}
        </div>

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">{coursesData.length}+</h3>
            <p className="text-slate-300">Cursos Disponibles</p>
          </div>
          <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">200+</h3>
            <p className="text-slate-300">Horas de Contenido</p>
          </div>
          <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">10+</h3>
            <p className="text-slate-300">Instructores Expertos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
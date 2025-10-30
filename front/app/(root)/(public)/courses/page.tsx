'use client'
import React, { useState } from 'react';
import { 
  FaCode, 
  FaDatabase, 
  FaMobileAlt, 
  FaCloud, 
  FaBrain, 
  FaShieldAlt, 
  FaGamepad, 
  FaPaintBrush, 
  FaFlask, 
  FaLink, 
  FaQuestionCircle, 
  FaServer 
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
  }
};

// Opción 1: Ícono a la izquierda en columna vertical
const LayoutVersion1 = ({ course, config }) => {
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
                View Course
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
              {course.syllabus.map((topic, index) => (
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

// Opción 2: Ícono pequeño arriba a la izquierda, layout compacto
const LayoutVersion2 = ({ course, config }) => {
  const Icon = config.icon;
  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70">
      <div className="p-6 md:p-8">
        {/* Header con ícono integrado */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`bg-gradient-to-br ${config.iconGradient} p-3 rounded-lg shadow-md flex-shrink-0`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-2xl font-bold mb-2">
              {course.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium">
                {course.duration}
              </span>
              <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium">
                {course.level}
              </span>
              <span className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1 rounded-lg font-semibold`}>
                {course.category}
              </span>
            </div>
          </div>
          <button className="hidden md:block bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 flex-shrink-0">
            View Course
          </button>
        </div>

        {/* Descripción */}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {course.description}
        </p>

        {/* Temario */}
        <div className="border-t border-slate-700/50 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold text-sm">Temario</h4>
            <span className="text-slate-500 text-xs">Por {course.instructor}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {course.syllabus.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`${config.textColor} font-bold text-xs`}>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-slate-400 text-xs truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="md:hidden w-full mt-4 bg-[#7e4bde] hover:bg-[#6d3dc4] py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300">
          View Course
        </button>
      </div>
    </div>
  );
};

// Opción 3: Layout de dos columnas con ícono en barra lateral
const LayoutVersion3 = ({ course, config }) => {
  const Icon = config.icon;
  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70">
      <div className="flex">
        {/* Barra lateral con ícono */}
        <div className={`hidden md:flex w-24 bg-gradient-to-b ${config.gradient} items-center justify-center flex-shrink-0 border-r border-slate-700/30`}>
          <div className={`bg-gradient-to-br ${config.iconGradient} p-4 rounded-xl shadow-lg`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-white text-2xl font-bold mb-2">
                {course.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium">
                  {course.duration}
                </span>
                <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1 rounded-lg font-medium">
                  {course.level}
                </span>
                <span className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1 rounded-lg font-semibold`}>
                  {course.category}
                </span>
              </div>
            </div>
            <button className="hidden lg:block ml-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30">
              View Course
            </button>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {course.description}
          </p>

          <div className="border-t border-slate-700/50 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold text-sm">Temario</h4>
              <span className="text-slate-500 text-xs">Por {course.instructor}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
              {course.syllabus.map((topic, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`${config.textColor} font-bold text-xs`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-slate-400 text-xs truncate">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Opción 4: Ícono flotante superpuesto en la esquina
const LayoutVersion4 = ({ course, config }) => {
  const Icon = config.icon;
  return (
    <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70 relative">
      {/* Ícono flotante en esquina superior derecha */}
      <div className="absolute top-6 right-6 z-10">
        <div className={`bg-gradient-to-br ${config.iconGradient} p-3 rounded-xl shadow-xl`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="p-6 md:p-8 pr-24">
        <h3 className="text-white text-2xl font-bold mb-3">
          {course.title}
        </h3>

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

        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {course.description}
        </p>

        <div className="border-t border-slate-700/50 pt-4 mb-4">
          <h4 className="text-white font-semibold text-sm mb-3">Temario</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {course.syllabus.map((topic, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`${config.textColor} font-bold text-xs`}>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-slate-400 text-xs truncate">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-xs">Por {course.instructor}</span>
          <button className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de selector
const CoursesShowcase = () => {
  const [selectedLayout, setSelectedLayout] = useState(1);
  
  const exampleCourse = {
    id: 1,
    category: 'Frontend Development',
    title: 'Desarrollo Front-end',
    description: 'Adquirí conocimientos en HTML, CSS y JavaScript para construir interfaces web. Aprendé a utilizar React para crear aplicaciones atractivas y orientadas al usuario.',
    duration: '18 horas',
    level: 'Intermedio',
    instructor: 'Michael Adams',
    syllabus: [
      'Fundamentos de HTML',
      'Estilos y maquetación con CSS',
      'Conceptos básicos de JavaScript',
      'Creación de sitios web responsivos',
      'Introducción a Bootstrap y React'
    ]
  };

  const config = categoryConfig[exampleCourse.category];

  const layouts = {
    1: <LayoutVersion1 course={exampleCourse} config={config} />,
    2: <LayoutVersion2 course={exampleCourse} config={config} />,
    3: <LayoutVersion3 course={exampleCourse} config={config} />,
    4: <LayoutVersion4 course={exampleCourse} config={config} />
  };

  const descriptions = {
    1: "📍 Ícono grande a la izquierda en columna, botón arriba a la derecha",
    2: "🎯 Ícono pequeño integrado en el header, layout ultra compacto",
    3: "📊 Barra lateral de color con ícono, contenido en dos columnas",
    4: "✨ Ícono flotante en esquina superior derecha, layout limpio"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] p-8 md:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Layouts Horizontales Compactos
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Ícono pequeño en diferentes posiciones para mejor aprovechamiento del espacio
          </p>
          
          {/* Selector */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[1, 2, 3, 4].map((layout) => (
              <button
                key={layout}
                onClick={() => setSelectedLayout(layout)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedLayout === layout
                    ? 'bg-[#7e4bde] text-white shadow-lg shadow-[#7e4bde]/30'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Layout {layout}
              </button>
            ))}
          </div>

          {/* Descripción */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 mb-8">
            <p className="text-slate-300 text-sm">
              {descriptions[selectedLayout]}
            </p>
          </div>
        </div>
        
        {layouts[selectedLayout]}
      </div>
    </div>
  );
};

export default CoursesShowcase;
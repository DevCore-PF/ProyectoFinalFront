// "use client";
// import React, { useEffect, useEffectEvent, useState } from "react";
// import RealCoursesGrid from "@/components/RealCoursesGrid";
// import { useAddToCart } from "@/hooks/useAddToCart";
// import { Course } from "@/types/course.types";
// import {
//   FaCode,
//   FaDatabase,
//   FaMobileAlt,
//   FaCloud,
//   FaShieldAlt,
//   FaGamepad,
//   FaPaintBrush,
//   FaServer,
//   FaChartBar,
//   FaRobot,
// } from "react-icons/fa";
// import { getAllCoursesService } from "@/services/course.service";

// // Configuración de categorías
// const categoryConfig = {
//   "Frontend Development": {
//     icon: FaCode,
//     gradient: "from-blue-500/20 to-cyan-500/20",
//     iconGradient: "from-blue-500 to-cyan-500",
//     badgeColor: "bg-blue-500/10 border-blue-500/30",
//     textColor: "text-blue-400",
//   },
//   "Backend Development": {
//     icon: FaServer,
//     gradient: "from-green-500/20 to-emerald-500/20",
//     iconGradient: "from-green-500 to-emerald-500",
//     badgeColor: "bg-green-500/10 border-green-500/30",
//     textColor: "text-green-400",
//   },
//   "Mobile Development": {
//     icon: FaMobileAlt,
//     gradient: "from-purple-500/20 to-pink-500/20",
//     iconGradient: "from-purple-500 to-pink-500",
//     badgeColor: "bg-purple-500/10 border-purple-500/30",
//     textColor: "text-purple-400",
//   },
//   "Data Science": {
//     icon: FaChartBar,
//     gradient: "from-orange-500/20 to-red-500/20",
//     iconGradient: "from-orange-500 to-red-500",
//     badgeColor: "bg-orange-500/10 border-orange-500/30",
//     textColor: "text-orange-400",
//   },
//   Database: {
//     icon: FaDatabase,
//     gradient: "from-teal-500/20 to-cyan-500/20",
//     iconGradient: "from-teal-500 to-cyan-500",
//     badgeColor: "bg-teal-500/10 border-teal-500/30",
//     textColor: "text-teal-400",
//   },
//   "Cloud Computing": {
//     icon: FaCloud,
//     gradient: "from-indigo-500/20 to-blue-500/20",
//     iconGradient: "from-indigo-500 to-blue-500",
//     badgeColor: "bg-indigo-500/10 border-indigo-500/30",
//     textColor: "text-indigo-400",
//   },
//   "Artificial Intelligence": {
//     icon: FaRobot,
//     gradient: "from-pink-500/20 to-rose-500/20",
//     iconGradient: "from-pink-500 to-rose-500",
//     badgeColor: "bg-pink-500/10 border-pink-500/30",
//     textColor: "text-pink-400",
//   },
//   Cybersecurity: {
//     icon: FaShieldAlt,
//     gradient: "from-red-500/20 to-pink-500/20",
//     iconGradient: "from-red-500 to-pink-500",
//     badgeColor: "bg-red-500/10 border-red-500/30",
//     textColor: "text-red-400",
//   },
//   "Game Development": {
//     icon: FaGamepad,
//     gradient: "from-violet-500/20 to-purple-500/20",
//     iconGradient: "from-violet-500 to-purple-500",
//     badgeColor: "bg-violet-500/10 border-violet-500/30",
//     textColor: "text-violet-400",
//   },
//   "UI/UX Design": {
//     icon: FaPaintBrush,
//     gradient: "from-yellow-500/20 to-orange-500/20",
//     iconGradient: "from-yellow-500 to-orange-500",
//     badgeColor: "bg-yellow-500/10 border-yellow-500/30",
//     textColor: "text-yellow-400",
//   },
// };

// interface CategoryConfig {
//   icon: React.ComponentType<{ className?: string }>;
//   gradient: string;
//   iconGradient: string;
//   badgeColor: string;
//   textColor: string;
// }

// const CourseCard = ({
//   course,
//   config,
// }: {
//   course: Course;
//   config: CategoryConfig;
// }) => {
//   const { handleAddToCart } = useAddToCart();
//   const Icon = config.icon;
//   const [coursesFetch, setCoursesFetch] = useState<Course[]>([]);

//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         const courses = await getAllCoursesService();
//         setCoursesFetch(courses);
//       } catch (error) {
//         console.log(error);
//         throw error;
//       }
//     };
//     fetchCourse();
//   }, []);
//   return (
//     <div className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70">
//       <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
//         {/* Ícono lateral izquierdo */}
//         <div className="flex-shrink-0">
//           <div
//             className={`bg-gradient-to-br ${config.iconGradient} p-4 rounded-xl shadow-lg w-20 h-20 flex items-center justify-center`}
//           >
//             <Icon className="w-10 h-10 text-white" />
//           </div>
//         </div>

//         {/* Contenido principal */}
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           <div className="mb-4">
//             <div className="flex items-start justify-between mb-2">
//               <h3 className="text-white text-2xl font-bold flex-1">
//                 {course.title}
//               </h3>
//               <button
//                 onClick={() => handleAddToCart(course)}
//                 className="bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300"
//               >
//                 Agregar a carrito
//               </button>
//               <button className="ml-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30">
//                 Ver Curso
//               </button>
//             </div>
//             <p className="text-slate-300 text-sm leading-relaxed">
//               {course.description}
//             </p>
//           </div>

//           {/* Tags */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
//               {course.duration}
//             </span>
//             <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
//               {course.difficulty}
//             </span>
//             <span
//               className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1.5 rounded-lg font-semibold`}
//             >
//               {course.category}
//             </span>
//             <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-lg font-semibold">
//               ${course.price}
//             </span>
//           </div>

//           {/* Info del profesor */}
//           <div className="border-t border-slate-700/50 pt-4">
//             <div className="flex items-center justify-between">
//               <div className="text-slate-400 text-xs">
//                 <span className="text-slate-500">Instructor: </span>
//                 <span className="text-slate-300 font-semibold">
//                   {course.professor.user.name}
//                 </span>
//               </div>
//               <div className="text-slate-400 text-xs">
//                 <span className="text-slate-500">Especialidad: </span>
//                 <span className="text-slate-300 font-semibold">
//                   {course.professor.speciality}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Componente principal
// const CoursesPage = () => {
//   const [showRealCourses, setShowRealCourses] = useState(false);
//   const [coursesData, setCoursesData] = useState<Course[]>([]);

//   useEffect(() => {
//     const fectchCourses = async () => {
//       try {
//         const data = await getAllCoursesService();
//         setCoursesData(data);
//       } catch (error) {
//         console.log();
//         throw error;
//       }
//     };
//     fectchCourses();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] p-8 md:p-20">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-12">
//           <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
//             Nuestros Cursos
//           </h2>
//           <p className="text-slate-300 text-lg mb-6">
//             Descubre una amplia variedad de cursos especializados para impulsar
//             tu carrera en tecnología
//           </p>

//           {/* Toggle */}
//           <div className="flex items-center gap-4 mb-8">
//             <button
//               onClick={() => setShowRealCourses(false)}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                 !showRealCourses
//                   ? "bg-[#7e4bde] text-white shadow-lg"
//                   : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
//               }`}
//             >
//               Cursos Demo
//             </button>
//             <button
//               onClick={() => setShowRealCourses(true)}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
//                 showRealCourses
//                   ? "bg-[#7e4bde] text-white shadow-lg"
//                   : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
//               }`}
//             >
//               Cursos Reales
//             </button>
//           </div>
//         </div>

//         {/* Grid de cursos */}
//         <div className="space-y-8">
//           {showRealCourses ? (
//             <RealCoursesGrid />
//           ) : (
//             coursesData.map((course) => {
//               const config =
//                 categoryConfig[course.category as keyof typeof categoryConfig];
//               return (
//                 <CourseCard key={course.id} course={course} config={config} />
//               );
//             })
//           )}
//         </div>

//         {/* Estadísticas */}
//         <div className="  mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
//             <h3 className="text-3xl font-bold text-white mb-2">
//               {showRealCourses ? "∞" : `${coursesData.length}+`}
//             </h3>
//             <p className="text-slate-300">
//               {showRealCourses
//                 ? "Cursos Creados por Profesores"
//                 : "Cursos Demo"}
//             </p>
//           </div>
//           <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
//             <h3 className="text-3xl font-bold text-white mb-2">200+</h3>
//             <p className="text-slate-300">Horas de Contenido</p>
//           </div>
//           <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
//             <h3 className="text-3xl font-bold text-white mb-2">10+</h3>
//             <p className="text-slate-300">Instructores Expertos</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CoursesPage;
///////////////////////////////////////MIO

"use client";
import React, { useEffect, useState } from "react";
import { Course } from "@/types/course.types";
import { useAuth } from "@/context/UserContext";
import { useAddToCart } from "@/hooks/useAddToCart";
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
  FaRobot,
} from "react-icons/fa";
import { getAllCoursesService } from "@/services/course.service";
import { getProfessorCoursesService } from "@/services/course.services";

// Configuración de categorías
const categoryConfig: Record<string, any> = {
  "Frontend Development": {
    icon: FaCode,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-500/10 border-blue-500/30",
    textColor: "text-blue-400",
  },
  "Backend Development": {
    icon: FaServer,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconGradient: "from-green-500 to-emerald-500",
    badgeColor: "bg-green-500/10 border-green-500/30",
    textColor: "text-green-400",
  },
  Backend: {
    icon: FaServer,
    gradient: "from-green-500/20 to-emerald-500/20",
    iconGradient: "from-green-500 to-emerald-500",
    badgeColor: "bg-green-500/10 border-green-500/30",
    textColor: "text-green-400",
  },
  Frontend: {
    icon: FaCode,
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconGradient: "from-blue-500 to-cyan-500",
    badgeColor: "bg-blue-500/10 border-blue-500/30",
    textColor: "text-blue-400",
  },
  "Mobile Development": {
    icon: FaMobileAlt,
    gradient: "from-purple-500/20 to-pink-500/20",
    iconGradient: "from-purple-500 to-pink-500",
    badgeColor: "bg-purple-500/10 border-purple-500/30",
    textColor: "text-purple-400",
  },
  "Data Science": {
    icon: FaChartBar,
    gradient: "from-orange-500/20 to-red-500/20",
    iconGradient: "from-orange-500 to-red-500",
    badgeColor: "bg-orange-500/10 border-orange-500/30",
    textColor: "text-orange-400",
  },
  Database: {
    icon: FaDatabase,
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconGradient: "from-teal-500 to-cyan-500",
    badgeColor: "bg-teal-500/10 border-teal-500/30",
    textColor: "text-teal-400",
  },
  "Cloud Computing": {
    icon: FaCloud,
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconGradient: "from-indigo-500 to-blue-500",
    badgeColor: "bg-indigo-500/10 border-indigo-500/30",
    textColor: "text-indigo-400",
  },
  "Artificial Intelligence": {
    icon: FaRobot,
    gradient: "from-pink-500/20 to-rose-500/20",
    iconGradient: "from-pink-500 to-rose-500",
    badgeColor: "bg-pink-500/10 border-pink-500/30",
    textColor: "text-pink-400",
  },
  Cybersecurity: {
    icon: FaShieldAlt,
    gradient: "from-red-500/20 to-pink-500/20",
    iconGradient: "from-red-500 to-pink-500",
    badgeColor: "bg-red-500/10 border-red-500/30",
    textColor: "text-red-400",
  },
  "Game Development": {
    icon: FaGamepad,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconGradient: "from-violet-500 to-purple-500",
    badgeColor: "bg-violet-500/10 border-violet-500/30",
    textColor: "text-violet-400",
  },
  "UI/UX Design": {
    icon: FaPaintBrush,
    gradient: "from-yellow-500/20 to-orange-500/20",
    iconGradient: "from-yellow-500 to-orange-500",
    badgeColor: "bg-yellow-500/10 border-yellow-500/30",
    textColor: "text-yellow-400",
  },
};

// Config por defecto si no encuentra la categoría
const defaultConfig = {
  icon: FaCode,
  gradient: "from-gray-500/20 to-slate-500/20",
  iconGradient: "from-gray-500 to-slate-500",
  badgeColor: "bg-gray-500/10 border-gray-500/30",
  textColor: "text-gray-400",
};

const CoursesPage = () => {
  const { user, token } = useAuth();
  const { handleAddToCart } = useAddToCart();

  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [showMyCoursesOnly, setShowMyCoursesOnly] = useState(false);

  // Fetch de todos los cursos al cargar
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const data = await getAllCoursesService();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchAllCourses();
  }, []);

  // Cuando cambia el toggle
  const handleToggle = async (showMine: boolean) => {
    setShowMyCoursesOnly(showMine);

    if (showMine && user?.professorProfile?.id && token) {
      try {
        const data = await getProfessorCoursesService(
          user.professorProfile.id,
          token
        );
        setMyCourses(data);
      } catch (error) {
        console.error("Error fetching professor courses:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] p-8 md:p-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Nuestros Cursos
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Descubre una amplia variedad de cursos especializados para impulsar
            tu carrera en tecnología
          </p>

          {/* Toggle */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => handleToggle(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                !showMyCoursesOnly
                  ? "bg-[#7e4bde] text-white shadow-lg"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
              }`}
            >
              Todos los Cursos
            </button>

            {user?.professorProfile && (
              <button
                onClick={() => handleToggle(true)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  showMyCoursesOnly
                    ? "bg-[#7e4bde] text-white shadow-lg"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50"
                }`}
              >
                Mis Cursos
              </button>
            )}
          </div>
        </div>

        {/* Grid de cursos */}
        <div className="space-y-8">
          {courses.map((course) => {
            const config = categoryConfig[course.category] || defaultConfig;
            const Icon = config.icon;

            return (
              <div
                key={course.id}
                className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                  {/* Ícono */}
                  <div className="flex-shrink-0">
                    <div
                      className={`bg-gradient-to-br ${config.iconGradient} p-4 rounded-xl shadow-lg w-20 h-20 flex items-center justify-center`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white text-2xl font-bold flex-1">
                          {course.title}
                        </h3>
                        <button
                          onClick={() => handleAddToCart(course)}
                          className="bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300"
                        >
                          Agregar a carrito
                        </button>
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
                        {course.difficulty}
                      </span>
                      <span
                        className={`${config.badgeColor} border ${config.textColor} text-xs px-3 py-1.5 rounded-lg font-semibold`}
                      >
                        {course.category}
                      </span>
                      <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-3 py-1.5 rounded-lg font-semibold">
                        ${course.price}
                      </span>
                    </div>

                    {/* Info del profesor */}
                    <div className="border-t border-slate-700/50 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-slate-400 text-xs">
                          <span className="text-slate-500">Instructor: </span>
                          {/* <span className="text-slate-300 font-semibold">
                            {course.professor.user.name}
                          </span> */}
                        </div>
                        <div className="text-slate-400 text-xs">
                          <span className="text-slate-500">Especialidad: </span>
                          {/* <span className="text-slate-300 font-semibold">
                            {course.professor.speciality}
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Estadísticas */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
            <h3 className="text-3xl font-bold text-white mb-2">
              {courses.length}+
            </h3>
            <p className="text-slate-300">
              {showMyCoursesOnly ? "Mis Cursos" : "Cursos Disponibles"}
            </p>
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

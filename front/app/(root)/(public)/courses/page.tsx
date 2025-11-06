"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Course, CourseCategory } from "@/types/course.types";
import { useAuth } from "@/context/UserContext";
import { useAddToCart } from "@/hooks/useAddToCart";
import { categoryConfig } from "@/helpers/course.helpers";
import { getAllCoursesService } from "@/services/course.service";
import { getProfessorCoursesService } from "@/services/course.services";

const CoursesPage = () => {
  const { user, token } = useAuth();
  const { handleAddToCart } = useAddToCart();
  const router = useRouter();

  // Función para obtener colores de dificultad
  const getDifficultyColors = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'principiante':
      case 'beginner':
      case 'básico':
        return 'bg-green-500/10 border border-green-500/30 text-green-400';
      case 'intermedio':
      case 'intermediate':
        return 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400';
      case 'avanzado':
      case 'advanced':
        return 'bg-red-500/10 border border-red-500/30 text-red-400';
      default:
        return 'bg-slate-700/50 text-slate-300';
    }
  };

  const [courses, setCourses] = useState<Course[]>([]);
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

    if (
      showMine &&
      user?.professorProfile &&
      typeof user.professorProfile === "object" &&
      user.professorProfile.id &&
      token
    ) {
      try {
        console.log(
          "🔍 Fetching professor courses for ID:",
          user.professorProfile.id
        );
        const data = await getProfessorCoursesService(
          user.professorProfile.id,
          token
        );
        console.log("📚 Professor courses fetched:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching professor courses:", error);
      }
    } else {
      try {
        console.log("🔍 Fetching all courses");
        const data = await getAllCoursesService();
        console.log("📚 All courses fetched:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching all courses:", error);
      }
    }
  };

  return (
    <div className="min-h-screen  p-8 md:p-15">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-center flex-col items-center">
          <div className="inline-flex px-4 py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-6">
            <span className="text-font-light font-semibold md:text-lg">
              Nuestros cursos
            </span>
          </div>

          <p className="text-slate-300 font-extrabold text-5xl text-center mb-6">
            Descubre una amplia variedad de cursos.
            <br />
            <span className="text-accent-medium">
              {" "}
              Impulsar tu carrera en tecnología.
            </span>
          </p>
        </div>

        {/* Grid de cursos */}
        <div className="space-y-8">
          {courses.map((course) => {
            const config = categoryConfig[course.category] || categoryConfig[CourseCategory.FRONTEND];
            const Icon = config.icon;

            // Verificar si este curso pertenece al profesor actual
            const isOwnCourse =
              user?.professorProfile &&
              typeof user.professorProfile === "object" &&
              course.professor?.id === user.professorProfile.id;

            // Debug log para verificar la lógica
            if (
              user?.professorProfile &&
              typeof user.professorProfile === "object"
            ) {
              console.log(`🔍 Curso "${course.title}":`, {
                courseId: course.id,
                courseProfessorId: course.professor?.id,
                currentProfessorId: user.professorProfile.id,
                isOwnCourse: isOwnCourse,
              });
            }

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
                        {/* Mostrar botón "Agregar a carrito" solo si no es el curso del profesor actual */}
                        {!isOwnCourse ? (
                          <button
                            onClick={() => handleAddToCart(course)}
                            className="bg-slate-700/50 hover:bg-slate-600/50 px-4 py-2 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300"
                          >
                            Agregar a carrito
                          </button>
                        ) : (
                          <div className="px-4 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-semibold">
                            Tu curso
                          </div>
                        )}
                        <button 
                          onClick={() => router.push(`/course/${course.id}`)}
                          className="ml-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 cursor-pointer"
                        >
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
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${getDifficultyColors(course.difficulty)}`}>
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
                          <span className="text-slate-300 font-semibold">
                            {course.professor?.user?.name || 'No disponible'}
                          </span>
                        </div>
                        <div className="text-slate-400 text-xs">
                          <span className="text-slate-500">Especialidad: </span>
                          <span className="text-slate-300 font-semibold">
                            {course.professor?.speciality || 'No disponible'}
                          </span>
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

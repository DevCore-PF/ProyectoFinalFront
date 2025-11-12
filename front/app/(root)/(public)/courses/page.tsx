"use client";

//Next/React
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
//Types
import { Course, CourseCategory } from "@/types/course.types";
//Context
import { useAuth } from "@/context/UserContext";
//Helpers
import { useAddToCart } from "@/hooks/useAddToCart";
import { categoryConfig } from "@/helpers/course.helpers";
import { getDifficultyColors } from "@/helpers/moks";
//Services
import { getAllPublicCoursesService } from "@/services/course.service";
import { purchasedCoursesService, PurchasedCourse } from "@/services/purchased-courses.service";
//Components
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";

const CoursesPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [showMyCoursesOnly, setShowMyCoursesOnly] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { handleAddToCart, loadingAddToCart } = useAddToCart();

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await getAllPublicCoursesService();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching public courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchAllCourses();
  }, []);

  // Cargar cursos comprados si el usuario está logueado
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      if (user && token) {
        try {
          const purchasedData = await purchasedCoursesService.getMyPurchasedCourses(token);
          setPurchasedCourses(purchasedData);
        } catch (error) {
          console.error("Error fetching purchased courses:", error);
          // No mostramos error al usuario, simplemente no cargamos los cursos comprados
        }
      } else {
        setPurchasedCourses([]);
      }
    };
    fetchPurchasedCourses();
  }, [user, token]);

  const handleReload = () => {
    setLoadingCourses(true);
    window.location.reload();
    setLoadingCourses(false);
  };
  if (loadingCourses) return(<div className="flex flex-col min-h-screen justify-center items-center">
      <Loader size="medium" />
      <p className="text-slate-400">Cargando...</p>
    </div>)
  return (
    <div className="min-h-screen">
      {courses.length ? (
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

            <div className="space-y-8">
              {courses.map((course) => {
                const config =
                  categoryConfig[course.category] ||
                  categoryConfig[CourseCategory.FRONTEND];
                const Icon = config.icon;

                const isOwnCourse =
                  user?.professorProfile &&
                  typeof user.professorProfile === "object" &&
                  course.professor?.id === user.professorProfile.id;

                const isPurchasedCourse = purchasedCourses.some(
                  (purchasedCourse) => purchasedCourse.id === course.id
                );

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

                      <div className="flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white text-2xl font-bold flex-1">
                              {course.title}
                            </h3>
                            {!isOwnCourse && !isPurchasedCourse ? (
                              <button
                                disabled={loadingAddToCart ? true : false}
                                onClick={() => handleAddToCart(course)}
                                className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 px-4 py-2 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300 disabled:hover:bg-slate-700/50 disabled:cursor-not-allowed"
                              >
                                {loadingAddToCart === course.id ? (
                                  <div className="flex items-center gap-2">
                                    <TinyLoader />
                                    <span>Agregando...</span>
                                  </div>
                                ) : (
                                  "Agregar al carrito"
                                )}
                              </button>
                            ) : isOwnCourse ? (
                              <div className="px-4 py-2 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-semibold">
                                Tu curso
                              </div>
                            ) : isPurchasedCourse ? (
                              <div className="px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold">
                                Curso comprado
                              </div>
                            ) : null}
                            <button
                              onClick={() =>
                                router.push(`/course/${course.id}`)
                              }
                              className="ml-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 cursor-pointer"
                            >
                              Ver Curso
                            </button>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg font-medium">
                            {course.duration}
                          </span>
                          <span
                            className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${getDifficultyColors(
                              course.difficulty
                            )}`}
                          >
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

                        <div className="border-t border-slate-700/50 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-slate-400 text-xs">
                              <span className="text-slate-500">
                                Instructor:{" "}
                              </span>
                              <span className="text-slate-300 font-semibold">
                                {course.professor?.user?.name ||
                                  "No disponible"}
                              </span>
                            </div>
                            <div className="text-slate-400 text-xs">
                              <span className="text-slate-500">
                                Especialidad:{" "}
                              </span>
                              <span className="text-slate-300 font-semibold">
                                {course.professor?.speciality ||
                                  "No disponible"}
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
      ) : (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icono */}
            <div className="mb-8">
              <div className="inline-flex p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl">
                <svg
                  className="w-24 h-24 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>

            {/* Título */}
            <h2 className="text-4xl font-bold text-white mb-4">
              No hay cursos disponibles
            </h2>

            {/* Descripción */}
            <p className="text-slate-300 text-lg mb-8">
              Actualmente no tenemos cursos publicados. Vuelve pronto para
              descubrir contenido increíble que impulsará tu carrera en
              tecnología.
            </p>

            {/* Botones opcionales */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/")}
                className="bg-button hover:bg-button/80 cursor-pointer px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-button/30"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => handleReload()}
                className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 px-6 py-3 rounded-lg text-slate-200 font-semibold transition-all duration-300"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;

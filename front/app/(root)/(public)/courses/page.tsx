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
import {
  purchasedCoursesService,
  PurchasedCourse,
} from "@/services/purchased-courses.service";
//Components
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";

const CoursesPage = () => {
  const { user, token } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>(
    []
  );
  const [showMyCoursesOnly, setShowMyCoursesOnly] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { handleAddToCart, loadingAddToCart } = useAddToCart();

  // Estados para paginación y filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const coursesPerPage = 6;

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
          const purchasedData =
            await purchasedCoursesService.getMyPurchasedCourses(token);
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

  // Filtrar cursos
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    
    // Comparar directamente con el valor del enum (que viene en español del backend)
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calcular paginación
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  // Obtener categorías únicas
  const uniqueCategories = Array.from(new Set(courses.map(course => course.category)));

  if (loadingCourses)
    return (
      <div className="flex flex-col min-h-screen justify-center items-center p-4">
        <Loader size="medium" />
        <p className="text-slate-400 text-sm sm:text-base">Cargando...</p>
      </div>
    );
  return (
    <div className="min-h-screen">
      {courses.length ? (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 xl:p-15">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 sm:mb-12 flex justify-center flex-col items-center">
              <div className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 bg-button/10 backdrop-blur-sm border border-button/30 rounded-full mb-4 sm:mb-6">
                <span className="text-font-light font-semibold text-sm sm:text-base lg:text-lg">
                  Nuestros cursos
                </span>
              </div>

              <p className="text-slate-300 font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-center mb-4 sm:mb-6 px-4">
                Descubre una amplia variedad de cursos.
                <br />
                <span className="text-accent-medium">
                  {" "}
                  Impulsar tu carrera en tecnología.
                </span>
              </p>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Búsqueda */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Buscar curso
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-lg text-font-light text-sm placeholder:text-slate-500 focus:outline-none focus:border-button/50 focus:ring-1 focus:ring-button/50 transition-all"
                  />
                </div>

                {/* Filtro por categoría */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Categoría
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-lg text-font-light text-sm focus:outline-none focus:border-button/50 focus:ring-1 focus:ring-button/50 transition-all"
                  >
                    <option value="all">Todas</option>
                    {uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filtro por dificultad */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                    Dificultad
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-lg text-font-light text-sm focus:outline-none focus:border-button/50 focus:ring-1 focus:ring-button/50 transition-all"
                  >
                    <option value="all">Todas</option>
                    <option value="PRINCIPIANTE">Principiante</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                </div>
              </div>

              {/* Indicador de resultados */}
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <p className="text-slate-400">
                  Mostrando <span className="text-font-light font-semibold">{indexOfFirstCourse + 1}</span> - <span className="text-font-light font-semibold">{Math.min(indexOfLastCourse, filteredCourses.length)}</span> de{" "}
                  <span className="text-font-light font-semibold">{filteredCourses.length}</span> cursos
                </p>
                {(searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                    }}
                    className="text-accent-medium hover:text-accent-light transition-colors whitespace-nowrap"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {currentCourses.map((course) => {
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
                    className="group bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl sm:rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-[#3f4273]/70"
                  >
                    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8">
                      {/* Ícono */}
                      <div className="flex-shrink-0">
                        <div
                          className={`bg-gradient-to-br ${config.iconGradient} p-3 sm:p-4 rounded-xl shadow-lg w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center`}
                        >
                          <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-font-light" />
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col min-w-0">
                        {/* Título y precio */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <h3 className="text-font-light text-lg sm:text-xl lg:text-2xl font-bold break-words">
                            {course.title}
                          </h3>
                          <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-base sm:text-lg lg:text-xl px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap self-start">
                            ${course.price}
                          </span>
                        </div>

                        {/* Descripción */}
                        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                          {course.description}
                        </p>

                        {/* Botones solo en móvil - ocultos en desktop */}
                        <div className="flex flex-col gap-2 mb-4 md:hidden">
                          {!isOwnCourse && !isPurchasedCourse ? (
                            <button
                              disabled={loadingAddToCart ? true : false}
                              onClick={() => handleAddToCart(course)}
                              className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 px-4 py-2.5 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300 disabled:hover:bg-slate-700/50 disabled:cursor-not-allowed w-full text-center"
                            >
                              {loadingAddToCart === course.id ? (
                                <div className="flex items-center justify-center gap-2">
                                  <TinyLoader />
                                  <span>Agregando...</span>
                                </div>
                              ) : (
                                "Agregar al carrito"
                              )}
                            </button>
                          ) : isOwnCourse ? (
                            <div className="px-4 py-2.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-semibold text-center">
                              Tu curso
                            </div>
                          ) : isPurchasedCourse ? (
                            <div className="px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold text-center">
                              Curso comprado
                            </div>
                          ) : null}
                          <button
                            onClick={() => router.push(`/course/${course.id}`)}
                            className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2.5 rounded-lg text-font-light text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 cursor-pointer w-full text-center"
                          >
                            Ver Curso
                          </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="bg-slate-700/50 text-slate-300 text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium">
                            {course.duration}
                          </span>
                          <span
                            className={`text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold ${getDifficultyColors(
                              course.difficulty
                            )}`}
                          >
                            {course.difficulty}
                          </span>
                          <span
                            className={`${config.badgeColor} border ${config.textColor} text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-semibold`}
                          >
                            {course.category}
                          </span>
                        </div>

                        {/* Footer con info del instructor y botones en desktop */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 sm:gap-4 mt-auto pt-4 border-t border-slate-700/50">
                          {/* Info del instructor */}
                          <div className="flex flex-col gap-2 text-xs">
                            <div className="text-slate-400">
                              <span className="text-slate-500">Instructor: </span>
                              <span className="text-slate-300 font-semibold break-words">
                                {course.professor?.user?.name || "No disponible"}
                              </span>
                            </div>
                            <div className="text-slate-400">
                              <span className="text-slate-500">Especialidad: </span>
                              <span className="text-slate-300 font-semibold break-words">
                                {course.professor?.speciality ||
                                  course.professor?.profession ||
                                  "No disponible"}
                              </span>
                            </div>
                          </div>

                          {/* Botones en desktop - ocultos en móvil */}
                          <div className="hidden md:flex gap-3 flex-shrink-0">
                            {!isOwnCourse && !isPurchasedCourse ? (
                              <button
                                disabled={loadingAddToCart ? true : false}
                                onClick={() => handleAddToCart(course)}
                                className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 px-4 py-2.5 rounded-lg text-slate-200 text-sm font-semibold transition-all duration-300 disabled:hover:bg-slate-700/50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {loadingAddToCart === course.id ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <TinyLoader />
                                    <span>Agregando...</span>
                                  </div>
                                ) : (
                                  "Agregar al carrito"
                                )}
                              </button>
                            ) : isOwnCourse ? (
                              <div className="px-4 py-2.5 rounded-lg bg-green-600/20 border border-green-500/30 text-green-300 text-sm font-semibold whitespace-nowrap">
                                Tu curso
                              </div>
                            ) : isPurchasedCourse ? (
                              <div className="px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold whitespace-nowrap">
                                Curso comprado
                              </div>
                            ) : null}
                            <button
                              onClick={() => router.push(`/course/${course.id}`)}
                              className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-5 py-2.5 rounded-lg text-font-light text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#7e4bde]/30 cursor-pointer whitespace-nowrap"
                            >
                              Ver Curso
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm hover:bg-slate-700/50 hover:text-font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold transition-all text-sm flex-shrink-0 ${
                        currentPage === page
                          ? "bg-button text-font-light shadow-lg shadow-button/30"
                          : "bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-font-light"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 text-sm hover:bg-slate-700/50 hover:text-font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-800/50"
                >
                  Siguiente →
                </button>
              </div>
            )}

            {/* Mensaje si no hay resultados */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="inline-flex p-4 sm:p-6 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl mb-4">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-2">
                  No se encontraron cursos
                </h3>
                <p className="text-slate-400 mb-6 text-sm sm:text-base">
                  No hay cursos que coincidan con los filtros seleccionados
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                  }}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-button hover:bg-button/80 text-font-light rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base"
                >
                  Limpiar filtros
                </button>
              </div>
            )}

            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-font-light mb-2">
                  {courses.length}+
                </h3>
                <p className="text-slate-300 text-sm sm:text-base">
                  {showMyCoursesOnly ? "Mis Cursos" : "Cursos Disponibles"}
                </p>
              </div>
              <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-font-light mb-2">
                  200+
                </h3>
                <p className="text-slate-300 text-sm sm:text-base">Horas de Contenido</p>
              </div>
              <div className="bg-[#3f4273]/20 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-bold text-font-light mb-2">10+</h3>
                <p className="text-slate-300 text-sm sm:text-base">Instructores Expertos</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Icono */}
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex p-6 sm:p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl sm:rounded-3xl">
                <svg
                  className="w-16 h-16 sm:w-24 sm:h-24 text-slate-600"
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-font-light mb-4">
              No hay cursos disponibles
            </h2>

            {/* Descripción */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 px-4">
              Actualmente no tenemos cursos publicados. Vuelve pronto para
              descubrir contenido increíble que impulsará tu carrera en
              tecnología.
            </p>

            {/* Botones opcionales */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => router.push("/")}
                className="bg-button hover:bg-button/80 cursor-pointer px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-font-light font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-button/30 text-sm sm:text-base"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => handleReload()}
                className="bg-slate-700/50 cursor-pointer hover:bg-slate-600/50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-slate-200 font-semibold transition-all duration-300 text-sm sm:text-base"
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

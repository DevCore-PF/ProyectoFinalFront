"use client";
import { useState, useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  HiArrowLeft,
  HiBookOpen,
  HiCheckCircle,
  HiBan,
  HiStar,
  HiClock,
  HiCalendar,
  HiCurrencyDollar,
  HiUserCircle,
  HiAcademicCap,
} from "react-icons/hi";
import Loader from "../Loaders/Loader";

interface CourseDetailsProps {
  courseId: string;
  onBack: () => void;
}

const CourseDetails = ({ courseId, onBack }: CourseDetailsProps) => {
  const { courses } = useAdmin();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundCourse = courses.find((c) => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
    }
    setIsLoading(false);
  }, [courseId, courses]);

  {/* ============[ RENDER STARS ]============= */}
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <HiStar
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  {/* ============[ CALCULAR RATING PROMEDIO ]============= */}
  const getAverageRating = () => {
    if (!course?.feedback || course.feedback.length === 0) return 0;
    const sum = course.feedback.reduce((acc: number, f: any) => acc + f.rating, 0);
    return (sum / course.feedback.length).toFixed(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleToggleActive = () => {
    // TODO: Implementar cuando esté el service del backend
    console.log("Toggle active para curso:", courseId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <HiBookOpen className="w-24 h-24 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Curso no encontrado</h2>
          <p className="text-slate-400 mb-6">
            No se pudo cargar la información del curso
          </p>
          <button
            onClick={onBack}
            className="bg-button/80 cursor-pointer hover:bg-button text-font-light px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ============[ HEADER CON NAVEGACIÓN ]============= */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-font-light transition-colors mb-4"
          >
            <HiArrowLeft className="w-5 h-5" />
            Volver a cursos
          </button>

          {/* ============[ BANNER SI ESTÁ INACTIVO ]============= */}
          {!course.isActive && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <HiBan className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <p className="text-amber-200 font-semibold text-lg">
                    Curso Inactivo
                  </p>
                  <p className="text-amber-300/80 text-sm">
                    Este curso no está visible para los estudiantes. Puedes activarlo usando
                    el botón a continuación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============[ HEADER PRINCIPAL ]============= */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-button to-accent-dark rounded-xl flex items-center justify-center">
                  <HiBookOpen className="w-10 h-10 text-font-light" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-font-light mb-1">
                    {course.title}
                  </h1>
                  <p className="text-slate-400">{course.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-purple-400/10 border border-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 bg-blue-400/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                      {course.difficulty}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                        course.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {course.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleToggleActive}
                  className={`flex items-center cursor-pointer gap-2 bg-slate-700/50 hover:bg-slate-700/90 border px-4 py-2 rounded-lg font-medium transition-all ${
                    course.isActive
                      ? "border-amber-300/50 text-amber-300"
                      : "border-emerald-400/50 text-emerald-200"
                  }`}
                >
                  {course.isActive ? (
                    <>
                      <HiBan className="w-5 h-5" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <HiCheckCircle className="w-5 h-5" />
                      Activar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============[ GRID DE INFORMACIÓN ]============= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============[ COLUMNA IZQUIERDA - INFO GENERAL ]============= */}
          <div className="lg:col-span-1 space-y-6">
            {/* ============[ INFORMACIÓN BÁSICA ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiBookOpen className="w-6 h-6" />
                Información del Curso
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">ID del Curso</p>
                  <p className="text-font-light font-mono text-sm bg-slate-800/50 px-3 py-2 rounded">
                    {course.id}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Tipo</p>
                  <p className="text-font-light">{course.type}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Duración</p>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-4 h-4 text-slate-400" />
                    <p className="text-font-light">{course.duration}</p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Precio</p>
                  <div className="flex items-center gap-2">
                    <HiCurrencyDollar className="w-5 h-5 text-emerald-400" />
                    <p className="text-emerald-400 text-xl font-bold">
                      ${course.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Profesor</p>
                  <div className="flex items-center gap-2">
                    <HiAcademicCap className="w-4 h-4 text-slate-400" />
                    <p className="text-font-light">
                      {course.professor || "Sin asignar"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-sm mb-1">Estado de revisión</p>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                    {course.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ============[ FECHAS ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiCalendar className="w-6 h-6" />
                Fechas
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Creación</p>
                  <p className="text-font-light text-sm">{formatDate(course.createdAt)}</p>
                </div>

                {course.updatedAt && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Última actualización</p>
                    <p className="text-font-light text-sm">{formatDate(course.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============[ COLUMNA DERECHA - LECCIONES Y FEEDBACK ]============= */}
          <div className="lg:col-span-2 space-y-6">
            {/* ============[ ESTADÍSTICAS RÁPIDAS ]============= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <HiBookOpen className="w-6 h-6 text-accent-light" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Lecciones</p>
                    <p className="text-2xl font-bold text-font-light">
                      {course.lessons?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-yellow-500/10 rounded-lg">
                    <HiStar className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Rating promedio</p>
                    <p className="text-2xl font-bold text-font-light">
                      {getAverageRating() || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <HiUserCircle className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Reviews</p>
                    <p className="text-2xl font-bold text-font-light">
                      {course.feedback?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ============[ LECCIONES ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiBookOpen className="w-6 h-6" />
                Lecciones
                <span className="text-sm font-normal text-slate-400">
                  ({course.lessons?.length || 0})
                </span>
              </h2>

              {course.lessons && course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-slate-400 font-mono text-sm">
                              #{index + 1}
                            </span>
                            <h3 className="text-font-light font-semibold">
                              {lesson.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span
                              className={`px-2 py-1 rounded ${
                                lesson.isActive
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {lesson.isActive ? "Activa" : "Inactiva"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded ${
                                lesson.esPreview
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-slate-500/10 text-slate-400"
                              }`}
                            >
                              {lesson.esPreview ? "Preview" : "Privada"}
                            </span>
                            <span className="text-slate-400">
                              {formatDate(lesson.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiBookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Este curso no tiene lecciones todavía</p>
                </div>
              )}
            </div>

            {/* ============[ FEEDBACK ]============= */}
            <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-font-light mb-4 flex items-center gap-2">
                <HiStar className="w-6 h-6" />
                Reviews y Feedback
                <span className="text-sm font-normal text-slate-400">
                  ({course.feedback?.length || 0})
                </span>
              </h2>

              {course.feedback && course.feedback.length > 0 ? (
                <div className="space-y-4">
                  {course.feedback.map((review: any) => (
                    <div
                      key={review.id}
                      className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        {review.user.image ? (
                          <img
                            src={review.user.image}
                            alt={review.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-button/60"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold border bg-gradient-to-br from-slate-600 to-slate-700 border-slate-600">
                            {review.user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-font-light font-semibold">
                                {review.user.name}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-slate-300 text-sm">{review.feedback}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiStar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">
                    Este curso no tiene reviews todavía
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
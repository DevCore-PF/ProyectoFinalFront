"use client";
import TeacherWelcomeCard from "@/components/dashboard/TeacherWelcomeCard";
import TeacherCourseCard from "@/components/dashboard/TeacherCourseCard";
import ValidationMessage from "@/components/dashboard/ValidationMessage";
import ProfessionalValidationForm from "@/components/dashboard/ProfessionalValidationForm";
import { PurchasedCoursesGrid } from "@/components/PurchasedCoursesGrid";
import { teacherFeaturedCourses, teacherRecentActivity } from "@/helpers/moks";
import { CourseVisibility } from "@/types/course.types";
import { HiBookOpen, HiTrendingUp, HiChartBar, HiShoppingCart } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useTeacherValidation } from "@/hooks/useTeacherValidation";
import { useProfessorCourses } from "@/hooks/useProfessorCourses";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";

const TeacherDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const {
    validationStatus,
    isLoading: validationLoading,
    canCreateCourses,
    needsValidation,
    isRejected,
    submitValidation,
    isSubmitting,
    isApproved,
  } = useTeacherValidation();

  const {
    courses: professorCourses,
    isLoading: coursesLoading,
    error: coursesError,
    refreshCourses,
    hasCourses,
  } = useProfessorCourses();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'created' | 'purchased'>('created');

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "teacher") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  const handleViewCourseDetails = (courseId: string) => {
    console.log(`Ver detalles del curso: ${courseId}`);
    // desde aca se puede agregar navegación al detalle del curso
    // router.push(`/teacher-dashboard/courses/${courseId}`);
  };

  const handleVisibilityChange = (courseId: string, newVisibility: CourseVisibility) => {
    console.log(`🔄 Visibilidad del curso ${courseId} cambiada a: ${newVisibility}`);
    // Refrescar los cursos después de cambiar la visibilidad para obtener el estado actualizado
    refreshCourses();
  };

  const handleSubmitValidation = async (formData: FormData) => {
    try {
      await submitValidation(formData);
      toastSuccess("Perfil enviado para revisión exitosamente");
      setShowForm(false);
    } catch {
      toastError("Error al enviar el perfil");
    }
  };

  const handleShowValidationForm = () => {
    setShowForm(true);
  };

  const handleHideValidationForm = () => {
    setShowForm(false);
  };

  if (isLoading || validationLoading) {
    return <Loader />;
  }
  console.log("este es paroved: ", isApproved);
  console.log("este es status", validationStatus);

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 relative z-10">
          <TeacherWelcomeCard
            userName={user?.name}
            userEmail={user?.email}
            profileImage={user?.profileImage}
          />
        </div>

        {validationStatus && (
          <div className="mb-6">
            <ValidationMessage
              status={validationStatus?.status}
              onActionClick={handleShowValidationForm}
            />
          </div>
        )}
        
        {(needsValidation || isRejected) && !showForm && (
          <div className="mb-6 text-center">
            <button
              onClick={handleShowValidationForm}
              className="px-6 py-3 bg-button/80 cursor-pointer  hover:bg-button text-white font-medium rounded-lg transition-all duration-200"
            >
              {needsValidation
                ? "Completar Perfil Profesional"
                : "Actualizar Perfil"}
            </button>
          </div>
        )}

        {showForm && (
          <div className="mb-6">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleHideValidationForm}
                className="text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
            <ProfessionalValidationForm
              onSubmit={handleSubmitValidation}
              isSubmitting={isSubmitting}
            />
          </div>
        )}
        
        <div
          className={`bg-background2/40 border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300 ${
            !canCreateCourses ? "opacity-50" : ""
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-500/10 rounded-lg">
              <HiBookOpen className="w-6 h-6 text-accent-light" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-slate-200">
                GESTIÓN DE CURSOS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {canCreateCourses
                  ? "Gestiona tus cursos creados y los que has comprado"
                  : "Completa tu validación profesional para crear cursos"}
              </p>
            </div>
          </div>

          {canCreateCourses ? (
            <>
              {/* Tabs */}
              <div className="flex border-b border-slate-700/50 mb-6">
                <button
                  onClick={() => setActiveTab('created')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'created'
                      ? 'text-blue-400 border-blue-400'
                      : 'text-slate-400 border-transparent hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HiBookOpen className="w-4 h-4" />
                    Cursos Creados
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('purchased')}
                  className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                    activeTab === 'purchased'
                      ? 'text-green-400 border-green-400'
                      : 'text-slate-400 border-transparent hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HiShoppingCart className="w-4 h-4" />
                    Cursos Comprados
                  </div>
                </button>
              </div>

              {/* Contenido de tabs */}
              {activeTab === 'created' ? (
                <>
                  {coursesLoading ? (
                    <div className="text-center py-16 text-slate-400 justify-center flex flex-col items-center gap-4">
                      <TinyLoader />
                      <p>Cargando cursos...</p>
                    </div>
                  ) : coursesError ? (
                    <div className="text-center py-16 text-amber-400 bg-amber-800/20 rounded-xl border border-amber-700/20">
                      <p className="text-lg  text-amber-400 mb-2">
                        Error al cargar cursos
                      </p>
                      <p className="text-sm mb-4">{coursesError}</p>
                      <button
                        onClick={refreshCourses}
                        className="px-4 py-2 bg-amber-500/20 cursor-pointer hover:bg-amber-600/30 text-amber-300 rounded-lg transition-colors"
                      >
                        Reintentar
                      </button>
                    </div>
                  ) : hasCourses ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {professorCourses.map((course) => (
                        <TeacherCourseCard
                          key={course.id}
                          course={course}
                          viewDetails={handleViewCourseDetails}
                          onVisibilityChange={handleVisibilityChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
                      <HiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-semibold text-slate-300 mb-2">
                        No tienes cursos creados aún
                      </p>
                      <p className="text-sm mb-4">
                        ¡Comienza creando tu primer curso!
                      </p>
                      <button
                        onClick={() =>
                          router.push("/teacher-dashboard/create-course")
                        }
                        className="px-6 py-3 bg-accent-medium hover:bg-accent-light text-white font-medium rounded-lg transition-all duration-200"
                      >
                        Crear mi primer curso
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <PurchasedCoursesGrid />
              )}
            </>
          ) : (
            <div className="text-center py-16 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
              <HiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold text-slate-300 mb-2">
                Validación Requerida
              </p>
              <p className="text-sm">
                Completa tu perfil profesional para poder crear cursos
              </p>
            </div>
          )}
        </div>

        {/* Estadísticas - solo si puede crear cursos */}
        {canCreateCourses && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-10">
            <div className="lg:col-span-2 flex flex-col justify-center bg-transparent backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-yellow-500/10 rounded-lg">
                  <HiTrendingUp className="md:w-6 md:h-6 text-yellow-200" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-200">
                    CURSOS DESTACADOS
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tus cursos con mejor rendimiento este mes
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {teacherFeaturedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="text-sm md:text-lg font-semibold text-slate-200 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-400">
                          Ingresos generados
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs md:text-2xl font-bold text-green-600">
                          ${course.revenue.toFixed(0)}
                        </p>
                        <p className="text-sm text-green-400 flex items-center gap-1 justify-end">
                          <HiTrendingUp className="w-4 h-4" />
                          {course.trend}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-transparent backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/10 rounded-lg">
                  <HiChartBar className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-200">
                    ACTIVIDAD
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Últimas novedades
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {teacherRecentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
                  >
                    <p className="text-sm text-slate-200 mb-1 font-medium">
                      {activity.text}
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

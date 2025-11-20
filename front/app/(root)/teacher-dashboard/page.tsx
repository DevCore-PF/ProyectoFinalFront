"use client";
import TeacherWelcomeCard from "@/components/dashboard/TeacherWelcomeCard";
import TeacherCourseCard from "@/components/dashboard/TeacherCourseCard";
import ValidationMessage from "@/components/dashboard/ValidationMessage";
import ProfessionalValidationForm from "@/components/dashboard/ProfessionalValidationForm";
import { PurchasedCoursesGrid } from "@/components/PurchasedCoursesGrid";
import { CourseVisibility } from "@/types/course.types";
import { HiBookOpen, HiShoppingCart } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useTeacherValidation } from "@/hooks/useTeacherValidation";
import { useProfessorCourses } from "@/hooks/useProfessorCourses";
import { toastSuccess, toastError } from "@/helpers/alerts.helper";
import Loader from "@/components/Loaders/Loader";
import TinyLoader from "@/components/Loaders/TinyLoader";
import TopCoursesWidget from "@/components/dashboard/TopCoursesWidget";

const TeacherDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const {
    validationStatus,
    isLoading: validationLoading,
    canCreateCourses,
    needsValidation,
    isPending,
    isRejected,
    submitValidation,
    isSubmitting,
  } = useTeacherValidation();

  const {
    courses: professorCourses,
    isLoading: coursesLoading,
    error: coursesError,
    refreshCourses,
    updateCourseVisibility,
    hasCourses,
  } = useProfessorCourses();

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"created" | "purchased">(
    "created"
  );

  const handleViewCourseDetails = (courseId: string) => {
    console.log(`Ver detalles del curso: ${courseId}`);
    // desde aca se puede agregar navegación al detalle del curso
    // router.push(`/teacher-dashboard/courses/${courseId}`);
  };

  const handleVisibilityChange = (
    courseId: string,
    newVisibility: CourseVisibility
  ) => {
    console.log(
      `🔄 Visibilidad del curso ${courseId} cambiada a: ${newVisibility}`
    );
    // Actualizar inmediatamente el estado local para animación suave
    updateCourseVisibility(courseId, newVisibility);
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

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
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

        {/* Mostrar botón solo si necesita validación o fue rechazado, PERO no si está pending */}
        {(needsValidation || isRejected) && !isPending && !showForm && (
          <div className="mb-6 text-center">
            <button
              onClick={handleShowValidationForm}
              className="px-6 py-3 bg-button/80 cursor-pointer hover:bg-button text-font-light font-medium rounded-lg transition-all duration-200"
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

          {/* Tabs - Siempre mostrar, pero condicionar el contenido */}
          <div className="flex border-b border-slate-700/50 mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-3 sm:px-4 py-3 cursor-pointer text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'created'
                  ? 'text-blue-400 border-blue-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiBookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Cursos Creados</span>
                <span className="sm:hidden">Creados</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('purchased')}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'purchased'
                  ? 'text-green-400 border-green-400'
                  : 'text-slate-400 border-transparent hover:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cursos Comprados</span>
                <span className="sm:hidden">Comprados</span>
              </div>
            </button>
          </div>

          {/* Contenido de tabs */}
          {activeTab === 'created' ? (
            <>
              {canCreateCourses ? (
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
                        className="px-6 py-3 bg-button/90 hover:button cursor-pointer text-font-light font-medium rounded-lg transition-all duration-200"
                      >
                        Crear mi primer curso
                      </button>
                    </div>
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
            </>
          ) : (
            <PurchasedCoursesGrid />
          )}
        </div>

        {/* Estadísticas - solo si puede crear cursos */}
        {canCreateCourses && (
          <div id="top-courses-section" className="my-10 scroll-mt-20">
            <TopCoursesWidget />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

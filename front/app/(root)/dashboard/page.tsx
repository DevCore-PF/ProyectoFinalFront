"use client";

import StudentWelcomeCardReal from "@/components/dashboard/StudentWelcomeCardReal";
import StudentApplicationsCard from "@/components/dashboard/StudentApplicationsCard";
import StudentQuickAccess from "@/components/dashboard/StudentQuickAccess";
import { PurchasedCoursesGrid } from "@/components/PurchasedCoursesGrid";
import { useAuth } from "@/context/UserContext";
import { usePurchasedCourses } from "@/hooks/usePurchasedCourses";
import { useStudentMetrics } from "@/hooks/useStudentMetrics";
import Loader from "@/components/Loaders/Loader";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const { loading: coursesLoading, error: coursesError } =
    usePurchasedCourses();
  const {
    totalCourses,
    completedCourses,
    weeklyProgress,
    weeklyGoal,
    totalLessons,
    completedLessons,
    loading: metricsLoading,
    error: metricsError,
  } = useStudentMetrics();

  if (isLoading || coursesLoading || metricsLoading) return <Loader />;

  if (coursesError || metricsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-400 text-lg mb-4">
            Error al cargar el dashboard: {coursesError || metricsError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#7e4bde] hover:bg-[#6d3dc4] px-4 py-2 rounded-lg text-font-light font-semibold transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Card con métricas reales */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="relative z-10">
            <StudentWelcomeCardReal
              userName={user?.name}
              userEmail={user?.email}
              profileImage={user?.profileImage}
              weeklyProgress={weeklyProgress}
              weeklyGoal={weeklyGoal}
              totalCourses={totalCourses}
              completedCourses={completedCourses}
              totalLessons={totalLessons}
              completedLessons={completedLessons}
            />
          </div>
        </div>

        {/* Acceso rápido con datos reales */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <StudentQuickAccess
            totalCourses={totalCourses}
            completedCourses={completedCourses}
          />
        </div>

        {/* Grid de cursos comprados */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <PurchasedCoursesGrid />
        </div>

        {/* Mis postulaciones para profesor */}
        <div>
          <StudentApplicationsCard title="Mis postulaciones" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

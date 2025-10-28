"use client";
import TeacherWelcomeCard from "@/components/dashboard/TeacherWelcomeCard";
import CourseCard from "@/components/dashboard/CourseCard";
import {
  teacherCourses,
  teacherData,
  teacherFeaturedCourses,
  teacherRecentActivity,
} from "@/helpers/moks";
import { HiBookOpen, HiTrendingUp, HiChartBar } from "react-icons/hi";
import { useEffect } from "react";
import { useAuth } from "@/context/UserContext";
import { useRouter } from "next/navigation";

const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/");
    }
  }, [user, router]);

  const handleViewCourseDetails = (courseId: number) => {
    console.log(`Ver detalles del curso: ${courseId}`);
  };

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 relative z-10">
          <TeacherWelcomeCard
            userName={teacherData.userName}
            userEmail={teacherData.userEmail}
          />
        </div>
        <div className="bg-background2/40 border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2.5 bg-purple-500/10 rounded-lg">
              <HiBookOpen className="w-6 h-6 text-accent-light" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-200">
                MIS CURSOS
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Gestiona y monitorea todos tus cursos creados
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teacherCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onViewDetails={handleViewCourseDetails}
              />
            ))}
          </div>

          {teacherCourses.length === 0 && (
            <div className="text-center py-16 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
              <HiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold text-slate-300 mb-2">
                No tienes cursos creados aún
              </p>
              <p className="text-sm">¡Comienza creando tu primer curso!</p>
            </div>
          )}
        </div>

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
                <h2 className="text-xl font-bold text-slate-200">ACTIVIDAD</h2>
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
      </div>
    </div>
  );
};

export default TeacherDashboardPage;

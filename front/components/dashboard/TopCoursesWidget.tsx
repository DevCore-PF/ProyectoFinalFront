"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/UserContext';
import { professorStatsService, TopCourseStats } from '@/services/professor-stats.service';
import { HiTrendingUp, HiTrendingDown, HiCurrencyDollar, HiShoppingCart } from 'react-icons/hi';
import TinyLoader from '@/components/Loaders/TinyLoader';

const TopCoursesWidget = () => {
  const { token } = useAuth();
  const [topCourses, setTopCourses] = useState<TopCourseStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopCourses = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const courses = await professorStatsService.getTopCourses(token);
        setTopCourses(courses);
      } catch (error) {
        console.error('Error loading top courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCourses();
  }, [token]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="flex items-center justify-center h-64">
          <TinyLoader />
        </div>
      </div>
    );
  }

  if (topCourses.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
            <HiTrendingUp className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Mis Cursos Top</h2>
            <p className="text-slate-400 text-sm">Tus cursos con mejor rendimiento</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-slate-400">Aún no tienes ventas registradas</p>
          <p className="text-slate-500 text-sm mt-2">Tus estadísticas aparecerán aquí cuando tengas ventas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl shadow-lg shadow-amber-500/10">
          <HiTrendingUp className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Mis Cursos Top
          </h2>
          <p className="text-slate-400 text-sm">Tus cursos con mejor rendimiento este mes</p>
        </div>
      </div>

      {/* Cursos List */}
      <div className="space-y-4">
        {topCourses.map((course, index) => (
          <div
            key={course.courseId}
            className="group relative bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/30 hover:border-slate-600/50 rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            {/* Position Badge */}
            <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg">
              #{index + 1}
            </div>

            <div className="flex items-center justify-between gap-4 ml-4">
              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-primary transition-colors">
                  {course.courseTitle}
                </h3>
                
                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <HiShoppingCart className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 font-medium">{course.salesCount}</span>
                    <span className="text-slate-500">ventas</span>
                  </div>
                </div>
              </div>

              {/* Earnings & Growth */}
              <div className="text-right">
                <div className="flex items-baseline gap-2 mb-1">
                  <HiCurrencyDollar className="w-5 h-5 text-emerald-400" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                    {formatCurrency(course.totalEarnings)}
                  </span>
                </div>
                
                {/* Growth Indicator */}
                {course.growthPercentage !== 0 && (
                  <div className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                    course.growthPercentage > 0 
                      ? 'text-emerald-400' 
                      : 'text-red-400'
                  }`}>
                    {course.growthPercentage > 0 ? (
                      <HiTrendingUp className="w-4 h-4" />
                    ) : (
                      <HiTrendingDown className="w-4 h-4" />
                    )}
                    <span>{course.growthPercentage > 0 ? '+' : ''}{course.growthPercentage}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <p className="text-xs text-slate-500 text-center">
          Rendimiento basado en ingresos generados • Crecimiento calculado vs. últimos 30 días
        </p>
      </div>
    </div>
  );
};

export default TopCoursesWidget;

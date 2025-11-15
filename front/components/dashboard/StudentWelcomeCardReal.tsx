"use client";

import { useState, useEffect } from "react";
import {
  HiChevronDown,
  HiCog,
  HiTrendingUp,
  HiClock,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import ProfileImage from "@/components/ui/ProfileImage";
import { studentManagementOptions as baseStudentManagementOptions } from "@/helpers/moks";
import useStudentTeacherRequest from "@/hooks/useStudentTeacherRequest";
import TeacherRequestModal from "@/components/TeacherRequestModal";

interface StudentWelcomeCardRealProps {
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  weeklyProgress?: number;
  weeklyGoal?: number;
  totalCourses?: number;
  completedCourses?: number;
  totalLessons?: number;
  completedLessons?: number;
}

const StudentWelcomeCardReal = ({
  userName = "",
  userEmail = "",
  profileImage,
  weeklyProgress = 0,
  weeklyGoal = 75,
  totalCourses = 0,
  completedCourses = 0,
  totalLessons = 0,
  completedLessons = 0,
}: StudentWelcomeCardRealProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const { applicationStatus } = useStudentTeacherRequest();

  // Clonar y modificar las opciones para el menú
  const studentManagementOptions = baseStudentManagementOptions.map(option => {
    if (option.id === "become-professor") {
      return {
        ...option,
        disabled: applicationStatus.status === 'rejected',
      };
    }
    return option;
  });
  
  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    setAnimatedProgress(0);
    const timer = setTimeout(() => {
      setAnimatedProgress(weeklyProgress);
    }, 200);

    return () => clearTimeout(timer);
  }, [weeklyProgress]);

  const handleProfileSettings = () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      router.push(`/profile/${user.id}/settings`);
    } else {
      router.push("/login");
    }
  };

  // Usar las lecciones reales pasadas como props
  const totalLessonsFromCourses = totalLessons;
  const completedLessonsFromProgress = completedLessons;

  return (
    <div className="bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl min-h-50 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Sección izquierda - Perfil y progreso */}
        <div className="flex-1 w-full">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">
            {currentDate}
          </p>
          
          <div className="flex items-center gap-4 mb-4">
            <ProfileImage
              user={{ profileImage, name: userName }}
              size={48}
              showEditButton={true}
              onEditClick={handleProfileSettings}
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-200">
                ¡Bienvenid@ {userName}!
              </h1>
              <p className="text-slate-300 text-sm md:text-base">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Meta semanal con datos reales */}
          <div className="rounded-xl p-5 md:p-6 mb-3 bg-slate-900/50 border mr-10 border-slate-700/30">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <HiTrendingUp className="w-5 h-5 text-yellow-light" />
                </div>
                <span className="text-base font-semibold text-slate-200">
                  Meta semanal
                </span>
              </div>
              <span className="text-lg font-bold text-slate-400 tabular-nums">
                {Math.round(animatedProgress)}%
              </span>
            </div>

            <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-1000 ease-out bg-linear-to-r from-button/40 to-button shadow-lg shadow-purple-500/50"
                style={{ width: `${animatedProgress}%` }}
              >
                <div className="h-full w-full relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <HiClock className="w-4 h-4" />
              <span>
                <span className="text-slate-200 font-semibold tabular-nums">
                  {completedLessonsFromProgress}
                </span>{" "}
                de{" "}
                <span className="text-slate-200 font-semibold tabular-nums">
                  {totalLessonsFromCourses}
                </span>
                {" lecciones completadas"}
              </span>
            </div>
          </div>

          {/* Ajustes de perfil fuera del menú */}
          <button
            onClick={handleProfileSettings}
            className="flex items-center gap-2 text-slate-400 hover:underline cursor-pointer transition-colors duration-200 group"
          >
            <HiCog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Ajustes de perfil</span>
          </button>
        </div>

        <div className="relative w-full md:w-auto">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full md:w-auto flex items-center justify-between gap-3 px-6 py-3 border-border border cursor-pointer rounded-xl transition-all duration-200 text-slate-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-button/30 rounded-lg group-hover:bg-button/50 transition-colors">
                <HiCog className="w-4 h-4 text-accent-medium" />
              </div>
              <span className="text-sm font-semibold">Panel de gestión</span>
            </div>
            <HiChevronDown
              className={`w-5 h-5 transition-transform duration-300 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMenuOpen && (
            <div className="absolute md:-right-5 mt-3 w-full md:w-72 bg-slate-900/98 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {/* Solo mostrar opciones del menú, excluyendo "Ajustes de perfil" */}
                {studentManagementOptions
                  .filter(option => option.title !== "Ajustes de perfil")
                  .map((option, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (option.disabled) return;
                        if (option.id === "become-professor") {
                          setIsTeacherModalOpen(true);
                        } else {
                          option.onClick();
                        }
                        setIsMenuOpen(false);
                      }}
                      disabled={option.disabled}
                      className={`w-full px-4 py-3.5 flex items-center gap-4 group text-left rounded-lg transition-all duration-200
                        ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800/70'}`}
                      title={option.disabled && option.id === 'become-professor' ? 'No puedes postularte porque tu última solicitud fue rechazada.' : ''}
                    >
                      <div className="p-2 bg-purple-500/10 rounded-lg text-accent-light group-hover:bg-purple-500/20 transition-all">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {option.title}
                        </h4>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Modal para solicitud de profesor */}
      <TeacherRequestModal 
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
      />
    </div>
  );
};

export default StudentWelcomeCardReal;
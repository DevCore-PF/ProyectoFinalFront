"use client";
import { HiChevronDown, HiCog } from "react-icons/hi";
import { teacherManagementOptions } from "@/helpers/moks";
import { useState } from "react";
import { useRouter } from "next/navigation";
const TeacherWelcomeCard = ({ userName = "", userEmail = "" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleProfileSettings = () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      router.push(`/profile/${user.id}/settings`);
    } else {
      router.push("/login");
    }
  };
  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl min-h-50 flex flex-col justify-center">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
            {currentDate}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-font-light">
            ¡Bienvenid@ {userName}!
          </h1>
          <p className="text-slate-300 text-sm md:text-base">{userEmail}</p>
          <button
            onClick={handleProfileSettings}
            className="flex items-center gap-2 mt-3 text-slate-400 hover:underline cursor-pointer transition-colors duration-200 group"
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
                {teacherManagementOptions.map((option, index) => (
                  <div key={option.id}>
                    <button
                      onClick={() => {
                        console.log(option.title);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3.5 cursor-pointer hover:bg-slate-800/70 rounded-lg transition-all duration-200 text-left flex items-center gap-4 group"
                    >
                      <div className="p-2 bg-purple-500/10 rounded-lg text-accent-light group-hover:bg-purple-500/20  transition-all">
                        {option.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-200  transition-colors">
                        {option.title}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherWelcomeCard;

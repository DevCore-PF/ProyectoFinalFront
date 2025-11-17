"use client";

import { FaGraduationCap, FaInfinity } from "react-icons/fa";

interface PricingHeaderProps {
  activeTab: "memberships" | "courses";
  setActiveTab: (tab: "memberships" | "courses") => void;
}

const PricingHeader = ({ activeTab, setActiveTab }: PricingHeaderProps) => {
  return (
    <div className="text-center mb-8 sm:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-font-light mb-3 sm:mb-4 px-2">
        Elige tu camino de aprendizaje
      </h2>
      <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
        Selecciona una membresía para acceso ilimitado o compra cursos
        individuales según tus necesidades
      </p>

      <div className="inline-flex items-center gap-1 sm:gap-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-full p-1">
        <button
          onClick={() => setActiveTab("memberships")}
          className={`px-3 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
            activeTab === "memberships"
              ? "bg-button/80 text-font-light"
              : "text-slate-300 hover:text-font-light hover:cursor-pointer"
          }`}
        >
          <FaInfinity className="text-xs sm:text-sm" />
          <span className="hidden xs:inline">Membresías</span>
          <span className="xs:hidden">Planes</span>
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-3 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 ${
            activeTab === "courses"
              ? "bg-button/80 text-font-light"
              : "text-slate-300 hover:text-font-light hover:cursor-pointer"
          }`}
        >
          <FaGraduationCap className="text-xs sm:text-sm" />
          Cursos Individuales
        </button>
      </div>
    </div>
  );
};

export default PricingHeader;
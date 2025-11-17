"use client";

import {
  HiBookOpen,
  HiShoppingCart,
  HiCurrencyDollar,
  HiAcademicCap,
  HiArrowRight,
} from "react-icons/hi";
import { useRouter } from "next/navigation";

interface StudentQuickAccessProps {
  totalCourses: number;
  completedCourses: number;
}

const StudentQuickAccess = ({
  totalCourses,
  completedCourses,
}: StudentQuickAccessProps) => {
  const router = useRouter();

  const quickAccessItems = [
    {
      id: "explore-courses",
      title: "EXPLORAR",
      description:
        "Descubre nuevos cursos para ampliar tus conocimientos y habilidades.",
      icon: <HiAcademicCap className="w-6 h-6 text-accent-light" />,
      onClick: () => router.push("/courses"),
    },
  ];

  return (
    <div className="bg-background2/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-slate-200">
          Acceso rápido
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Tus cursos activos y nuevas oportunidades de aprendizaje
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {quickAccessItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="group flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border cursor-pointer border-slate-700/30 hover:border-button/80 hover:bg-slate-900/70 transition-all duration-300 text-left hover:scale-[1.02]"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold mb-1 text-font-light uppercase tracking-wider">
                {item.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
            <HiArrowRight className="w-5 h-5 text-slate-500 group-hover:text-button group-hover:translate-x-1 transition-all duration-300 mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentQuickAccess;

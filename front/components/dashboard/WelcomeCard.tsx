"use client";

import { HiCog, HiTrendingUp, HiClock } from "react-icons/hi";

const WelcomeCard = ({
  userName = "",
  userEmail = "",
  weeklyGoalProgress = 0,
  goalHours = 0,
  currentHours = 0,
  showWeeklyGoal = true,
}) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-transparent h-full flex flex-col justify-center backdrop-blur-sm border border-slate-700 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-6">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">
          {currentDate}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold mb-2  text-slate-200">
          ¡Bienvenid@ {userName}!
        </h1>
        <p className="text-slate-300 text-sm md:text-base">{userEmail}</p>
      </div>

      {showWeeklyGoal && (
        <div className="rounded-xl p-5 md:p-6 mb-4 bg-slate-900/50 border border-slate-700/30">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <HiTrendingUp className="w-5 h-5 text-yellow-light" />
              </div>
              <span className="text-base font-semibold text-slate-200">
                Meta semanal
              </span>
            </div>
            <span className="text-lg font-bold text-slate-400">
              {weeklyGoalProgress}%
            </span>
          </div>

          <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="h-2.5 rounded-full transition-all duration-700 ease-out bg-linear-to-r from-button/40  to-button shadow-lg shadow-purple-500/50"
              style={{ width: `${weeklyGoalProgress}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <HiClock className="w-4 h-4" />
            <span>
              <span className="text-slate-200 font-semibold">
                {currentHours}h
              </span>{" "}
              de{" "}
              <span className="text-slate-200 font-semibold">{goalHours}h</span>
            </span>
          </div>
        </div>
      )}

      <button
        onClick={() => console.log("Navegando a ajustes de perfil")}
        className="flex items-center gap-2 text-slate-400 hover:underline cursor-pointer transition-colors duration-200 group"
      >
        <HiCog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-sm font-medium">Ajustes de perfil</span>
      </button>
    </div>
  );
};

export default WelcomeCard;

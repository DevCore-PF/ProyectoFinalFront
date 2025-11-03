"use client";

import { useState, useEffect } from "react";
import { HiCog, HiTrendingUp, HiClock, HiUser } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileImage from "@/components/ui/ProfileImage";

const WelcomeCard = ({
  userName = "",
  userEmail = "",
  profileImage,
  weeklyGoalProgress = 0,
  goalHours = 0,
  currentHours = 0,
}: {
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  weeklyGoalProgress?: number;
  goalHours?: number;
  currentHours?: number;
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const router = useRouter();

  const currentDate = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimatedProgress(0), 0);
    const timer2 = setTimeout(() => {
      setAnimatedProgress(weeklyGoalProgress);
    }, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [weeklyGoalProgress]);

  const handleProfileSettings = () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      router.push(`/profile/${user.id}/settings`);
    } else {
      router.push("/login");
    }
  };
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setAnimatedProgress(weeklyGoalProgress);
    }, 200);

    return () => clearTimeout(startDelay);
  }, [weeklyGoalProgress]);

  useEffect(() => {
    setAnimatedProgress(0);
  }, [weeklyGoalProgress]);

  return (
    <div className="h-full flex flex-col justify-center bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl">
      <div className="mb-6">
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-3">
          {currentDate}
        </p>
        <div className="flex items-center gap-4 mb-2">
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
            <p className="text-slate-300 text-sm md:text-base">{userEmail}</p>
          </div>
        </div>
      </div>

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
          <span className="text-lg font-bold text-slate-400 tabular-nums">
            {animatedProgress}%
          </span>
        </div>

        <div className="w-full bg-slate-700/50 rounded-full h-2.5 mb-4 overflow-hidden">
          <div
            className="h-2.5 rounded-full transition-all duration-1000 ease-out bg-linear-to-r from-button/40 to-button shadow-lg shadow-purple-500/50"
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="h-full w-full relative overflow-hidden">
              <div
                className="absolute inset-0 bg-linear-to-rfrom-transparent via-white/30 to-transparent animate-shimmer"
                style={{
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-400">
          <HiClock className="w-4 h-4" />
          <span>
            <span className="text-slate-200 font-semibold tabular-nums">
              {currentHours}h
            </span>{" "}
            de{" "}
            <span className="text-slate-200 font-semibold tabular-nums">
              {goalHours}h
            </span>
          </span>
        </div>
      </div>

      <button
        onClick={handleProfileSettings}
        className="flex items-center gap-2 text-slate-400 hover:underline cursor-pointer transition-colors duration-200 group"
      >
        <HiCog className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        <span className="text-sm font-medium">Ajustes de perfil</span>
      </button>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeCard;

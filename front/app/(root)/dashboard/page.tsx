"use client";

import React from "react";
import Image from "next/image";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import Calendar from "@/components/dashboard/Calendar";

const DashboardPage = () => {
  // Datos temporales (más adelante vendrán del backend)
  const userData = {
    userName: "Sofia",
    userEmail: "sofiarodriguez@gmail.com",
    weeklyGoalProgress: 68,
    goalHours: 4,
    currentHours: 2.7
  };

  const progressData = [
    { id: "1", name: "Diseño UX", progress: 28, color: "#7e4bde" }, 
    { id: "2", name: "JavaScript", progress: 70, color: "#9c75e6" }, 
    { id: "3", name: "CSS", progress: 60, color: "#bba0ee" } 
  ];

  const quickAccessItems = [
    {
      id: "courses",
      title: "CURSOS",
      description: "Accede a todos los cursos en los que estás inscripto.",
      icon: <Image 
        src="/icons/cursosIcon.svg" 
        alt="Cursos" 
        width={24} 
        height={32} 
        style={{
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          filter: 'brightness(0) saturate(100%) invert(96%) sepia(16%) saturate(290%) hue-rotate(22deg) brightness(103%) contrast(96%)'
        }} 
      />,
      onClick: () => console.log("Navegando a cursos")
    },
    {
      id: "tasks",
      title: "TAREAS",
      description: "Completa las tareas asignadas y revisa el feedback de tus instructores.",
      icon: <Image 
        src="/icons/TareasIcon.svg" 
        alt="Tareas" 
        width={24} 
        height={32} 
        style={{
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          filter: 'brightness(0) saturate(100%) invert(96%) sepia(16%) saturate(290%) hue-rotate(22deg) brightness(103%) contrast(96%)'
        }} 
      />,
      onClick: () => console.log("Navegando a tareas")
    }
  ];

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="lg:col-span-2">
            <WelcomeCard
              userName={userData.userName}
              userEmail={userData.userEmail}
              weeklyGoalProgress={userData.weeklyGoalProgress}
              goalHours={userData.goalHours}
              currentHours={userData.currentHours}
            />
          </div>
          
          
          <div>
            <Calendar />
          </div>
        </div>

        
        <div className="mb-8">
          <QuickAccessCard items={quickAccessItems} />
        </div>

        
        <div>
          <ProgressCard
            title="Mi progreso"
            progressItems={progressData}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

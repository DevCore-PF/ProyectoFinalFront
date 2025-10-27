"use client";

import Calendar from "@/components/dashboard/Calendar";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import RecommendedCourses from "@/components/RecomendedCourses";
import { HiBookOpen, HiCheckCircle } from "react-icons/hi";
const DashboardPage = () => {
  const userData = {
    userName: "Sofia",
    userEmail: "sofiarodriguez@gmail.com",
    weeklyGoalProgress: 68,
    goalHours: 4,
    currentHours: 2.7,
  };

  const progressData = [
    { id: "1", name: "Diseño UX", progress: 28 },
    { id: "2", name: "JavaScript", progress: 70 },
    { id: "3", name: "CSS", progress: 60 },
  ];

  const quickAccessItems = [
    {
      id: "courses",
      title: "CURSOS",
      description: "Accede a todos los cursos en los que estás inscripto.",
      icon: <HiBookOpen className="w-6 h-6 text-accent-light" />,
      onClick: () => console.log("Navegando a cursos"),
    },
    {
      id: "tasks",
      title: "TAREAS",
      description: "Completa las tareas asignadas a cada lección.",
      icon: <HiCheckCircle className="w-6 h-6 text-accent-light" />,
      onClick: () => console.log("Navegando a tareas"),
    },
  ];

  const recommendedCourses = [
    {
      id: "1",
      name: "React Avanzado",
      description: "Domina hooks, context y patrones avanzados",
      duration: "12 horas",
      rating: "4.8",
    },
    {
      id: "2",
      name: "TypeScript desde cero",
      description: "Aprende tipado estático para JavaScript",
      duration: "8 horas",
      rating: "4.9",
    },
    {
      id: "3",
      name: "Node.js y Express",
      description: "Crea APIs robustas con Node",
      duration: "15 horas",
      rating: "4.7",
    },
  ];

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-10">
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

        <div className="mb-4 md:mb-10">
          <QuickAccessCard items={quickAccessItems} />
        </div>

        <div className="mb-4 md:mb-10">
          <ProgressCard title="Mi progreso" progressItems={progressData} />
        </div>

        <div>
          <RecommendedCourses courses={recommendedCourses} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

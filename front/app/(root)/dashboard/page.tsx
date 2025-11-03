"use client";

import Calendar from "@/components/dashboard/Calendar";
import ProgressCard from "@/components/dashboard/ProgressCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import WelcomeCard from "@/components/dashboard/StudentWelcomeCard";
import RecommendedCourses from "@/components/dashboard/RecomendedCourses";
import {
  progressData,
  quickAccessItems,
  recommendedCourses,
  studentData,
} from "@/helpers/moks";
import { useAuth } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== "student") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);
  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-10">
          <div className="lg:col-span-2">
            <WelcomeCard
              userName={user?.name}
              userEmail={user?.email}
              profileImage={user?.profileImage}
              weeklyGoalProgress={studentData.weeklyGoalProgress}
              goalHours={studentData.goalHours}
              currentHours={studentData.currentHours}
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

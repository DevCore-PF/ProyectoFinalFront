"use client";

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
import { useEffect, useEffectEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllCoursesService } from "@/services/course.services";
import Loader from "@/components/Loaders/Loader";

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

  
if (isLoading ) return <Loader />;

if (!user || user.role !== "student") return <Loader />;
  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-10">
          <div className=" relative z-10">
            <WelcomeCard
              userName={user?.name}
              userEmail={user?.email}
              profileImage={user?.profileImage}
              weeklyGoalProgress={studentData.weeklyGoalProgress}
              goalHours={studentData.goalHours}
              currentHours={studentData.currentHours}
            />
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

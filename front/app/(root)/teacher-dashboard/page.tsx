"use client";

import React from "react";
import Image from "next/image";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import CourseCard from "@/components/dashboard/CourseCard";
import TeacherManagementPanel from "@/components/dashboard/TeacherManagementPanel";

const TeacherDashboardPage = () => {
  // Datos temporales del profesor (vienen del backend cuando esten preparados)
  const teacherData = {
    userName: "Carol",
    userEmail: "carolaperez@gmail.com",
    weeklyGoalProgress: 85, 
    goalHours: 8, 
    currentHours: 6.8
  };

  // Datos mockeados de cursos del profesor
  const teacherCourses = [
    {
      id: "1",
      title: "Desarrollo Front-end",
      students: 32,
      rating: 4.1,
      price: 52.00,
      status: "Publicado" as const,
      createdDate: "05/07/2025",
      lastUpdate: "10/08/2025",
      totalDuration: "16h",
      visibility: "Público" as const
    },
    {
      id: "2", 
      title: "HTML",
      students: 0,
      rating: 0.0,
      price: 16.00,
      status: "Borrador" as const,
      createdDate: "05/07/2025",
      lastUpdate: "10/08/2025",
      totalDuration: "2h",
      visibility: "Privado" as const
    }
  ];

  const handleViewCourseDetails = (courseId: string) => {
    console.log(`Ver detalles del curso: ${courseId}`);
    // aca iria navegacion al detalle del curso
  };

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto p-6">
        
        <div className="mb-8">
          <WelcomeCard
            userName={teacherData.userName}
            userEmail={teacherData.userEmail}
            showWeeklyGoal={false}
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="rounded-xl p-6 text-white font-body" style={{ backgroundColor: '#3F4273' }}>
              <div className="flex items-center space-x-3 mb-6">
                <Image 
                  src="/icons/cursosIcon.svg" 
                  alt="Mis Cursos" 
                  width={24} 
                  height={32}
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(96%) sepia(16%) saturate(290%) hue-rotate(22deg) brightness(103%) contrast(96%)'
                  }}
                />
                <h2 className="text-xl font-medium">MIS CURSOS</h2>
              </div>
              <p className="text-sm text-gray-300 font-light mb-6">
                Breve descripción de sección mis cursos
              </p>
              
              <div className="space-y-4">
                {teacherCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewDetails={handleViewCourseDetails}
                  />
                ))}
              </div>
              
              {teacherCourses.length === 0 && (
                <div className="text-center py-12 text-gray-300">
                  <p className="text-lg font-normal mb-2">No tienes cursos creados aún</p>
                  <p className="text-sm font-light">¡Comienza creando tu primer curso!</p>
                </div>
              )}
            </div>
          </div>

          
          <div>
            <TeacherManagementPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardPage;
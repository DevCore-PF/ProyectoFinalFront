"use client";
import React, { useState, useEffect } from "react";
import { Course } from "@/types/course.types";
import { getTeacherCoursesService } from "@/services/course.service";
import { useAuth } from "@/context/UserContext";
import { HiBookOpen } from "react-icons/hi";
import RealCourseCard from "./RealCourseCard";

const TeacherCoursesGrid: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const professorProfile = user?.professorProfile;
    const fetchTeacherCourses = async () => {
      if (!professorProfile || !professorProfile.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const coursesData = await getTeacherCoursesService(professorProfile.id);
        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching teacher courses:", err);
        setError("Error al cargar tus cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [user, courses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e4bde]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
        <p className="text-lg">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#7e4bde] hover:bg-[#6d3dc4] px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 bg-slate-900/30 rounded-xl border border-slate-700/20">
        <HiBookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-semibold text-slate-300 mb-2">
          No tienes cursos creados aún
        </p>
        <p className="text-sm">¡Comienza creando tu primer curso!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <RealCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default TeacherCoursesGrid;

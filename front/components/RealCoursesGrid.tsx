'use client';
import React, { useState, useEffect } from 'react';
import { Course } from '@/types/course.types';
import { getAllCoursesService } from '@/services/course.services';
import RealCourseCard from './RealCourseCard';

const RealCoursesGrid: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await getAllCoursesService();
        setCourses(coursesData);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Error al cargar los cursos');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7e4bde]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-lg">{error}</p>
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
      <div className="text-center py-20">
        <p className="text-slate-300 text-lg">No hay cursos disponibles en este momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {courses.map((course) => {
        try {
          return <RealCourseCard key={course.id} course={course} />;
        } catch (error) {
          console.error('Error rendering course card:', error, 'Course:', course);
          return (
            <div key={course.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400">Error al renderizar el curso: {course.title}</p>
              <pre className="text-xs text-red-300 mt-2">{JSON.stringify(course, null, 2)}</pre>
            </div>
          );
        }
      })}
    </div>
  );
};

export default RealCoursesGrid;
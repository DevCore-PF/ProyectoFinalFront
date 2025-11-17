import { getAllCoursesService } from "@/services/course.services";
import { Course } from "@/types/course.types";
import { useEffect, useState } from "react";
import { HiBookOpen } from "react-icons/hi";
const CoursesStatistics = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const data = await getAllCoursesService();
        setCourses(data);
      } catch (error) {
        console.log(error);
        throw error;
      }
    };
    fetchAllCourses();
  }, []);
  return (
    <div className="bg-background2/40 border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-purple-500/10 rounded-lg">
          <HiBookOpen className="w-6 h-6 text-purple-400" />
        </div>
      </div>
      <h3 className="text-slate-400 text-sm mb-1">Total Cursos</h3>
      <p className="text-xl font-bold text-font-light">{`${courses.length}`}</p>
      {/* //getAllUsersLength */}
    </div>
  );
};

export default CoursesStatistics;

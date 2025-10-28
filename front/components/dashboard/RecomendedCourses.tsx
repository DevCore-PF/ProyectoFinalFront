import { HiBookOpen, HiClock, HiStar, HiArrowRight } from "react-icons/hi";
const RecommendedCourses = ({ courses }) => {
  return (
    <div className="bg-background2/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold  text-slate-200">
          Cursos recomendados
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Descubre cursos seleccionados según tus intereses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group bg-slate-900/50 backdrop-blur-xs border border-slate-700/30 rounded-xl overflow-hidden hover:border-slate-300/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/20 flex flex-col"
          >
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold mb-2 text-slate-200  transition-colors text-lg">
                {course.name}
              </h3>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed flex-1">
                {course.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/30">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <HiClock className="w-3.5 h-3.5" />
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <HiStar className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="font-bold text-slate-300">
                    {course.rating}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full bg-button/30 hover:bg-button/40 text-purple-100 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-center gap-2 group/btn cursor-pointer">
                <span>Ver curso</span>
                <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCourses;

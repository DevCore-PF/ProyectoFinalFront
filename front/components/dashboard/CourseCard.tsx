import { HiEye, HiEyeOff, HiStar, HiUsers } from "react-icons/hi";

const CourseCard = ({ course, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Publicado":
        return " text-green-600 border-green-500/30";
      case "Borrador":
        return "text-slate-500 border-slate-300/30";
      case "En revisión":
        return "text-yellow-600  border-yellow-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="group bg-slate-900/50 backdrop-blur-xs border border-slate-700/30 rounded-xl p-5 ">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-200 mb-2 ">
            {course.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <HiUsers className="w-4 h-4" />
              <span className="font-medium">{course.students} alumnos </span>
            </div>
            |
            <div className="flex items-center gap-1.5">
              <HiStar className="w-4 h-4 text-yellow-300" />
              <span className="font-medium">{course.rating.toFixed(1)}</span>
            </div>
            |
            <div className="flex gap-1">
              <span className="font-bold text-slate-400 ">
                ${course.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`px-3 py-1.5 rounded-lg text-xs flex justify-center  border ${getStatusColor(
            course.status
          )}`}
        >
          {course.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm pb-4 border-b border-slate-700/30">
        <div>
          <span className="text-slate-500 text-xs font-medium">Creado:</span>
          <p className="text-slate-300 font-semibold">{course.createdDate}</p>
        </div>
        <div>
          <span className="text-slate-500 text-xs font-medium">
            Actualizado:
          </span>
          <p className="text-slate-300 font-semibold">{course.lastUpdate}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          <span className="text-slate-500 font-medium">Duración: </span>
          <span className="text-slate-300 font-bold">
            {course.totalDuration}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {course.visibility === "Público" ? (
            <>
              <HiEye className="w-4 h-4 text-green-600" />
              <span className="text-green-600 ">Público</span>
            </>
          ) : (
            <>
              <HiEyeOff className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 ">Privado</span>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => onViewDetails(course.id)}
        className="w-full bg-button/30 hover:bg-button/40 cursor-pointer text-purple-100 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40"
      >
        Ver detalles
      </button>
    </div>
  );
};

export default CourseCard;

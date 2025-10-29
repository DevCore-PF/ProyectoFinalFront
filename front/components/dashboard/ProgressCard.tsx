import { HiAcademicCap } from "react-icons/hi";
const ProgressCard = ({ title, progressItems }) => {
  return (
    <div className="bg-transparent backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 md:p-8 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300">
      <div className="mb-5">
        <h2 className="text-xl md:text-2xl font-bold  text-slate-200">
          {title}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Sigue tu avance y logros en cada curso
        </p>
      </div>
      <div className="space-y-6">
        {progressItems.map((item) => (
          <div
            key={item.id}
            className="space-y-3 p-4 rounded-xl  bg-slate-900/30 border border-slate-500/50"
          >
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-semibold text-slate-200">
                {item.name}
              </span>
              <span className="text-base md:text-lg font-bold text-slate-400">
                {item.progress}%
              </span>
            </div>

            <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-2.5 rounded-full transition-all duration-700 ease-out shadow-lg bg-linear-to-r from-button/40  to-button "
                style={{
                  width: `${item.progress}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {progressItems.length === 0 && (
        <div className="text-center text-slate-400 py-16 bg-slate-900/30 rounded-xl border border-slate-700/20">
          <HiAcademicCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-slate-300 mb-2">
            Sin progreso aún
          </p>
          <p className="text-sm">
            ¡Comienza tu primer curso para ver tu avance aquí!
          </p>
        </div>
      )}
    </div>
  );
};
export default ProgressCard;

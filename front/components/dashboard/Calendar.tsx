import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
const Calendar = ({ className = "" }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["L", "M", "M", "J", "V", "S", "D"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  return (
    <div
      className={`bg-transparent h-full backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 md:p-6 text-font-light shadow-xl hover:border-slate-600/50 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <HiChevronLeft className="w-5 h-5 text-slate-400" />
        </button>
        <h3 className="text-base md:text-lg font-bold text-slate-200">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <HiChevronRight className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs font-bold text-slate-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              text-center text-sm py-2 rounded-lg transition-all duration-200 font-medium
              ${
                day ? "hover:bg-button/90 cursor-pointer text-slate-300" : ""
              }
              ${!day ? "text-transparent" : ""}
              ${
                day && isToday(day)
                  ? "bg-button/50 text-font-light shadow-lg shadow-purple-500/30 hover:bg-button"
                  : ""
              }
            `}
          >
            {day || ""}
          </div>
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-slate-700/30 text-xs text-slate-400">
        <p className="leading-relaxed">
          Planifica tu semana y alcanza tus objetivos de aprendizaje
        </p>
      </div>
    </div>
  );
};
export default Calendar;

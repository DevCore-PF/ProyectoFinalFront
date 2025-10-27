import React, { useState } from 'react';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  const dayNames = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
  
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
  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <div className={`rounded-xl p-6 text-white font-body ${className}`} style={{ backgroundColor: '#3F4273' }}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-600/50 rounded transition-colors"
        >
          ◀
        </button>
        <h3 className="text-lg font-medium">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-600/50 rounded transition-colors"
        >
          ▶
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-300 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              text-center text-sm py-2 rounded transition-colors cursor-pointer font-normal
              ${day ? 'hover:bg-gray-600/50' : ''}
              ${isToday(day) ? 'font-medium' : ''}
              ${!day ? 'text-transparent' : ''}
            `}
            style={isToday(day) ? { backgroundColor: '#FBEDBC', color: '#242645' } : {}}
          >
            {day || ''}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-300 font-light">
        <p>Organiza tu aprendizaje. Visualiza fechas importantes y programa recordatorios.</p>
      </div>
    </div>
  );
};

export default Calendar;
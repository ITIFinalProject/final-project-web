import { useState } from 'react';

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(
        <div className="calendar-day" key={d}>
          {d}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>❮</button>
        <h2>{`${today.toLocaleString('default', { month: 'long' })} ${currentYear}`}</h2>
        <button onClick={handleNextMonth}>❯</button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => (
          <div className="calendar-day-name" key={day}>{day}</div>
        ))}
        {generateCalendar()}
      </div>
    </div>
  );
}

export default Calendar;

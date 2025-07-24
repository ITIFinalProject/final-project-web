import { useState } from 'react';

function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const events = [
    { title: 'React Workshop', date: '2025-07-21' },
    { title: 'Design Meetup', date: '2025-07-24' },
    { title: 'Hackathon', date: '2025-07-27' },
    { title: 'Conference', date: '2025-08-02' },
  ];

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

  const formatDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const generateCalendar = () => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = formatDate(currentYear, currentMonth, d);
      const isToday =
        currentYear === today.getFullYear() &&
        currentMonth === today.getMonth() &&
        d === today.getDate();
      const hasEvent = events.some((e) => e.date === fullDate);

      days.push(
        <div
          key={d}
          className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
        >
          {d}
        </div>
      );
    }
    return days;
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const pastEvents = sortedEvents.filter((e) => new Date(e.date) < today).slice(-2);
  const upcomingEvents = sortedEvents.filter((e) => new Date(e.date) >= today).slice(0, 2);

  return (
    <div className="calendar-wrapper">
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>❮</button>
          <h2>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={handleNextMonth}>❯</button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map((day) => (
            <div className="calendar-day-name" key={day}>{day}</div>
          ))}
          {generateCalendar()}
        </div>
      </div>

      <div className="event-timeline">
        <h3>🗓️ Events</h3>

        <div className="timeline-section">
          <div className="timeline-label">
            <span className="dot past-dot"></span> Recent
          </div>
          {pastEvents.length > 0 ? (
            pastEvents.map((e, i) => (
              <div key={i} className="event-item past">
                <span className="date">{e.date}</span>
                <span className="title">{e.title}</span>
              </div>
            ))
          ) : (
            <p className="empty-msg">No recent events</p>
          )}
        </div>

        <div className="timeline-section">
          <div className="timeline-label">
            <span className="dot upcoming-dot"></span> Upcoming
          </div>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((e, i) => (
              <div key={i} className="event-item upcoming">
                <span className="date">{e.date}</span>
                <span className="title">{e.title}</span>
              </div>
            ))
          ) : (
            <p className="empty-msg">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Calendar;

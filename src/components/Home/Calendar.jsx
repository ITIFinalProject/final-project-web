// import { useState } from 'react';

// function Calendar() {
//   const today = new Date();
//   const [currentMonth, setCurrentMonth] = useState(today.getMonth());
//   const [currentYear, setCurrentYear] = useState(today.getFullYear());

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const startDay = new Date(currentYear, currentMonth, 1).getDay();

//   const events = [
//     { title: 'React Workshop', date: '2025-07-21' },
//     { title: 'Design Meetup', date: '2025-07-24' },
//     { title: 'Hackathon', date: '2025-07-27' },
//     { title: 'Conference', date: '2025-08-02' },
//   ];

//   const handlePrevMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//   };

//   const formatDate = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

//   const generateCalendar = () => {
//     const days = [];
//     for (let i = 0; i < startDay; i++) {
//       days.push(<div className="calendar-day empty" key={`empty-${i}`}></div>);
//     }
//     for (let d = 1; d <= daysInMonth; d++) {
//       const fullDate = formatDate(currentYear, currentMonth, d);
//       const isToday =
//         currentYear === today.getFullYear() &&
//         currentMonth === today.getMonth() &&
//         d === today.getDate();
//       const hasEvent = events.some((e) => e.date === fullDate);

//       days.push(
//         <div
//           key={d}
//           className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
//         >
//           {d}
//         </div>
//       );
//     }
//     return days;
//   };

//   const sortedEvents = [...events].sort(
//     (a, b) => new Date(a.date) - new Date(b.date)
//   );
//   const pastEvents = sortedEvents.filter((e) => new Date(e.date) < today).slice(-2);
//   const upcomingEvents = sortedEvents.filter((e) => new Date(e.date) >= today).slice(0, 2);

//   return (
//     <div className="calendar-wrapper">
//       <div className="calendar-container">
//         <div className="calendar-header">
//           <button onClick={handlePrevMonth}>❮</button>
//           <h2>{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
//           <button onClick={handleNextMonth}>❯</button>
//         </div>
//         <div className="calendar-grid">
//           {daysOfWeek.map((day) => (
//             <div className="calendar-day-name" key={day}>{day}</div>
//           ))}
//           {generateCalendar()}
//         </div>
//       </div>

//       <div className="event-timeline">
//         <h3>🗓️ Events</h3>

//         <div className="timeline-section">
//           <div className="timeline-label">
//             <span className="dot past-dot"></span> Recent
//           </div>
//           {pastEvents.length > 0 ? (
//             pastEvents.map((e, i) => (
//               <div key={i} className="event-item past">
//                 <span className="date">{e.date}</span>
//                 <span className="title">{e.title}</span>
//               </div>
//             ))
//           ) : (
//             <p className="empty-msg">No recent events</p>
//           )}
//         </div>

//         <div className="timeline-section">
//           <div className="timeline-label">
//             <span className="dot upcoming-dot"></span> Upcoming
//           </div>
//           {upcomingEvents.length > 0 ? (
//             upcomingEvents.map((e, i) => (
//               <div key={i} className="event-item upcoming">
//                 <span className="date">{e.date}</span>
//                 <span className="title">{e.title}</span>
//               </div>
//             ))
//           ) : (
//             <p className="empty-msg">No upcoming events</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Calendar;






























import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyEvents } from "../../redux/slices/eventSlice";


function Calendar() {
  const dispatch = useDispatch();
  const { myEvents, myEventsLoading, myEventsError } = useSelector(state => state.events);
  const currentUserId = useSelector((state) => state.auth).uid;
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  // Fetch events when component mounts or user changes
  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchMyEvents(currentUserId));
    }
  }, [dispatch, currentUserId]);

  // Transform events data to work with calendar
  const events = myEvents.map(event => ({
    title: event.title,
    date: event.date, // Assuming event.date is in YYYY-MM-DD format
    id: event.id,
    category: event.category,
    location: event.location,
    time: event.time
  }));

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

  // Parse date range (e.g., "2025-08-14 - 2025-08-16") to get start date
  const parseEventDate = (dateString) => {
    if (!dateString) return null;
    // Handle date ranges by taking the start date
    const startDate = dateString.split(' - ')[0];
    return startDate;
  };

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
      
      // Check if any event starts on this date
      const hasEvent = events.some((e) => {
        const eventStartDate = parseEventDate(e.date);
        return eventStartDate === fullDate;
      });

      days.push(
        <div
          key={d}
          className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
        >
          {d}
          {hasEvent && (
            <div className="event-indicator">
              {events
                .filter(e => parseEventDate(e.date) === fullDate)
                .slice(0, 2) // Show max 2 events per day
                .map((event, idx) => (
                  <div key={idx} className="event-dot" title={event.title}></div>
                ))
              }
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(parseEventDate(a.date)) - new Date(parseEventDate(b.date))
  );
  const pastEvents = sortedEvents.filter((e) => new Date(parseEventDate(e.date)) < today).slice(-2);
  const upcomingEvents = sortedEvents.filter((e) => new Date(parseEventDate(e.date)) >= today).slice(0, 2);

  if (myEventsLoading) {
    return (
      <div className="calendar-wrapper">
        <div className="loading-state">
          <p>Loading your events...</p>
        </div>
      </div>
    );
  }

  if (myEventsError) {
    return (
      <div className="calendar-wrapper">
        <div className="error-state">
          <p>Error loading events: {myEventsError}</p>
          <button onClick={() => dispatch(fetchMyEvents(currentUserId))}>
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        <h3>🗓️ My Events</h3>

        <div className="timeline-section">
          <div className="timeline-label">
            <span className="dot past-dot"></span> Recent
          </div>
          {pastEvents.length > 0 ? (
            pastEvents.map((e, i) => (
              <div key={i} className="event-item past">
                <span className="date">{parseEventDate(e.date)}</span>
                <span className="title">{e.title}</span>
                {e.time && <span className="time">{e.time}</span>}
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
                <span className="date">{parseEventDate(e.date)}</span>
                <span className="title">{e.title}</span>
                {e.time && <span className="time">{e.time}</span>}
                {e.location && <span className="location">📍 {e.location}</span>}
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

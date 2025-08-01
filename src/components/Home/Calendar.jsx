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
    const { currentUser } = useSelector((state) => state.auth);

    const { myEvents, myEventsLoading, myEventsError } = useSelector((state) => ({
        myEvents: state.events.myEvents,
        myEventsLoading: state.events.myEventsLoading,
        myEventsError: state.events.myEventsError,
    }));

    useEffect(() => {
        if (currentUser?.uid) {
            dispatch(fetchMyEvents(currentUser?.uid));
        }
    }, [dispatch, currentUser?.uid]);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();



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
    const startDate = dateString.split(' _ ')[0];
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






















// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMyEvents } from "../../redux/slices/eventSlice";


// function Calendar() {
//   const dispatch = useDispatch();
//     const { currentUser } = useSelector((state) => state.auth);

//     const { myEvents, myEventsLoading, myEventsError } = useSelector((state) => ({
//         myEvents: state.events.myEvents,
//         myEventsLoading: state.events.myEventsLoading,
//         myEventsError: state.events.myEventsError,
//     }));

//     useEffect(() => {
//         if (currentUser?.uid) {
//             dispatch(fetchMyEvents(currentUser?.uid));
//         }
//     }, [dispatch, currentUser?.uid]);
  
//   const today = new Date();
//   const [currentMonth, setCurrentMonth] = useState(today.getMonth());
//   const [currentYear, setCurrentYear] = useState(today.getFullYear());

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
//   const startDay = new Date(currentYear, currentMonth, 1).getDay();

//   // Parse date range (e.g., "12/10/2025 _ 14/5/2025" or "12/10/2025" or "2025-08-02") to get start date
//   const parseEventDate = (dateString) => {
//   if (!dateString) return null;
  
//   // Handle date ranges by taking the start date
//   const startDate = dateString.split(' _ ')[0];
  
//   // Check if already in YYYY-MM-DD format
//   if (startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
//     return startDate;
//   }
  
//   // Convert from DD/MM/YYYY to YYYY-MM-DD format
//   const dateParts = startDate.split('/');
//   if (dateParts.length === 3) {
//     const day = dateParts[0].padStart(2, '0');
//     const month = dateParts[1].padStart(2, '0');
//     const year = dateParts[2];
//     return `${year}-${month}-${day}`;
//   }
  
//   return null; // Return null if format is unexpected
// };

//   // Transform events data to work with calendar
//   const events = myEvents.map(event => ({
//     title: event.title,
//     date: event.date,
//     id: event.id,
//     category: event.category,
//     location: event.location,
//     time: event.time
//   }));

//   // CountDown Logic
//   const getNextUpcomingEvent = () => {
//   const now = new Date();
  
//   const validEvents = events.filter(event => {
//     const eventDate = parseEventDate(event.date);
//     if (!eventDate) return false;
    
//     // Create date object in local timezone
//     const [year, month, day] = eventDate.split('-').map(Number);
//     let eventDateTime = new Date(year, month - 1, day);
    
//     // If time is available, add it to the date
//     if (event.time) {
//       const startTime = event.time.split(' - ')[0];
//       const [hours, minutes] = startTime.split(':').map(Number);
//       eventDateTime.setHours(hours, minutes, 0, 0);
//     }
    
//     return eventDateTime > now;
//   });

//   // Sort by date
//   validEvents.sort((a, b) => {
//     const dateA = parseEventDate(a.date);
//     const dateB = parseEventDate(b.date);
//     const [yA, mA, dA] = dateA.split('-').map(Number);
//     const [yB, mB, dB] = dateB.split('-').map(Number);
    
//     let dateObjA = new Date(yA, mA - 1, dA);
//     let dateObjB = new Date(yB, mB - 1, dB);
    
//     // If times are available, consider them in comparison
//     if (a.time) {
//       const [hoursA, minsA] = a.time.split(' - ')[0].split(':').map(Number);
//       dateObjA.setHours(hoursA, minsA);
//     }
    
//     if (b.time) {
//       const [hoursB, minsB] = b.time.split(' - ')[0].split(':').map(Number);
//       dateObjB.setHours(hoursB, minsB);
//     }
    
//     return dateObjA - dateObjB;
//   });

//   return validEvents[0] || null;
// };

//   const nextEvent = getNextUpcomingEvent();
//   const nextEventDateTime = nextEvent ? 
//     `${parseEventDate(nextEvent.date)}T${nextEvent.time || '23:59:59'}` : null;

// const calculateTimeLeft = () => {
//   if (!nextEvent) return null;
  
//   const eventDate = parseEventDate(nextEvent.date);
//   if (!eventDate) return null;
  
//   const [year, month, day] = eventDate.split('-').map(Number);
//   const eventDateTime = new Date(year, month - 1, day);
  
//   // Add time if available
//   if (nextEvent.time) {
//     const [hours, minutes] = nextEvent.time.split(' - ')[0].split(':').map(Number);
//     eventDateTime.setHours(hours, minutes, 0, 0);
//   }
  
//   const difference = eventDateTime - new Date();
//   if (difference <= 0) return null;

//   return {
//     days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//     hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//     minutes: Math.floor((difference / 1000 / 60) % 60),
//     seconds: Math.floor((difference / 1000) % 60),
//   };
// };

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       const updated = calculateTimeLeft();
//       setTimeLeft(updated);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [nextEventDateTime]);

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
      
//       // Check if any event starts on this date
//       const hasEvent = events.some((e) => {
//         const eventStartDate = parseEventDate(e.date);
//         return eventStartDate === fullDate;
//       });

//       days.push(
//         <div
//           key={d}
//           className={`calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
//         >
//           {d}
//           {hasEvent && (
//             <div className="event-indicator">
//               {events
//                 .filter(e => parseEventDate(e.date) === fullDate)
//                 .slice(0, 2) // Show max 2 events per day
//                 .map((event, idx) => (
//                   <div key={idx} className="event-dot" title={event.title}></div>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       );
//     }
//     return days;
//   };

//   const sortedEvents = [...events].sort(
//     (a, b) => new Date(parseEventDate(a.date)) - new Date(parseEventDate(b.date))
//   );
//   const pastEvents = sortedEvents.filter((e) => new Date(parseEventDate(e.date)) < today).slice(-2);
//   const upcomingEvents = sortedEvents.filter((e) => new Date(parseEventDate(e.date)) >= today).slice(0, 2);

//   if (myEventsLoading) {
//     return (
//       <div className="calendar-wrapper">
//         <div className="loading-state">
//           <p>Loading your events...</p>
//         </div>
//       </div>
//     );
//   }

//   if (myEventsError) {
//     return (
//       <div className="calendar-wrapper">
//         <div className="error-state">
//           <p>Error loading events: {myEventsError}</p>
//           <button onClick={() => dispatch(fetchMyEvents(currentUser?.uid))}>
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
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
//         <h3>🗓️ My Events</h3>

//         <div className="timeline-section">
//           <div className="timeline-label">
//             <span className="dot past-dot"></span> Recent
//           </div>
//           {pastEvents.length > 0 ? (
//             pastEvents.map((e, i) => (
//               <div key={i} className="event-item past">
//                 <span className="date">{parseEventDate(e.date)}</span>
//                 <span className="title">{e.title}</span>
//                 {e.time && <span className="time">{e.time}</span>}
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
//                 <span className="date">{parseEventDate(e.date)}</span>
//                 <span className="title">{e.title}</span>
//                 {e.time && <span className="time">{e.time}</span>}
//                 {e.location && <span className="location">📍 {e.location}</span>}
//               </div>
//             ))
//           ) : (
//             <p className="empty-msg">No upcoming events</p>
//           )}
//         </div>
//       </div>
//     </div>
    
//     {/* CountDown Section */}
//     {nextEvent && timeLeft ? (
//       <div className="countdown-container">
//         <h2 className="countdown-title">Next Event Count Down</h2>
//         <p className="countdown-event-name">{nextEvent.title}</p>
//         <div className="countdown-timer">
//           <div className="time-box">
//             <span className="number">{timeLeft.days}</span>
//             <span className="label">Days</span>
//           </div>
//           <div className="time-box">
//             <span className="number">{timeLeft.hours}</span>
//             <span className="label">Hours</span>
//           </div>
//           <div className="time-box">
//             <span className="number">{timeLeft.minutes}</span>
//             <span className="label">Minutes</span>
//           </div>
//           <div className="time-box">
//             <span className="number">{timeLeft.seconds}</span>
//             <span className="label">Seconds</span>
//           </div>
//         </div>
//       </div>
//     ) : nextEvent && !timeLeft ? (
//       <div className="countdown-container">
//         <h2 className="countdown-title">🎉 Event Started!</h2>
//         <p className="countdown-event-name">{nextEvent.title}</p>
//       </div>
//     ) : (
//       <div className="countdown-container">
//         <h2 className="countdown-title">No Upcoming Events</h2>
//         <p className="countdown-event-name">Schedule your next event!</p>
//       </div>
//     )}
//     </>
//   );
// }

// export default Calendar;
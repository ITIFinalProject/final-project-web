// import { useEffect } from 'react';
// import '../styles/events.css'
// import LongCard from '../components/Events/LongCard'
// import Filter from '../components/Events/Filter'
// import { useSelector, useDispatch } from "react-redux";
// import { fetchEvents } from "../redux/slices/eventSlice"

//   ;
// const Events = () => {
//   const dispatch = useDispatch();
//   const { data: events, loading, error } = useSelector((state) => state.events);

//   useEffect(() => {
//     dispatch(fetchEvents());
//   }, [dispatch]);



//   return (
//     <section className='events-page'>
//       <Filter />
//       <div className="all-events">
//         {loading ? (
//           <p>Loading events...</p>
//         ) : error ? (
//           <p>Error loading events: {error}</p>
//         ) : events.length > 0 ? (
//           events.map((event) => <LongCard event={event} key={event.id} />)
//         ) : (
//           <p>No events found.</p>
//         )}
//       </div>
//     </section>
//   )
// }

// export default Events


















// import { useEffect, useState } from 'react';
// import '../styles/events.css';
// import LongCard from '../components/Events/LongCard';
// import Filter from '../components/Events/Filter';
// import { useSelector, useDispatch } from "react-redux";
// import { fetchEvents } from "../redux/slices/eventSlice";

// const Events = () => {
//   const dispatch = useDispatch();
//   const { data: allEvents, loading, error } = useSelector((state) => state.events);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const EVENTS_PER_PAGE = 5;

//   useEffect(() => {
//     dispatch(fetchEvents());
//   }, [dispatch]);

//   const filteredEvents = allEvents.filter(event => {
//     const categoryMatch = selectedCategory === "All" || event.category === selectedCategory;
//     const dateMatch = !selectedDate || event.date.startsWith(selectedDate);
//     return categoryMatch && dateMatch;
//   });

//   const startIdx = (currentPage - 1) * EVENTS_PER_PAGE;
//   const paginatedEvents = filteredEvents.slice(startIdx, startIdx + EVENTS_PER_PAGE);
//   const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

//   return (
//     <section className='events-page'>
//       <Filter
//         selectedCategory={selectedCategory}
//         onCategoryChange={setSelectedCategory}
//         selectedDate={selectedDate}
//         onDateChange={setSelectedDate}
//       />
//       <div className="all-events">
//         {loading ? (
//           <p>Loading events...</p>
//         ) : error ? (
//           <p>Error loading events: {error}</p>
//         ) : filteredEvents.length === 0 ? (
//           <p>No events found.</p>
//         ) : (
//           <>
//             {paginatedEvents.map((event) => (
//               <LongCard event={event} key={event.id} />
//             ))}
//             <div className="pagination">
//               {Array.from({ length: totalPages }, (_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={currentPage === i + 1 ? "active" : ""}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default Events;









import { useEffect, useState, useMemo } from 'react';
import '../styles/events.css'
import LongCard from '../components/Events/LongCard'
import Filter from '../components/Events/Filter'
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents } from "../redux/slices/eventSlice";
import { useLocation } from 'react-router-dom';
const Events = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { data: events, loading, error } = useSelector((state) => state.events);

  // Filter and pagination state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;
  // const user = useSelector((state) => state.auth.currentUser);
  const { currentUser, userData } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    dispatch(fetchEvents(currentUser?.uid));
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromURL = params.get('category');
    if (categoryFromURL && ['Entertainment', 'Educational & Business', 'Cultural & Arts', 'Sports & Fitness', 'Technology & Innovation', 'Travel & Adventure'].includes(categoryFromURL)) {
      setSelectedCategory(categoryFromURL);
    }
  }, [location.search]);

  // Filter events based on selected criteria
  const filteredEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    if (selectedDate) {
      filtered = filtered.filter(event => event.date === selectedDate);
    }

    return filtered;
  }, [events, selectedCategory, selectedDate]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedDate]);

  // Filter handlers
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return (
      <section className='events-page'>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      </section>
    );
  }

  return (
    <section className='events-page'>
      <Filter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <div className="events-content">
        <div className="events-header">
          <h2>Events</h2>
          <p className="results-count">
            Showing {paginatedEvents.length} of {filteredEvents.length} events
          </p>
        </div>

        <div className="all-events">
          {error ? (
            <p className="error-message">Error loading events: {error}</p>
          ) : paginatedEvents.length > 0 ? (
            paginatedEvents.map((event) => (
              <LongCard event={event} key={event.id} />
            ))
          ) : (
            <div className="no-events">
              <div className="no-events-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <h3>No events found</h3>
              <p>Try adjusting your filters to find more events.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              Previous
            </button>

            <div className="page-numbers">
              {currentPage > 3 && (
                <>
                  <button onClick={() => handlePageChange(1)} className="page-btn">1</button>
                  {currentPage > 4 && <span className="ellipsis">...</span>}
                </>
              )}

              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && <span className="ellipsis">...</span>}
                  <button onClick={() => handlePageChange(totalPages)} className="page-btn">
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Events
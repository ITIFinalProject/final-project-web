import React, { useState, useEffect } from "react";
import { IoStar, IoLocationSharp, IoPeopleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToInterested,
  removeFromInterested,
} from "../../redux/slices/interestedSlice";
import defaultBanner from "../../assets/images/banner.png";

const LongCard = ({ event }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Memoized selector to avoid creating new objects on every render
  const eventIds = useSelector((state) => {
    return state.interested?.eventIds || [];
  });

  const [isInterested, setIsInterested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if this event is in the user's interested events
    if (eventIds && Array.isArray(eventIds)) {
      setIsInterested(eventIds.includes(event.id));
    }
  }, [eventIds, event.id]);

  const handleStarClick = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking star
    e.stopPropagation(); // Stop event bubbling

    if (!currentUser) {
      // You might want to show a login prompt here
      alert("Please log in to add events to your interested list");
      return;
    }

    setIsLoading(true);
    try {
      if (isInterested) {
        // Remove from interested
        await dispatch(
          removeFromInterested({
            userId: currentUser.uid,
            eventId: event.id,
          })
        ).unwrap();
      } else {
        // Add to interested
        await dispatch(
          addToInterested({
            userId: currentUser.uid,
            eventId: event.id,
            eventData: {
              title: event.title,
              date: event.startDate || event.date,
              location: event.location,
            },
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error updating interested events:", error);
      alert("Failed to update interested events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDateDisplay = (dateString) => {
    if (!dateString) return { month: "TBD", day: "00" };

    // Handle date range formats like "03/08/2025 - 06/08/2025" or "2025-09-13 - 2025-11-28"
    let dateStr;
    if (typeof dateString === "string" && dateString.includes("_")) {
      // Extract the start date from the range
      dateStr = dateString.split("_")[0].trim();
    } else {
      // For single dates or other formats
      dateStr = dateString;
    }

    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    try {
      let dateToFormat;

      // Handle date range formats like "31-07-2025 _ 02-08-2025"
      if (typeof dateStr === "string" && dateStr.includes(" _ ")) {
        // Extract the start date from the range
        const startDate = dateStr.split(" _ ")[0].trim();
        dateToFormat = startDate;
      } else {
        dateToFormat = dateStr;
      }

      let date;
      if (dateToFormat.seconds) {
        // Firestore timestamp
        date = new Date(dateToFormat.seconds * 1000);
      } else {
        // Handle different date formats
        if (
          typeof dateToFormat === "string" &&
          dateToFormat.includes("-") &&
          dateToFormat.split("-").length === 3
        ) {
          const parts = dateToFormat.split("-").map((num) => parseInt(num, 10));

          // Check if it's DD-MM-YYYY (day > 12 or year < 1000) or YYYY-MM-DD format
          if (parts[0] > 31 || parts[0] > 1900) {
            // YYYY-MM-DD format (from web form)
            const [year, month, day] = parts;
            date = new Date(year, month - 1, day);
          } else {
            // DD-MM-YYYY format (from mobile app)
            const [day, month, year] = parts;
            date = new Date(year, month - 1, day);
          }
        } else {
          date = new Date(dateToFormat);
        }
      }

      if (isNaN(date.getTime())) {
        return { month: "TBD", day: "00" };
      }

      return {
        month: months[date.getMonth()],
        day: date.getDate().toString().padStart(2, "0"),
      };
    } catch (error) {
      console.error("Error parsing date:", error, "Input:", dateStr);
      return { month: "TBD", day: "00" };
    }
  };

  const dateDisplay = getDateDisplay(event.startDate || event.date);

  return (
    <Link to={`/event/${event.id}`} className="long-card-link">
      <div className="long-card">
        <div className="image-section">
          <img
            src={event.bannerUrl || event.image || defaultBanner}
            alt={event.title}
          />
          <div className="date-badge">
            <div className="month">{dateDisplay.month}</div>
            <div className="day">{dateDisplay.day}</div>
          </div>
          <button
            className={`star-button ${isInterested ? "starred" : ""}`}
            onClick={handleStarClick}
            disabled={isLoading}
          >
            <IoStar className={`star-icon ${isInterested ? "filled" : ""}`} />
          </button>
        </div>

        <div className="details-section">
          <h3 className="title">{event.title}</h3>
          <div className="location">
            <IoLocationSharp className="location-icon" />
            <span>{event.location}</span>
          </div>
          <div className="time">
            {event.startTime && event.endTime
              ? `${event.startTime} - ${event.endTime}`
              : event.time}
          </div>
          {event.capacity && (
            <div className="capacity">
              <IoPeopleOutline className="people-icon" />
              <span>Max: {event.capacity} attendees</span>
            </div>
          )}
          <div className="card-type">
            <p>{event.type}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LongCard;

// import React, { useState } from "react";
// import { IoStar, IoStarOutline, IoLocationSharp, IoPeopleSharp, IoTimeSharp } from "react-icons/io5";

// const LongCard = ({ event }) => {
//   const [isStarred, setIsStarred] = useState(false);
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);

//   const getDateDisplay = (dateStr) => {
//     const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
//     const date = new Date(dateStr);
//     return {
//       month: months[date.getMonth()],
//       day: date.getDate().toString().padStart(2, "0"),
//     };
//   };

//   const formatInterested = (count) => {
//     if (count >= 1000) {
//       return `${(count / 1000).toFixed(1)}k`;
//     }
//     return count.toString();
//   };

//   const handleStarClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsStarred(!isStarred);
//     // Here you could dispatch an action to save/unsave the event
//   };

//   const handleCardClick = () => {
//     // Navigate to event details page
//     console.log('Navigate to event:', event.id);
//   };

//   const handleImageLoad = () => {
//     setImageLoaded(true);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setImageLoaded(true);
//   };

//   const dateDisplay = getDateDisplay(event.date);

//   return (
//     <div className="long-card" onClick={handleCardClick}>
//       <div className="image-section">
//         {!imageLoaded && !imageError && (
//           <div className="image-placeholder">
//             <div className="image-skeleton"></div>
//           </div>
//         )}

//         {imageError ? (
//           <div className="image-fallback">
//             <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
//             </svg>
//             <span>Image not available</span>
//           </div>
//         ) : (
//           <img
//             src={event.bannerUrl}
//             alt={event.title}
//             onLoad={handleImageLoad}
//             onError={handleImageError}
//             style={{ display: imageLoaded ? 'block' : 'none' }}
//           />
//         )}

//         <div className="date-badge">
//           <div className="month">{dateDisplay.month}</div>
//           <div className="day">{dateDisplay.day}</div>
//         </div>

//         <button
//           className={`star-button ${isStarred ? 'starred' : ''}`}
//           onClick={handleStarClick}
//           aria-label={isStarred ? 'Remove from favorites' : 'Add to favorites'}
//         >
//           {isStarred ? (
//             <IoStar className="star-icon filled" />
//           ) : (
//             <IoStarOutline className="star-icon" />
//           )}
//         </button>

//         {event.category && (
//           <div className="category-badge">
//             {event.category}
//           </div>
//         )}
//       </div>

//       <div className="details-section">
//         <div className="event-header">
//           <h3 className="title">{event.title}</h3>
//           {event.price && (
//             <div className="price">
//               {event.price === 0 || event.price === 'Free' ? 'Free' : `$${event.price}`}
//             </div>
//           )}
//         </div>

//         <div className="event-meta">
//           <div className="location">
//             <IoLocationSharp className="location-icon" />
//             <span>{event.location}</span>
//           </div>

//           <div className="time">
//             <IoTimeSharp className="time-icon" />
//             <span>{event.time}</span>
//           </div>
//         </div>

//         <div className="event-footer">
//           <div className="interested">
//             <IoPeopleSharp className="people-icon" />
//             <span>
//                 {/* {formatInterested(event.interested)}  */}
//                 interested</span>
//           </div>

//           {event.tags && event.tags.length > 0 && (
//             <div className="tags">
//               {event.tags.slice(0, 2).map((tag, index) => (
//                 <span key={index} className="tag">
//                   {tag}
//                 </span>
//               ))}
//               {event.tags.length > 2 && (
//                 <span className="tag more-tags">
//                   +{event.tags.length - 2}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {event.description && (
//           <div className="event-description">
//             <p>{event.description.length > 120 ?
//               `${event.description.substring(0, 120)}...` :
//               event.description
//             }</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LongCard;

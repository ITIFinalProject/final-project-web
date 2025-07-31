import React, { useState, useEffect } from "react";
import { IoStar, IoLocationSharp, IoPeopleSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToInterested,
  removeFromInterested,
} from "../../redux/slices/interestedSlice";
import { useInterestedCount } from "../../hooks/useInterestedCount";

const LongCard = ({ event }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Get interested count for this event
  const { count: interestedCount, refetch: refetchCount } = useInterestedCount(
    event.id
  );

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

      // Refetch the interested count after updating
      refetchCount();
    } catch (error) {
      console.error("Error updating interested events:", error);
      alert("Failed to update interested events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getDateDisplay = (dateStr) => {
    if (!dateStr) return { month: "TBD", day: "00" };

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
      let date;
      if (dateStr.seconds) {
        // Firestore timestamp
        date = new Date(dateStr.seconds * 1000);
      } else {
        date = new Date(dateStr);
      }

      if (isNaN(date.getTime())) {
        return { month: "TBD", day: "00" };
      }

      return {
        month: months[date.getMonth()],
        day: date.getDate().toString().padStart(2, "0"),
      };
    } catch (error) {
      console.error("Error parsing date:", error);
      return { month: "TBD", day: "00" };
    }
  };

  const dateDisplay = getDateDisplay(event.startDate || event.date);

  return (
    <Link to={`/event/${event.id}`} className="long-card-link">
      <div className="long-card">
        <div className="image-section">
          <img
            src={event.bannerUrl || event.image || "/no-event.jpg"}
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
            {event.startTime}-{event.endTime}
          </div>
          <div className="interested">
            <IoPeopleSharp className="people-icon" />
            <span>{interestedCount} interested</span>
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
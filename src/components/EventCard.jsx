import React, { useState, useEffect } from "react";
import { IoStar, IoLocationSharp, IoPeopleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToInterested,
  removeFromInterested,
} from "../redux/slices/interestedSlice";
import "../styles/InterestedEvents.css"; // Import the CSS file

// EventCard Component (would be in src/components/EventCard.jsx)
const EventCard = ({ event }) => {
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
      let dateToFormat;

      // Handle date range formats like "03/08/2025 - 06/08/2025" or "2025-09-13 - 2025-11-28"
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
        date = new Date(dateToFormat);
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
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-image-container">
          <img
            src={event.image || event.bannerUrl || "/no-event.jpg"}
            alt={event.title}
            className="event-image"
          />
          <div className="date-badge">
            <div className="date-month">{dateDisplay.month}</div>
            <div className="date-day">{dateDisplay.day}</div>
          </div>
          <button
            className={`star-button ${isInterested ? "starred" : ""}`}
            onClick={handleStarClick}
            disabled={isLoading}
          >
            <IoStar className={`star-icon ${isInterested ? "filled" : ""}`} />
          </button>
        </div>

        <div className="event-content">
          <h3 className="event-name">{event.title}</h3>

          <div className="event-location">
            <IoLocationSharp className="location-icon" />
            <span>{event.location}</span>
          </div>

          <div className="event-time">{event.time}</div>

          <div className="detail-item d-flex align-items-center mb-2">
            <IoPeopleOutline className="me-2 text-primary" />
            <small className="text-muted">
              Max: {event.capacity} attendees
            </small>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

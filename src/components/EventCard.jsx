import React, { useState, useEffect } from "react";
import { IoStar, IoLocationSharp, IoPeopleOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  addToInterested,
  removeFromInterested,
} from "../redux/slices/interestedSlice";
import defaultBanner from "../assets/images/banner.png";
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
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-image-container">
          <img
            src={event.image || event.bannerUrl || defaultBanner}
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

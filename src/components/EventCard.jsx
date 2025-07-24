import React from "react";
import { IoStar, IoLocationSharp, IoPeopleSharp } from "react-icons/io5";
import "../styles/InterestedEvents.css"; // Import the CSS file

// EventCard Component (would be in src/components/EventCard.jsx)
const EventCard = ({ event }) => {
  const getDateDisplay = (dateStr) => {
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
    const date = new Date(dateStr);
    return {
      month: months[date.getMonth()],
      day: date.getDate().toString().padStart(2, "0"),
    };
  };

  const dateDisplay = getDateDisplay(event.date);

  return (
    <div className="event-card">
      <div className="event-image-container">
        <img src={event.image} alt={event.title} className="event-image" />
        <div className="date-badge">
          <div className="date-month">{dateDisplay.month}</div>
          <div className="date-day">{dateDisplay.day}</div>
        </div>
        <button className="star-button">
          <IoStar className="star-icon" />
        </button>
      </div>

      <div className="event-content">
        <h3 className="event-name">{event.title}</h3>

        <div className="event-location">
          <IoLocationSharp className="location-icon" />
          <span>{event.location}</span>
        </div>

        <div className="event-time">{event.time}</div>

        <div className="event-footer-container">
          <div className="interested-count">
            <IoPeopleSharp className="users-icon" />
            <span>{event.interested} interested</span>
          </div>
          {event.price && <span className="event-price">{event.price}</span>}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

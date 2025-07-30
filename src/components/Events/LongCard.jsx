import React, { useState, useEffect } from "react";
import { IoStar, IoLocationSharp, IoPeopleSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import {
  addToInterested,
  removeFromInterested,
} from "../../redux/slices/interestedSlice";

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

  const handleStarClick = async () => {
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
              date: event.date,
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
    <div className="long-card">
      <div className="image-section">
        <img src={event.bannerUrl} alt={event.title} />
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
        <div className="time">{event.time}</div>
        <div className="interested">
          <IoPeopleSharp className="people-icon" />
          <span>{event.interested} interested</span>
        </div>
      </div>
    </div>
  );
};

export default LongCard;

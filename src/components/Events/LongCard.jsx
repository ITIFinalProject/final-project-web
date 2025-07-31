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

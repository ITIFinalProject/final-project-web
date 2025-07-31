import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const MyEventCard = ({ event, isOwner, onEdit, onDelete }) => {
  const navigate = useNavigate();

  // Debug: Log event data to understand the timestamp format
  console.log("Event data:", event);
  console.log("Event date field:", event.date);
  console.log("Event startDate field:", event.startDate);
  console.log("Event startTime field:", event.startTime);
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date TBD";

    try {
      // Handle different timestamp formats
      let date;
      if (timestamp.toDate) {
        // Firestore Timestamp
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        // String date
        date = new Date(timestamp);
      } else if (typeof timestamp === "object" && timestamp.seconds) {
        // Firestore timestamp object with seconds
        date = new Date(timestamp.seconds * 1000);
      } else {
        // Number timestamp
        date = new Date(timestamp);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date Error";
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      // If it's already a formatted time string (like "14:33" or "14:33 - 14:32"), return as is
      if (typeof timestamp === "string") {
        // Check if it's a time string pattern (HH:MM or HH:MM - HH:MM)
        if (/^\d{1,2}:\d{2}(\s*-\s*\d{1,2}:\d{2})?$/.test(timestamp)) {
          // Convert 24-hour format to 12-hour format
          const timeRanges = timestamp.split(" - ");
          const convertedTimes = timeRanges.map((timeStr) => {
            const [hours, minutes] = timeStr.trim().split(":");
            const hour = parseInt(hours);
            const ampm = hour >= 12 ? "PM" : "AM";
            const displayHour = hour % 12 || 12;
            return `${displayHour}:${minutes} ${ampm}`;
          });
          return convertedTimes.join(" - ");
        }

        // Try to parse as a date string
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
        }

        // If it can't be parsed, return the original string
        return timestamp;
      }

      // Handle other timestamp formats (Date objects, Firestore timestamps, etc.)
      let date;
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "object" && timestamp.seconds) {
        // Firestore timestamp object with seconds
        date = new Date(timestamp.seconds * 1000);
      } else {
        date = new Date(timestamp);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Time";
      }

      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time Error";
    }
  };

  const handleViewEvent = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <div className="card my-event-card">
      <div className="row g-0">
        {/* Event Image */}
        <div className="col-md-3">
          <div className="event-image-container position-relative">
            <img
              src={event.bannerUrl || "/no-event.jpg"}
              alt={event.title}
              className="img-fluid rounded-start"
              style={{ height: "100%", width: "100%" }}
            />
            {isOwner && (
              <div className="event-badge  position-absolute top-0 end-0 m-2 badge ">
                Host
              </div>
            )}
          </div>
        </div>

        {/* Event Content */}
        <div className="col-md-9">
          <div className="card-body d-flex flex-column h-100">
            {/* Event Title */}
            <h5 className="card-title text-truncate" title={event.title}>
              {event.title || "Untitled Event"}
            </h5>

            {/* Event Details */}
            <div className="event-details mb-3">
              <div className="detail-item d-flex align-items-center mb-2">
                <IoCalendarOutline className="me-2 text-primary" />
                <small className="text-muted">
                  {formatDate(event.startDate || event.date)}{" "}
                  {/* Handle time display */}
                  {event.startTime
                    ? // If startTime exists, format it
                      formatTime(event.startTime)
                    : event.time
                    ? // If time exists, use it directly (it's already formatted)
                      typeof event.time === "string"
                      ? event.time
                      : formatTime(event.time)
                    : "Time TBD"}
                </small>
              </div>

              <div className="detail-item d-flex align-items-center mb-2">
                <IoLocationOutline className="me-2 text-primary" />
                <small className="text-muted text-truncate">
                  {event.location || "Location TBD"}
                </small>
              </div>

              {event.capacity && (
                <div className="detail-item d-flex align-items-center mb-2">
                  <IoPeopleOutline className="me-2 text-primary" />
                  <small className="text-muted">
                    Max: {event.capacity} attendees
                  </small>
                </div>
              )}
            </div>

            {/* Event Description */}
            {event.description && (
              <p className="card-text text-muted small">
                {event.description.length > 100
                  ? `${event.description.substring(0, 100)}...`
                  : event.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="d-flex gap-2">
                <button
                  className="event-btn-view flex-fill"
                  onClick={handleViewEvent}
                >
                  <FaEye className="me-1" />
                  View
                </button>

                {isOwner && onEdit && (
                  <button
                    className="event-btn-edit"
                    onClick={onEdit}
                    title="Edit Event"
                  >
                    <FaEdit />
                  </button>
                )}

                {isOwner && onDelete && (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={onDelete}
                    title="Delete Event"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;

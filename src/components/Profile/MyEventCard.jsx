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
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date TBD";

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
    } else {
      // Number timestamp
      date = new Date(timestamp);
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
              <div className="event-badge owner-badge position-absolute top-0 end-0 m-2 badge bg-primary">
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
                  {/* Handle both separate startTime and combined time formats */}
                  {event.startTime
                    ? formatTime(event.startTime)
                    : event.time && typeof event.time === "string"
                    ? event.time
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
                  className="btn btn-outline-primary btn-sm flex-fill"
                  onClick={handleViewEvent}
                >
                  <FaEye className="me-1" />
                  View
                </button>

                {isOwner && onEdit && (
                  <button
                    className="btn btn-outline-success btn-sm"
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

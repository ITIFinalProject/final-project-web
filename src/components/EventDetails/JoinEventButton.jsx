import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { eventService } from "../../services/eventService";
import { IoPeople } from "react-icons/io5";

const JoinEventButton = ({ event, onEventUpdate }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [localAttendees, setLocalAttendees] = useState(
    event?.currentAttendees || 0
  );

  useEffect(() => {
    // Update local attendees when event prop changes
    const attendees = event?.currentAttendees;
    // Handle cases where currentAttendees might be undefined or null
    setLocalAttendees(typeof attendees === "number" ? attendees : 0);
  }, [event?.currentAttendees]);

  useEffect(() => {
    // Check if user has joined this event when component mounts
    const checkJoinedStatus = async () => {
      try {
        const joined = await eventService.isUserJoined(
          currentUser.uid,
          event.id
        );
        setIsJoined(joined);
      } catch (error) {
        console.error("Error checking join status:", error);
      }
    };

    if (currentUser && event?.id) {
      checkJoinedStatus();
    }
  }, [currentUser, event?.id]);

  // Function to check if event is upcoming or current day
  const isEventUpcoming = () => {
    if (!event?.date && !event?.startDate) return false;

    try {
      const dateString = event?.startDate || event?.date;
      let eventDate;

      // Handle date range formats like "31-07-2025 _ 02-08-2025"
      if (typeof dateString === "string" && dateString.includes(" _ ")) {
        const startDate = dateString.split(" _ ")[0].trim();
        eventDate = new Date(startDate);
      } else if (dateString?.seconds) {
        // Firestore timestamp
        eventDate = new Date(dateString.seconds * 1000);
      } else if (typeof dateString === "string" && dateString.includes("-")) {
        // Handle different date formats (YYYY-MM-DD or DD-MM-YYYY)
        const parts = dateString.split("-").map((num) => parseInt(num, 10));
        if (parts[0] > 31 || parts[0] > 1900) {
          // YYYY-MM-DD format
          const [year, month, day] = parts;
          eventDate = new Date(year, month - 1, day);
        } else {
          // DD-MM-YYYY format
          const [day, month, year] = parts;
          eventDate = new Date(year, month - 1, day);
        }
      } else {
        eventDate = new Date(dateString);
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const eventDateOnly = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );

      // If we have time information and it's today, check the time
      if (eventDateOnly.getTime() === today.getTime()) {
        if (event?.time || event?.startTime) {
          const timeString = event?.startTime || event?.time;
          if (timeString && typeof timeString === "string") {
            const timeOnly = timeString.includes(" - ")
              ? timeString.split(" - ")[0]
              : timeString;
            const [hours, minutes] = timeOnly
              .split(":")
              .map((num) => parseInt(num, 10));
            if (!isNaN(hours) && !isNaN(minutes)) {
              eventDate.setHours(hours, minutes, 0, 0);
              return eventDate > now; // For today, check if time has passed
            }
          }
        }
        return true; // If it's today and no specific time, allow joining
      }

      // For future dates, always allow joining
      return eventDateOnly >= today;
    } catch (error) {
      console.error("Error checking if event is upcoming:", error);
      return false; // Default to false if we can't determine
    }
  };

  const eventIsUpcoming = isEventUpcoming();
  const capacity = event?.capacity;
  const currentAttendees = localAttendees;

  // Debug logging for event timing
  console.log("JoinEventButton Event Timing Debug:", {
    eventId: event?.id,
    eventDate: event?.startDate || event?.date,
    eventTime: event?.startTime || event?.time,
    isUpcoming: eventIsUpcoming,
    currentDate: new Date().toISOString(),
  });

  // Don't show button if event is not public
  if (event?.type !== "Public") {
    return null;
  }

  // Don't show button if user is logged in and is the host
  if (currentUser && event?.hostId === currentUser?.uid) {
    return null;
  }

  // If user is not logged in, show login prompt
  if (!currentUser) {
    return (
      <div className="join-event-section">
        <div className="container">
          <div className="join-event-card">
            <div className="event-capacity-info">
              <div className="capacity-stats">
                <IoPeople className="capacity-icon" />
                <span className="capacity-text">
                  {localAttendees} {capacity ? `/ ${capacity}` : ""} attendees
                </span>
              </div>
              {capacity && (
                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{
                      width: `${Math.min(
                        (localAttendees / capacity) * 100,
                        100
                      )}%`,
                    }}
                    title={`${localAttendees} of ${capacity} attendees (${Math.round(
                      (localAttendees / capacity) * 100
                    )}%)`}
                  ></div>
                </div>
              )}
            </div>
            <div className="join-button-container">
              <button
                className="join-event-btn login-required"
                onClick={() => (window.location.href = "/login")}
              >
                Login to Join Event
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If event is outdated, show a message instead
  if (!eventIsUpcoming) {
    return (
      <div className="join-event-section">
        <div className="container">
          <div className="join-event-card">
            <div className="event-capacity-info">
              <div className="capacity-stats">
                <IoPeople className="capacity-icon" />
                <span className="capacity-text">
                  {currentAttendees} {capacity ? `/ ${capacity}` : ""} attendees
                </span>
              </div>
              {capacity && (
                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{
                      width: `${Math.min(
                        (currentAttendees / capacity) * 100,
                        100
                      )}%`,
                    }}
                    title={`${currentAttendees} of ${capacity} attendees (${Math.round(
                      (currentAttendees / capacity) * 100
                    )}%)`}
                  ></div>
                </div>
              )}
            </div>
            <div className="join-button-container">
              <div className="event-ended-message">
                <p>🕰️ This event has ended</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCapacityFull = capacity && currentAttendees >= capacity;

  // Debug logging
  console.log("JoinEventButton Debug:", {
    eventId: event?.id,
    capacity,
    currentAttendees,
    localAttendees,
    eventCurrentAttendees: event?.currentAttendees,
    isCapacityFull,
    progressPercentage: capacity ? (currentAttendees / capacity) * 100 : 0,
  });

  const handleJoinClick = async () => {
    if (!currentUser || !event?.id || loading) return;

    setLoading(true);
    setError(null);

    try {
      if (isJoined) {
        // Leave event
        await eventService.leaveEvent(currentUser.uid, event.id);
        setIsJoined(false);

        // Update local attendees immediately
        const newAttendees = Math.max((localAttendees || 1) - 1, 0);
        setLocalAttendees(newAttendees);

        // Update parent component's event data
        if (onEventUpdate) {
          onEventUpdate({
            ...event,
            currentAttendees: newAttendees,
          });
        }
      } else {
        // Check capacity before joining
        if (isCapacityFull) {
          setShowCapacityWarning(true);
          setTimeout(() => setShowCapacityWarning(false), 3000);
          setLoading(false);
          return;
        }

        // Join event
        await eventService.joinEvent(currentUser.uid, event.id);
        setIsJoined(true);

        // Update local attendees immediately
        const newAttendees = (localAttendees || 0) + 1;
        setLocalAttendees(newAttendees);

        // Update parent component's event data
        if (onEventUpdate) {
          onEventUpdate({
            ...event,
            currentAttendees: newAttendees,
          });
        }
      }
    } catch (error) {
      console.error("Error joining/leaving event:", error);
      setError(error.message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="join-event-section"
      key={`join-${event?.id}-${currentAttendees}`}
    >
      <div className="container">
        <div className="join-event-card">
          <div className="event-capacity-info">
            <div className="capacity-stats">
              <IoPeople className="capacity-icon" />
              <span className="capacity-text">
                {currentAttendees} {capacity ? `/ ${capacity}` : ""} attendees
              </span>
            </div>
            {capacity && (
              <div className="capacity-bar">
                <div
                  className="capacity-fill"
                  style={{
                    width: `${Math.min(
                      (currentAttendees / capacity) * 100,
                      100
                    )}%`,
                  }}
                  title={`${currentAttendees} of ${capacity} attendees (${Math.round(
                    (currentAttendees / capacity) * 100
                  )}%)`}
                ></div>
              </div>
            )}
          </div>

          <div className="join-button-container">
            <button
              className={`join-event-btn ${isJoined ? "joined" : ""} ${
                isCapacityFull && !isJoined ? "disabled" : ""
              }`}
              onClick={handleJoinClick}
              disabled={loading || (isCapacityFull && !isJoined)}
            >
              {loading ? (
                <span className="loading-text">
                  <div className="loading-spinner"></div>
                  {isJoined ? "Leaving..." : "Joining..."}
                </span>
              ) : isJoined ? (
                "Joined ✓"
              ) : isCapacityFull ? (
                "Event Full"
              ) : (
                "Join This Event"
              )}
            </button>

            {showCapacityWarning && (
              <div className="capacity-warning">
                <p>⚠️ This event has reached its maximum capacity!</p>
              </div>
            )}

            {error && (
              <div className="join-error">
                <p>❌ {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinEventButton;

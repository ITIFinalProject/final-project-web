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

  // Don't show button if user is not logged in, event is not public, or user is the host
  if (
    !currentUser ||
    event?.type !== "Public" ||
    event?.hostId === currentUser?.uid
  ) {
    return null;
  }

  const capacity = event?.capacity;
  const currentAttendees = localAttendees;
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

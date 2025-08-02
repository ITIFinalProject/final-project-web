import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById, clearCurrentEvent } from "../redux/slices/eventSlice";
import HeroBanner from "../components/EventDetails/HeroBanner";
import EventTitleSection from "../components/EventDetails/EventTitleSection";
import DateTimeSection from "../components/EventDetails/DateTimeSection";
import LocationSection from "../components/EventDetails/LocationSection";
import EventDescription from "../components/EventDetails/EventDescription";
import TagsSection from "../components/EventDetails/TagsSection";
import JoinEventButton from "../components/EventDetails/JoinEventButton";
import SimilarEvents from "../components/EventDetails/SimilarEvents";
import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/EventDetails.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localEvent, setLocalEvent] = useState(null);

  const { currentEvent, currentEventLoading, currentEventError } = useSelector(
    (state) => state.events
  );

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentEvent());
    };
  }, [eventId, dispatch]);

  // Update local event when current event changes
  useEffect(() => {
    if (currentEvent) {
      setLocalEvent(currentEvent);
    }
  }, [currentEvent]);

  const handleEventUpdate = (updatedEvent) => {
    console.log("EventDetails - Updating event:", {
      currentAttendees: updatedEvent.currentAttendees,
      previousAttendees: localEvent?.currentAttendees,
    });
    setLocalEvent(updatedEvent);
  };

  const eventToDisplay = localEvent || currentEvent;

  if (currentEventLoading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (currentEventError) {
    return (
      <div className="container">
        <div className="alert alert-danger mt-4" role="alert">
          <h4>Error loading event</h4>
          <p>{currentEventError}</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!eventToDisplay) {
    return (
      <div className="container">
        <div className="alert alert-warning mt-4" role="alert">
          <h4>Event not found</h4>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <HeroBanner event={eventToDisplay} />
      <EventTitleSection event={eventToDisplay} />
      <DateTimeSection event={eventToDisplay} />
      <LocationSection event={eventToDisplay} />
      <EventDescription event={eventToDisplay} />
      <JoinEventButton
        event={eventToDisplay}
        onEventUpdate={handleEventUpdate}
      />
      <TagsSection event={eventToDisplay} />
      <SimilarEvents currentEventId={eventId} />
    </div>
  );
};

export default EventDetails;

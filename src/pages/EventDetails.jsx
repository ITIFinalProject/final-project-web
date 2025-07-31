import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById, clearCurrentEvent } from "../redux/slices/eventSlice";
import HeroBanner from "../components/EventDetails/HeroBanner";
import EventTitleSection from "../components/EventDetails/EventTitleSection";
import DateTimeSection from "../components/EventDetails/DateTimeSection";
import LocationSection from "../components/EventDetails/LocationSection";
import HostSection from "../components/EventDetails/HostSection";
import EventDescription from "../components/EventDetails/EventDescription";
import TagsSection from "../components/EventDetails/TagsSection";
import SimilarEvents from "../components/EventDetails/SimilarEvents";
import "bootstrap/dist/css/bootstrap.min.css";

import "../styles/EventDetails.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  if (!currentEvent) {
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
      <HeroBanner event={currentEvent} />
      <EventTitleSection event={currentEvent} />
      <DateTimeSection event={currentEvent} />
      <LocationSection event={currentEvent} />
      {/* <HostSection event={currentEvent} /> */}
      <EventDescription event={currentEvent} />
      <TagsSection event={currentEvent} />
      <SimilarEvents currentEventId={eventId} />
    </div>
  );
};

export default EventDetails;

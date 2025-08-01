import { IoPricetag } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchEvents } from "../../redux/slices/eventSlice";

const SimilarEvents = ({ currentEventId }) => {
  const dispatch = useDispatch();
  const { data: allEvents } = useSelector((state) => state.events);
  const [similarEvents, setSimilarEvents] = useState([]);

  // Fetch events if not already loaded
  useEffect(() => {
    if (!allEvents || allEvents.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, allEvents]);

  useEffect(() => {
    if (allEvents && allEvents.length > 0 && currentEventId) {
      // Filter out current event and get up to 3 similar events
      const otherEvents = allEvents
        .filter((event) => event.id !== currentEventId)
        .slice(0, 3);
      setSimilarEvents(otherEvents);
    }
  }, [allEvents, currentEventId]);

  // const formatDate = (dateString) => {
  //   if (!dateString) return "TBD";
  //   try {
  //     let date;
  //     if (dateString.seconds) {
  //       date = new Date(dateString.seconds * 1000);
  //     } else {
  //       date = new Date(dateString);
  //     }
  //     return date
  //       .toLocaleDateString("en-US", {
  //         month: "short",
  //         day: "numeric",
  //       })
  //       .toUpperCase();
  //   } catch {
  //     return "TBD";
  //   }
  // };

  if (similarEvents.length === 0) {
    return (
      <div className="similar-events-section">
        <div className="container">
          <h3 className="section-title">Other events you may like</h3>
          <p className="text-muted">No other events available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="similar-events-section">
      <div className="container">
        <h3 className="section-title">Other events you may like</h3>
        <div className="events-grid">
          {similarEvents.map((event) => (
            <Link
              to={`/event/${event.id}`}
              key={event.id}
              className="event-card-link"
            >
              <div className="event-card">
                <div className="other-event-image">
                  <img
                    src={event.bannerUrl || event.image || "/no-event.jpg"}
                    alt={event.title}
                    onError={(e) => {
                      e.target.src = "/no-event.jpg";
                    }}
                  />
                  <div className="event-category">
                    {event.category || "Event"}
                  </div>
                </div>
                <div className="event-info">
                  {/* <div className="event-date">{formatDate(event.date)}</div> */}
                  <h4 className="event-title-card">{event.title}</h4>
                  <p className="event-location">
                    {event.location || "Location TBD"}
                  </p>
                  {/* <div className="event-price">
                    <IoPricetag />
                    <span>{event.price || "FREE"}</span>
                  </div> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarEvents;

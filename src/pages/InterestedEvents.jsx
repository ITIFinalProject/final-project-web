import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import { IoArrowBack } from "react-icons/io5";
import { fetchInterestedEvents } from "../redux/slices/interestedSlice";
import "../styles/InterestedEvents.css";
import "bootstrap/dist/css/bootstrap.min.css";

const InterestedEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.auth);

  // Fixed selector to avoid creating new objects on every render
  const interestedEvents = useSelector(
    (state) => state.interested?.events || []
  );
  const interestedLoading = useSelector(
    (state) => state.interested?.loading || false
  );
  const error = useSelector((state) => state.interested?.error || null);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchInterestedEvents(currentUser.uid));
    }
  }, [dispatch, currentUser]);

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  if (!currentUser) {
    return (
      <div className="interested-events-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page-header">
                <button className="back-button" onClick={handleBackClick}>
                  <IoArrowBack className="back-arrow" />
                </button>
                <h1 className="page-header">Interested Events</h1>
              </div>
              <div className="text-center mt-5">
                <p>Please log in to view your interested events.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (interestedLoading) {
    return (
      <div className="interested-events-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page-header">
                <button className="back-button" onClick={handleBackClick}>
                  <IoArrowBack className="back-arrow" />
                </button>
                <h1 className="page-header">Interested Events</h1>
              </div>
              <div className="text-center mt-5">
                <p>Loading your interested events...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interested-events-page">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="page-header">
                <button className="back-button" onClick={handleBackClick}>
                  <IoArrowBack className="back-arrow" />
                </button>
                <h1 className="page-header">Interested Events</h1>
              </div>
              <div className="text-center mt-5">
                <p>Error loading interested events: {error}</p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() =>
                    dispatch(fetchInterestedEvents(currentUser.uid))
                  }
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Remove the mock events array and replace the component logic

  return (
    <div className="interested-events-page">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <button className="back-button" onClick={handleBackClick}>
                <IoArrowBack className="back-arrow" />
              </button>
              <h1 className="page-header">Interested Events</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container">
        <div className="row">
          {interestedEvents.length === 0 ? (
            <div className="col-12 text-center mt-5">
              <img
                src="/no-event.jpg"
                alt="No events found"
                className="no-events-image mb-4"
                style={{ maxWidth: "300px", width: "100%", height: "auto" }}
              />
              <h3 className="mb-3">No Interested Events Yet</h3>
              <p className="text-muted mb-2">
                You haven't added any events to your interested list yet.
              </p>
              <p className="text-muted">
                Start exploring events and click the star icon to add them here!
              </p>
            </div>
          ) : (
            interestedEvents.map((event) => (
              <div
                key={event.id}
                className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4"
              >
                <EventCard event={event} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InterestedEvents;

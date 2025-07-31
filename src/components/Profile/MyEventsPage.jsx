import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { eventService } from "../../services/eventService";
import MyEventCard from "./MyEventCard";

const MyEventsPage = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("created");
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserEvents = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching events for user:", currentUser.uid);

      // First, let's try to get all events to see what's available
      try {
        const allEvents = await eventService.getAllEvents();
        console.log("All events from Firestore:", allEvents);
        console.log("Sample event structure:", allEvents[0]);
      } catch (allError) {
        console.error("Error fetching all events:", allError);
      }

      // Fetch events created by the user using the service
      const createdEventsData = await eventService.getUserCreatedEvents(
        currentUser.uid
      );
      console.log("Created events:", createdEventsData);

      // Fetch events the user has joined using the service
      const joinedEventsData = await eventService.getUserJoinedEvents(
        currentUser.uid
      );
      console.log("Joined events:", joinedEventsData);

      setCreatedEvents(createdEventsData);
      setJoinedEvents(joinedEventsData);
    } catch (err) {
      console.error("Error fetching user events:", err);
      setError(`Failed to fetch events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserEvents();
  }, [fetchUserEvents]);

  const handleDeleteEvent = async (eventId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      try {
        await eventService.deleteEvent(eventId);
        setCreatedEvents((prev) =>
          prev.filter((event) => event.id !== eventId)
        );
        alert("Event deleted successfully!");
      } catch (err) {
        console.error("Error deleting event:", err);
        alert("Failed to delete event");
      }
    }
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  if (loading) {
    return (
      <div className="content-page  ">
        <h2 className="page-title">My Events</h2>
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-page">
        <h2 className="page-title">My Events</h2>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className=" content-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="page-title">My Events</h2>
      </div>

      {/* Tab Navigation */}
      <div className="row my-events-tabs">
        <div className="col-12">
          <div className="d-flex w-100">
            <button
              className={`flex-fill text-center py-3 border-0 my-events-tab-button ${
                activeTab === "created" ? "active" : ""
              }`}
              onClick={() => setActiveTab("created")}
            >
              Created Events ({createdEvents.length})
            </button>
            <button
              className={`flex-fill text-center py-3 border-0 my-events-tab-button ${
                activeTab === "joined" ? "active" : ""
              }`}
              onClick={() => setActiveTab("joined")}
            >
              Joined Events ({joinedEvents.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === "created" && (
            <div>
              {createdEvents.length === 0 ? (
                <div className="text-center my-events-empty-state">
                  <h5 className="my-events-empty-title">
                    No events created yet
                  </h5>
                  <p className="my-events-empty-text">
                    Start creating amazing events for your community!
                  </p>
                  <a href="/CreateEvent" className="my-events-cta-button">
                    Create Your First Event
                  </a>
                </div>
              ) : (
                <div className="d-flex flex-column my-events-list">
                  {createdEvents.map((event) => (
                    <MyEventCard
                      key={event.id}
                      event={event}
                      isOwner={true}
                      onEdit={() => handleEditEvent(event.id)}
                      onDelete={() => handleDeleteEvent(event.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "joined" && (
            <div>
              {joinedEvents.length === 0 ? (
                <div className="text-center my-events-empty-state">
                  <h5 className="my-events-empty-title">
                    No events joined yet
                  </h5>
                  <p className="my-events-empty-text">
                    Explore events and join the ones that interest you!
                  </p>
                  <a href="/events" className="my-events-cta-button">
                    Browse Events
                  </a>
                </div>
              ) : (
                <div className="d-flex flex-column my-events-list">
                  {joinedEvents.map((event) => (
                    <MyEventCard key={event.id} event={event} isOwner={false} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;

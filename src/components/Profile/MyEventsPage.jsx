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

  // Pagination states
  const [createdEventsPage, setCreatedEventsPage] = useState(1);
  const [joinedEventsPage, setJoinedEventsPage] = useState(1);
  const eventsPerPage = 2;

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
        setCreatedEvents((prev) => {
          const newEvents = prev.filter((event) => event.id !== eventId);
          // Adjust pagination if needed
          const totalPages = Math.ceil(newEvents.length / eventsPerPage);
          if (createdEventsPage > totalPages && totalPages > 0) {
            setCreatedEventsPage(totalPages);
          }
          return newEvents;
        });
        alert("Event deleted successfully!");
      } catch (err) {
        console.error("Error deleting event:", err);
        alert("Failed to delete event");
      }
    }
  };

  // Check if an event is outdated (past)
  const isEventOutdated = (event) => {
    if (!event) return false;

    try {
      let eventDate;
      const dateToCheck = event.startDate || event.date;

      if (!dateToCheck) return false;

      // Handle different timestamp formats
      if (typeof dateToCheck === "string" && dateToCheck.includes(" _ ")) {
        // Extract the start date from the range
        eventDate = dateToCheck.split(" _ ")[0].trim();
      } else {
        eventDate = dateToCheck;
      }

      let date;
      if (eventDate.toDate) {
        // Firestore Timestamp
        date = eventDate.toDate();
      } else if (eventDate instanceof Date) {
        date = eventDate;
      } else if (typeof eventDate === "string") {
        // String date
        date = new Date(eventDate);
      } else if (typeof eventDate === "object" && eventDate.seconds) {
        // Firestore timestamp object with seconds
        date = new Date(eventDate.seconds * 1000);
      } else {
        // Number timestamp
        date = new Date(eventDate);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return false;
      }

      // Compare with current date (only date, not time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      return date < today;
    } catch (error) {
      console.error("Error checking if event is outdated:", error);
      return false;
    }
  };

  const handleEditEvent = (eventId) => {
    const event = createdEvents.find((e) => e.id === eventId);
    if (isEventOutdated(event)) {
      alert(
        "Cannot edit outdated events. Only current and future events can be edited."
      );
      return;
    }
    navigate(`/edit-event/${eventId}`);
  };

  const handleLeaveEvent = async (eventId) => {
    if (
      window.confirm(
        "Are you sure you want to leave this event? You won't receive updates about this event anymore."
      )
    ) {
      try {
        await eventService.leaveEvent(currentUser.uid, eventId);
        setJoinedEvents((prev) => {
          const newEvents = prev.filter((event) => event.id !== eventId);
          // Adjust pagination if needed
          const totalPages = Math.ceil(newEvents.length / eventsPerPage);
          if (joinedEventsPage > totalPages && totalPages > 0) {
            setJoinedEventsPage(totalPages);
          }
          return newEvents;
        });
        alert("You have successfully left the event!");
      } catch (err) {
        console.error("Error leaving event:", err);
        alert("Failed to leave event: " + err.message);
      }
    }
  };

  // Pagination logic
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset to page 1 when switching tabs
    setCreatedEventsPage(1);
    setJoinedEventsPage(1);
  };

  // Get current events for pagination
  const getCurrentEvents = () => {
    const events = activeTab === "created" ? createdEvents : joinedEvents;
    const currentPage =
      activeTab === "created" ? createdEventsPage : joinedEventsPage;
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return events.slice(startIndex, endIndex);
  };

  // Get total pages
  const getTotalPages = () => {
    const events = activeTab === "created" ? createdEvents : joinedEvents;
    return Math.ceil(events.length / eventsPerPage);
  };

  // Get current page
  const getCurrentPage = () => {
    return activeTab === "created" ? createdEventsPage : joinedEventsPage;
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (activeTab === "created") {
      setCreatedEventsPage(page);
    } else {
      setJoinedEventsPage(page);
    }
  };

  // Pagination component
  const PaginationControls = () => {
    const totalPages = getTotalPages();
    const currentPage = getCurrentPage();

    if (totalPages <= 1) return null;

    return (
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <li
                key={page}
                className={`page-item ${currentPage === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            );
          })}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
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
              onClick={() => handleTabChange("created")}
            >
              Created Events ({createdEvents.length})
            </button>
            <button
              className={`flex-fill text-center py-3 border-0 my-events-tab-button ${
                activeTab === "joined" ? "active" : ""
              }`}
              onClick={() => handleTabChange("joined")}
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
                <div>
                  <div className="d-flex flex-column my-events-list">
                    {getCurrentEvents().map((event) => (
                      <MyEventCard
                        key={event.id}
                        event={event}
                        isOwner={true}
                        isOutdated={isEventOutdated(event)}
                        onEdit={() => handleEditEvent(event.id)}
                        onDelete={() => handleDeleteEvent(event.id)}
                      />
                    ))}
                  </div>
                  <PaginationControls />
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
                <div>
                  <div className="d-flex flex-column my-events-list">
                    {getCurrentEvents().map((event) => (
                      <MyEventCard
                        key={event.id}
                        event={event}
                        isOwner={false}
                        onLeave={() => handleLeaveEvent(event.id)}
                      />
                    ))}
                  </div>
                  <PaginationControls />
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

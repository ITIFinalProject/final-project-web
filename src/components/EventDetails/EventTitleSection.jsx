import { IoStar, IoFlag } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addInterestedEvent,
  removeInterestedEvent,
  isEventInterested,
} from "../../services/interestedEventsService";
import ReportModal from "./ReportModal";

const EventTitleSection = ({ event }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);

  // Check if event is already bookmarked when component mounts
  useEffect(() => {
    const checkInterestedStatus = async () => {
      if (currentUser && event?.id) {
        try {
          const interested = await isEventInterested(currentUser.uid, event.id);
          setIsBookmarked(interested);
        } catch (error) {
          console.error("Error checking interested status:", error);
        }
      }
    };

    checkInterestedStatus();
  }, [currentUser, event?.id]);

  const handleBookmark = async () => {
    if (!currentUser) {
      alert("Please log in to add events to your interested list!");
      return;
    }

    if (!event?.id) {
      alert("Event information is not available!");
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        // Remove from interested events
        await removeInterestedEvent(currentUser.uid, event.id);
        setIsBookmarked(false);
        // You can add a toast notification here instead of alert
      } else {
        // Add to interested events
        await addInterestedEvent(currentUser.uid, event.id, {
          title: event.title,
          date: event.date,
          location: event.location,
          bannerUrl: event.bannerUrl,
        });
        setIsBookmarked(true);
        // You can add a toast notification here instead of alert
      }
    } catch (error) {
      console.error("Error managing interested event:", error);
      alert(error.message || "Failed to update interested events");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    if (!currentUser) {
      alert("Please log in to report events!");
      return;
    }
    setIsReportModalOpen(true);
  };

  // const handleShare = () => {
  //   if (navigator.share) {
  //     navigator.share({
  //       title: event?.title || "Event",
  //       text: event?.description || "Check out this event!",
  //       url: window.location.href,
  //     });
  //   } else {
  //     // Fallback: copy to clipboard
  //     navigator.clipboard.writeText(window.location.href);
  //     alert("Event link copied to clipboard!");
  //   }
  // };

  return (
    <div className="det-event-title-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="det-event-title">{event?.title || "Event Title"}</h1>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="det-action-buttons">
              <button
                className={`det-action-btn ${isBookmarked ? "bookmarked" : ""}`}
                onClick={handleBookmark}
                disabled={loading}
                title={
                  isBookmarked
                    ? "Remove from interested events"
                    : "Add to interested events"
                }
              >
                {loading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <IoStar />
                )}
              </button>
              {/* Only show report button if user is logged in, user is not the event host and event is not outdated */}
              {currentUser && currentUser.uid !== event?.hostId && (
                <button
                  className="det-action-btn"
                  onClick={handleReport}
                  title="Report event"
                >
                  <IoFlag />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        event={event}
      />
    </div>
  );
};

export default EventTitleSection;

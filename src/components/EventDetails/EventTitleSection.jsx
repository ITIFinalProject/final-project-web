import { IoStar, IoShareSocial } from "react-icons/io5";
import { useState } from "react";

const EventTitleSection = ({ event }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Add bookmark functionality here
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title || "Event",
        text: event?.description || "Check out this event!",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Event link copied to clipboard!");
    }
  };

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
                title="Bookmark event"
              >
                <IoStar />
              </button>
              <button
                className="det-action-btn"
                onClick={handleShare}
                title="Share event"
              >
                <IoShareSocial />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTitleSection;

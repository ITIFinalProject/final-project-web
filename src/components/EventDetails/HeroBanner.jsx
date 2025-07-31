import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HeroBanner = ({ event }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="hero-banner">
      {event?.bannerUrl || event?.image ? (
        <img
          src={event.bannerUrl || event.image || "/no-event.jpg"}
          alt={event.title || "Event Banner"}
          className="hero-banner-image"
        />
      ) : (
        <div className="placeholder-banner d-flex align-items-center justify-content-center">
          <h2 className="text-muted">Event Banner</h2>
        </div>
      )}
      <button className="back-btn" onClick={handleBackClick}>
        <IoChevronBack />
      </button>
    </div>
  );
};

export default HeroBanner;

import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import defaultBanner from "../../assets/images/banner.png";

const HeroBanner = ({ event }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="hero-banner">
      {event?.bannerUrl || event?.image ? (
        <img
          src={event.bannerUrl || event.image}
          alt={event.title || "Event Banner"}
          className="hero-banner-image"
        />
      ) : (
        <div className="placeholder-banner d-flex align-items-center justify-content-center">
          <img
            src={defaultBanner}
            alt={event.title || "Event Banner"}
            className="hero-banner-image"
          />
        </div>
      )}
      <button className="det-back-btn" onClick={handleBackClick}>
        <IoChevronBack />
      </button>
    </div>
  );
};

export default HeroBanner;

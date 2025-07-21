import { IoChevronBack } from "react-icons/io5";

const HeroBanner = () => {
  return (
    <div className="hero-banner">
      <button className="back-btn">
        <IoChevronBack />
      </button>
      <div className="hero-content">
        <h1 className="hero-title">The Sound Of Christmas</h1>
        <p className="hero-subtitle">A LIVE CHRISTMAS CONCERT</p>
        <div className="hero-date">2nd December</div>
        <div className="hero-location">
          Balgandharva Rang Mandir, Bandra West
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

import { IoLocationSharp } from "react-icons/io5";

const LocationSection = () => {
  return (
    <div className="location-section">
      <div className="container">
        <h3 className="section-title">Location</h3>
        <div className="location-info">
          <IoLocationSharp />
          <div className="location-text">
            <div>Bal Gandharva Rang Mandir, Near Junction Of</div>
            <div>24th & 32nd Road & Patwardhan Park Off</div>
            <div>Linking Road, Bandra West, Mumbai, India</div>
          </div>
        </div>
        <div className="map-placeholder">
          <IoLocationSharp />
          <div>Interactive Map</div>
          <div>Balgandharva Rang Mandir</div>
        </div>
      </div>
    </div>
  );
};
export default LocationSection;

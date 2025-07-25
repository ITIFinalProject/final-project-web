import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

const Preview = ({ onBack }) => {
  return (
    <div className="preview-container">
      <div className="preview-header">
        <h2 className="preview-title">Event Title</h2>
        <p className="preview-sub">Location</p>
        <p className="preview-sub">Time</p>

        <p className="check-message">Nearly there! Check everything's correct.</p>
      </div>

      <div className="event-preview-box">
        <div className="event-image-placeholder"></div>

        <div className="event-details">
          <h3 className="event-title">Event Title</h3>

          <div className="event-meta">
            <div className="meta-block">
              <h4>Date and Time</h4>
              <p><FaCalendarAlt className="icon" /> Day, Date</p>
              <p><FaClock className="icon" /> Time</p>
              <a href="#" className="add-calendar">+ Add to Calendar</a>
            </div>

            <div className="meta-block">
              <h4>Ticket Information</h4>
              <p><FaTicketAlt className="icon" /> Ticket Type: Price /ticket</p>
            </div>
          </div>

          <div className="create-location">
            <h4>Location</h4>
            <p><FaMapMarkerAlt className="icon" /> Address</p>
            <div className="map-placeholder"></div>
          </div>

          <div className="host-section">
            <h4>Hosted by</h4>
            <div className="host-info">
              <div className="host-avatar"></div>
              <div className="host-meta">
                <p className="host-name">Host Name</p>
                <div className="host-actions">
                  <button className="btn-outline">Contact</button>
                  <button className="btn-filled">+ Follow</button>
                </div>
              </div>
            </div>
          </div>

          <div className="description">
            <h4>Event Description</h4>
            <p>
              Lorem ipsum dolor sit amet consectetur. Eget vulputate sociis sit urna sit aliquet. Vivamus facilisis diam libero dolor volutpat diam eu. Quis a id posuere etiam at enim vivamus. [...] Tellus in et sed mattis morbi velit massa donec.
            </p>
          </div>
        </div>
      </div>

      <div className="preview-actions">
        <button onClick={onBack} className="back-btn">Back</button>
        <button className="save-btn">Publish Event</button>
      </div>
    </div>
  );
};

export default Preview;

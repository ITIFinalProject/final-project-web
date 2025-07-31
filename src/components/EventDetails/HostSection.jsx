import { IoPerson, IoChatbubbles } from "react-icons/io5";

const HostSection = ({ event }) => {
  return (
    <div className="det-host-section">
      <div className="container">
        <div className="det-host-container">
          {/* Host Information */}
          <div className="host-info-card">
            <h3 className="section-title">Hosted by</h3>
            <div className="host-info">
              <div className="host-avatar">
                {event?.hostAvatar ? (
                  <img src={event.hostAvatar} alt="Host Avatar" />
                ) : (
                  <IoPerson />
                )}
              </div>
              <h5 className="host-name">{event?.hostName || "Unknown Host"}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HostSection;

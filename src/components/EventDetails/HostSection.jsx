import { IoPerson, IoChatbubbles } from "react-icons/io5";

const HostSection = ({ event }) => {
  const handleContactHost = () => {
    // Add contact functionality here
    console.log("Contact host:", event?.hostName || "Unknown Host");
  };

  const handleFollowHost = () => {
    // Add follow functionality here
    console.log("Follow host:", event?.hostName || "Unknown Host");
  };

  const handleJoinChat = () => {
    // Add chat functionality here
    console.log("Join chat for event:", event?.title);
  };

  return (
    <div className="host-section">
      <div className="container">
        <div className="host-container">
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
              <div className="host-actions">
                <button className="contact-btn" onClick={handleContactHost}>
                  Contact
                </button>
                <button className="follow-btn" onClick={handleFollowHost}>
                  + Follow
                </button>
              </div>
            </div>
          </div>

          {/* Chat Group Section */}
          <div className="chat-group-card">
            <h3 className="section-title">Event Chat</h3>
            <div className="chat-group-info">
              <div className="chat-icon">
                <IoChatbubbles />
              </div>
              <div className="chat-details">
                <h6 className="chat-title">Join Event Discussion</h6>
                <p className="chat-description">
                  Connect with other attendees, ask questions, and share your
                  excitement about the event!
                </p>
                <div className="chat-stats">
                  <span className="online-count">
                    {event?.attendeesCount
                      ? `${event.attendeesCount} members`
                      : "Join the discussion"}
                  </span>
                </div>
              </div>
            </div>
            <button className="join-chat-btn" onClick={handleJoinChat}>
              <IoChatbubbles />
              Join Chat Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HostSection;

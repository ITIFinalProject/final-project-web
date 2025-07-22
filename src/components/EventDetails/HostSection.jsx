import { IoPerson, IoChatbubbles } from "react-icons/io5";

const HostSection = () => {
  return (
    <div className="host-section">
      <div className="container">
        <div className="host-container">
          {/* Host Information */}
          <div className="host-info-card">
            <h3 className="section-title">Hosted by</h3>
            <div className="host-info">
              <div className="host-avatar">
                <IoPerson />
              </div>
              <h5 className="host-name">City Youth Movement</h5>
              <div className="host-actions">
                <a href="#" className="contact-btn">
                  Contact
                </a>
                <a href="#" className="follow-btn">
                  + Follow
                </a>
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
                  <span className="online-count">42 members online</span>
                </div>
              </div>
            </div>
            <button className="join-chat-btn">
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

import { IoPerson } from "react-icons/io5";

const HostSection = () => {
  return (
    <div className="host-section">
      <div className="container">
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
    </div>
  );
};
export default HostSection;

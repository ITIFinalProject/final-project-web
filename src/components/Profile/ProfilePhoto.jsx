import { FaUser, FaCamera } from "react-icons/fa";

const ProfilePhoto = () => (
  <div className="user-photo-section">
    <h4 className="section-title">User Photo</h4>
    <div className="user-photo-container">
      <div className="user-photo">
        <div className="user-avatar">
          <FaUser />
        </div>
        <div className="camera-icon">
          <FaCamera />
        </div>
      </div>
    </div>
  </div>
);

export default ProfilePhoto;

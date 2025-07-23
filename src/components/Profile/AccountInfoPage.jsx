import ProfilePhoto from "./ProfilePhoto";

const AccountInfoPage = () => (
  <div className="content-page">
    <h2 className="page-title">Account Information</h2>

    <ProfilePhoto />

    <div className="profile-information-section">
      <h4 className="section-title">Profile Information</h4>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter first name"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter last name"
          />
        </div>
      </div>
    </div>

    <div className="contact-details-section">
      <h4 className="section-title">Contact Details</h4>
      <p className="section-subtitle">
        These details are private and only used to contact you for ticketing or
        prizes.
      </p>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Phone Number:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter phone number"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Address:</label>
          <textarea
            className="form-control"
            rows="1"
            placeholder="Enter address"
          ></textarea>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">City/Town:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Country:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter country"
          />
        </div>
      </div>
    </div>

    <div className="action-buttons">
      <button className="confirm-btn">Save My Profile</button>
    </div>
  </div>
);

export default AccountInfoPage;

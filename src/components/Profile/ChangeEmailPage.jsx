const ChangeEmailPage = () => (
  <div className="content-page">
    <h2 className="page-title">Change Email</h2>

    <div className="email-form-section">
      <div className="current-email">
        <span className="current-email-label">Current Email:</span>
        <span className="current-email-value">andreagomes@example.com</span>
      </div>

      <div className="row">
        <div className="col-md-8  mx-auto">
          <div className="mb-4">
            <label className="form-label">New Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter new email"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Email:</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter again"
            />
          </div>
        </div>
      </div>
    </div>

    <div className="action-buttons">
      <button className="confirm-btn">Save New Email</button>
    </div>
  </div>
);

export default ChangeEmailPage;

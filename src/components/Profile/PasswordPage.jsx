const PasswordPage = () => {
  return (
    <div className="content-page">
      <h3 className="page-title">Set Password</h3>
      <div className="row">
        <div className="col-md-8  mx-auto">
          <div className="mb-4">
            <label className="form-label">New Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter again"
            />
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="confirm-btn">Save New Password</button>
      </div>
    </div>
  );
};
export default PasswordPage;

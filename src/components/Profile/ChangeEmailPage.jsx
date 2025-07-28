import PasswordPage from "./PasswordPage";
const ChangeEmailPage = () => (
  <div className="content-page">
    <h2 className="page-title">Current Email</h2>
    <div className="email-form-section">
      <div className="current-email">
        <span className="current-email-label">Current Email:</span>
        <span className="current-email-value">andreagomes@example.com</span>
      </div>
      <PasswordPage />
    </div>
  </div>
);

export default ChangeEmailPage;

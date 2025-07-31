import { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserPassword } from "../../services/authService";

const EmailPasswordPage = () => {
  const { currentUser, userData } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Check if user signed in with Google
  const isGoogleUser = currentUser?.providerData?.some(
    (provider) => provider.providerId === "google.com"
  );

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    return errors;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      const errors = validatePassword(newPassword);
      setPasswordErrors(errors);
    } else {
      setPasswordErrors([]);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Enhanced password validation
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      alert("Password validation failed:\n" + passwordErrors.join("\n"));
      return;
    }

    if (!currentUser) {
      alert("No user is currently signed in");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await updateUserPassword(password);

      if (error) {
        alert("Error updating password: " + error);
      } else {
        setPassword("");
        setConfirmPassword("");
        alert("Password updated successfully!");
      }
    } catch (error) {
      alert("Error updating password: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="content-page">
      <h2 className="page-title">Email & Password</h2>

      {/* Email Section - Read Only */}
      <div className="email-section">
        <h4 className="section-subtitle">Email Address</h4>
        <div className="current-email">
          <span className="current-email-label">Current Email:</span>
          <span className="current-email-value">
            {userData?.email || currentUser?.email || "No email"}
          </span>
        </div>
        <small className="text-muted">Email address cannot be changed.</small>
      </div>

      {/* Password Section - Editable */}
      <div className="password-section">
        <h4 className="section-subtitle">Change Password</h4>

        {isGoogleUser ? (
          <div className="google-user-notice">
            <div className="notice-content">
              <span className="notice-icon">🔒</span>
              <div className="notice-text">
                <p className="notice-title">Password Change Not Available</p>
                <p className="notice-description">
                  You signed in using Google authentication. Your password is
                  managed by Google and cannot be changed here. To update your
                  password, please visit your Google account settings.
                </p>
                <a
                  href="https://myaccount.google.com/security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="google-account-link"
                >
                  Manage Google Account Security
                </a>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div className="row">
              <div className="col-md-8 mx-auto">
                <div className="mb-4">
                  <label className="form-label">New Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                  <small className="text-muted">
                    Password must contain at least 6 characters, including one
                    uppercase letter, one lowercase letter, and one number
                  </small>
                  {passwordErrors.length > 0 && (
                    <div className="password-validation mt-2">
                      {passwordErrors.map((error, index) => (
                        <div key={index} className="validation-error">
                          ❌ {error}
                        </div>
                      ))}
                    </div>
                  )}
                  {password && passwordErrors.length === 0 && (
                    <div className="validation-success mt-2">
                      ✅ Password meets all requirements
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button type="submit" className="confirm-btn" disabled={isSaving}>
                {isSaving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EmailPasswordPage;

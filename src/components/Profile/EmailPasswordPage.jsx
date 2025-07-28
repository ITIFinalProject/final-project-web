import { useState } from "react";
import { useSelector } from "react-redux";
import { updateUserPassword } from "../../services/authService";

const EmailPasswordPage = () => {
  const { currentUser, userData } = useSelector((state) => state.auth);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
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
        <h4 className="section-title">Email Address</h4>
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
        <h4 className="section-title">Change Password</h4>
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                />
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
      </div>
    </div>
  );
};

export default EmailPasswordPage;

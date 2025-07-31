import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProfilePhoto from "./ProfilePhoto";
import { updateUserData } from "../../services/authService";
import { setAuthState } from "../../redux/slices/authSlice";

const AccountInfoPage = () => {
  const dispatch = useDispatch();
  const { currentUser, userData, loading } = useSelector((state) => state.auth);

  // Form state for profile information only (name, phone, address)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsSaving(true);
    try {
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: userData.email, // Keep existing email
        uid: userData.uid, // Keep existing uid
        createdAt: userData.createdAt, // Keep existing createdAt
      };

      const { error } = await updateUserData(currentUser.uid, updatedData);

      if (error) {
        alert("Error updating profile: " + error);
      } else {
        // Update Redux state with new data
        dispatch(
          setAuthState({
            currentUser,
            userData: updatedData,
            loading: false,
          })
        );
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original userData
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="content-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <h2 className="page-title">Account Information</h2>

      <ProfilePhoto />

      <div className="profile-information-section">
        <div className="section-header">
          <h4 className="section-subtitle">Profile Information</h4>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Phone Number:</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-12 mb-3">
            <label className="form-label">Address:</label>
            <textarea
              name="address"
              className="form-control"
              rows="3"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        {isEditing ? (
          <>
            <button
              className="confirm-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="confirm-btn" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountInfoPage;

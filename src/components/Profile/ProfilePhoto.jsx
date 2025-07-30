import { FaUser, FaCamera } from "react-icons/fa";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadProfileImage } from "../../services/profileImageService";
import { updateUserProfileImage } from "../../services/authService";
import { setAuthState } from "../../redux/slices/authSlice";

const ProfilePhoto = () => {
  const dispatch = useDispatch();
  const { currentUser, userData } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);
    setError("");

    try {
      // Upload image to Supabase
      const { url, error: uploadError } = await uploadProfileImage(
        file,
        currentUser.uid
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      // Update user profile image URL in Firebase
      const { error: updateError } = await updateUserProfileImage(
        currentUser.uid,
        url
      );

      if (updateError) {
        throw new Error(updateError);
      }

      // Update Redux state
      dispatch(
        setAuthState({
          currentUser,
          userData: {
            ...userData,
            profileImageUrl: url,
            updatedAt: new Date().toISOString(),
          },
          loading: false,
        })
      );
    } catch (err) {
      console.error("Error uploading profile image:", err);
      setError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="user-photo-section">
      <h4 className="section-title">User Photo</h4>
      <div className="user-photo-container">
        <div className="user-photo">
          <div className="user-avatar" onClick={handleImageClick}>
            {userData?.profileImageUrl ? (
              <img
                src={userData.profileImageUrl}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ) : (
              <FaUser style={{ cursor: "pointer" }} />
            )}
          </div>
          <div
            className="camera-icon"
            onClick={handleImageClick}
            title="Change profile photo"
          >
            {uploading ? <div className="spinner" /> : <FaCamera />}
          </div>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            color: "#dc3545",
            fontSize: "0.875rem",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ProfilePhoto;

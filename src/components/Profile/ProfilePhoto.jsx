import { FaUser, FaCamera } from "react-icons/fa";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uploadProfileImage } from "../../services/profileImageService";
import {
  updateUserProfileImage,
  getUserData,
} from "../../services/authService";
import { setAuthState } from "../../redux/slices/authSlice";

const ProfilePhoto = () => {
  const dispatch = useDispatch();
  const { currentUser, userData } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Debug: Log userData changes
  console.log("ProfilePhoto - Current userData:", userData);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !currentUser) return;

    setUploading(true);
    setError("");

    try {
      console.log("Starting image upload process...");

      // Upload image to Supabase
      const { url, error: uploadError } = await uploadProfileImage(
        file,
        currentUser.uid
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      console.log("Image uploaded successfully, URL:", url);

      // Update user profile image URL in Firebase
      const { error: updateError } = await updateUserProfileImage(
        currentUser.uid,
        url
      );

      if (updateError) {
        throw new Error(updateError);
      }

      console.log("Firestore updated successfully");

      // Fetch updated user data from Firestore
      const { userData: updatedUserData, error: fetchError } =
        await getUserData(currentUser.uid);

      if (fetchError) {
        throw new Error(fetchError);
      }

      console.log("Updated user data from Firestore:", updatedUserData);

      // Update Redux state with fresh data from Firestore
      dispatch(
        setAuthState({
          currentUser,
          userData: updatedUserData,
          loading: false,
        })
      );

      console.log("Redux state updated successfully");
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
      <h4 className="section-subtitle">User Photo</h4>
      <div className="user-photo-container">
        <div className="user-photo">
          <div className="user-avatar" onClick={handleImageClick}>
            {userData?.imagePath ? (
              <img
                src={userData.imagePath}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              <FaUser className="fa-user" />
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

      {error && <div className="error-message">{error}</div>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden-file-input"
      />
    </div>
  );
};

export default ProfilePhoto;

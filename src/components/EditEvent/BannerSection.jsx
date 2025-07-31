import React from "react";
import { IoImageOutline } from "react-icons/io5";

const BannerSection = ({ eventData, onImageUpload, imageUploading }) => {
  return (
    <div className="edit-form-section">
      <h3 className="edit-section-title">
        <IoImageOutline className="edit-section-icon" />
        Event Banner
      </h3>

      <div className="edit-form-group">
        <label htmlFor="bannerImage" className="edit-form-label">
          Event Banner Image
        </label>
        <div className="edit-file-input">
          <input
            type="file"
            id="bannerImage"
            name="bannerImage"
            accept="image/*"
            onChange={onImageUpload}
            disabled={imageUploading}
          />
          <label htmlFor="bannerImage" className="edit-file-label">
            <IoImageOutline className="edit-file-icon" />
            Choose an image file (JPEG, PNG, WebP)
          </label>
        </div>
        <div className="edit-form-help">
          Max size: 10MB. Recommended size: 1200x600px for best results.
        </div>

        {imageUploading && (
          <div className="edit-upload-progress">
            <div className="edit-upload-spinner"></div>
            <span>Uploading image...</span>
          </div>
        )}

        {eventData.bannerUrl && (
          <div className="edit-image-preview">
            <img
              src={eventData.bannerUrl}
              alt="Event banner preview"
              className="edit-preview-image"
            />
            <div className="edit-image-status edit-image-success">
              ✓ Current banner image
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerSection;

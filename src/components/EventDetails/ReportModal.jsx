import React, { useState } from "react";
import { IoClose, IoWarning, IoImageOutline, IoTrash } from "react-icons/io5";
import { useSelector } from "react-redux";
import { reportService, REPORT_REASONS } from "../../services/reportService";
import "../../styles/ReportModal.css";

const ReportModal = ({ isOpen, onClose, event }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceImage, setEvidenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { currentUser } = useSelector((state) => state.auth);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      // Check file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!validTypes.includes(file.type)) {
        alert("Please upload only image files (JPEG, PNG, WebP, or GIF)");
        return;
      }

      setEvidenceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEvidenceImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedReason) {
      alert("Please select a reason for reporting");
      return;
    }

    if (selectedReason === "other" && !customReason.trim()) {
      alert("Please provide a custom reason");
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        eventId: event.id,
        eventTitle: event.title,
        eventHostId: event.hostId,
        eventHostName: event.hostName || event.host?.name || "Unknown Host",
        reporterId: currentUser.uid,
        reporterName: currentUser.displayName || currentUser.email,
        reason: selectedReason,
        customReason: selectedReason === "other" ? customReason : null,
        description: description.trim() || null,
      };

      await reportService.createReport(reportData, evidenceImage);

      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert(error.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;

    // Reset form
    setSelectedReason("");
    setCustomReason("");
    setDescription("");
    setEvidenceImage(null);
    setImagePreview(null);
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="report-modal-overlay" onClick={handleClose}>
        <div
          className="report-modal-content modal-success"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-success-message">
            <IoWarning className="modal-success-icon" />
            <h3>Report Submitted Successfully</h3>
            <p>
              Thank you for your report. We'll review it and take appropriate
              action.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-modal-overlay" onClick={handleClose}>
      <div
        className="report-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Report Event</h2>
          <button
            className="report-modal-close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <IoClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-event-info">
            <h4>Reporting: {event?.title}</h4>
            <p className="modal-text-muted">
              Please help us understand why you're reporting this event
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-form-group">
              <label className="modal-form-label">Reason for reporting *</label>
              <div className="modal-reasons-grid">
                {REPORT_REASONS.map((reason) => (
                  <div key={reason.id} className="modal-reason-card">
                    <input
                      type="radio"
                      id={reason.id}
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      disabled={isSubmitting}
                    />
                    <label htmlFor={reason.id}>
                      <div className="modal-reason-title">{reason.label}</div>
                      <div className="modal-reason-description">
                        {reason.description}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {selectedReason === "other" && (
              <div className="modal-form-group">
                <label htmlFor="customReason" className="modal-form-label">
                  Please specify the reason *
                </label>
                <input
                  type="text"
                  id="customReason"
                  className="modal-form-control"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Enter your reason..."
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </div>
            )}

            <div className="modal-form-group">
              <label htmlFor="description" className="modal-form-label">
                Additional details (optional)
              </label>
              <textarea
                id="description"
                className="modal-form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional context or details..."
                disabled={isSubmitting}
                maxLength={1000}
              />
            </div>

            <div className="modal-form-group">
              <label className="modal-form-label">Evidence (optional)</label>
              <div className="modal-image-upload-section">
                {!imagePreview ? (
                  <label className="modal-image-upload-btn">
                    <IoImageOutline />
                    <span>Upload screenshot or image evidence</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                      style={{ display: "none" }}
                    />
                  </label>
                ) : (
                  <div className="modal-image-preview">
                    <img src={imagePreview} alt="Evidence preview" />
                    <button
                      type="button"
                      className="modal-remove-image-btn"
                      onClick={removeImage}
                      disabled={isSubmitting}
                    >
                      <IoTrash />
                    </button>
                  </div>
                )}
                <small className="modal-text-muted">
                  Max file size: 5MB. Supported formats: JPEG, PNG, WebP, GIF
                </small>
              </div>
            </div>

            <div className="modal-form-actions">
              <button
                type="button"
                className="modal-btn modal-btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="modal-btn modal-btn-danger"
                disabled={isSubmitting || !selectedReason}
              >
                {isSubmitting ? (
                  <>
                    <div className="modal-spinner-border modal-spinner-border-sm modal-me-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

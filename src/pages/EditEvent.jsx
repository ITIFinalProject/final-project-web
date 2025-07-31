import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { eventService } from "../services/eventService";
import { uploadEventImage } from "../services/eventImageService";
import "../styles/createEvent.css";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endTime: "",
    type: "",
    bannerUrl: "",
    category: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const event = await eventService.getEventById(eventId);

        // Check if current user is the owner
        if (event.hostId !== currentUser?.uid) {
          setError("You don't have permission to edit this event");
          return;
        }

        // Format the date and time for input fields
        let formattedStartDate = "";
        let formattedStartTime = "";
        let formattedEndTime = "";

        // Handle startDate (could be 'startDate' or 'date')
        const dateField = event.startDate || event.date;
        if (dateField) {
          const date = dateField.toDate
            ? dateField.toDate()
            : new Date(dateField);
          formattedStartDate = date.toISOString().split("T")[0];
        }

        // Handle startTime and endTime
        if (event.startTime) {
          const time = event.startTime.toDate
            ? event.startTime.toDate()
            : new Date(event.startTime);
          formattedStartTime = time
            .toTimeString()
            .split(" ")[0]
            .substring(0, 5);
        } else if (
          event.time &&
          typeof event.time === "string" &&
          event.time.includes(" - ")
        ) {
          // Handle legacy format "HH:MM - HH:MM"
          const [start, end] = event.time.split(" - ");
          formattedStartTime = start;
          formattedEndTime = end;
        }

        if (event.endTime) {
          const time = event.endTime.toDate
            ? event.endTime.toDate()
            : new Date(event.endTime);
          formattedEndTime = time.toTimeString().split(" ")[0].substring(0, 5);
        }

        setEventData({
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          startDate: formattedStartDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          capacity: event.capacity || "",
          bannerUrl: event.bannerUrl || "",
          category: event.category || "",
          type: event.type || "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const result = await uploadEventImage(file, eventId || "temp");

      if (result.error) {
        alert(`Image upload failed: ${result.error}`);
        return;
      }

      setEventData((prev) => ({
        ...prev,
        bannerUrl: result.url,
      }));

      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Prepare the updated data
      const updatedData = {
        ...eventData,
        capacity: eventData.capacity ? parseInt(eventData.capacity) : null,
      };

      await eventService.updateEvent(eventId, updatedData);
      alert("Event updated successfully!");
      navigate("/profile", { state: { activeSection: "my-events" } });
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile", { state: { activeSection: "my-events" } });
  };

  if (loading) {
    return (
      <div className="create-event-page">
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-event-page">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="create-event-page">
      <h2>Edit Event</h2>

      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-section">
          <h3>Event Details</h3>

          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="form-control"
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="startTime">Start Time *</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleInputChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Maximum Attendees</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={eventData.capacity}
              onChange={handleInputChange}
              min="1"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={eventData.category}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select a category</option>
              <option value="entertainment">Entertainment</option>
              <option value="educational-business">
                Educational & Business
              </option>
              <option value="cultural-arts">Cultural & Arts</option>
              <option value="sports-fitness">Sports & Fitness</option>
              <option value="technology-innovation">
                Technology & Innovation
              </option>
              <option value="travel-adventure">Travel & Adventure</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Event Type</label>
            <select
              id="type"
              name="type"
              value={eventData.type}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Select event type</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="bannerImage">Event Banner Image</label>
            <input
              type="file"
              id="bannerImage"
              name="bannerImage"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-control"
              disabled={imageUploading}
            />
            <small className="form-text text-muted">
              Choose an image file (JPEG, PNG, WebP). Max size: 10MB
            </small>
            {imageUploading && (
              <div className="mt-2">
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                >
                  <span className="visually-hidden">Uploading...</span>
                </div>
                <small>Uploading image...</small>
              </div>
            )}
            {eventData.bannerUrl && (
              <div className="mt-2">
                <img
                  src={eventData.bannerUrl}
                  alt="Event banner preview"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                  className="img-thumbnail"
                />
                <div className="mt-1">
                  <small className="text-success">✓ Current banner image</small>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Update Event"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditEvent;

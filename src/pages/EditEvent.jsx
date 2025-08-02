import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEditEvent } from "../hooks/useEditEvent";
import EventDetailsSection from "../components/EditEvent/EventDetailsSection";
import DateTimeSection from "../components/EditEvent/DateTimeSection";
import BannerSection from "../components/EditEvent/BannerSection";
import LoadingState from "../components/EditEvent/LoadingState";
import ErrorState from "../components/EditEvent/ErrorState";
import FormActions from "../components/EditEvent/FormActions";
import "../styles/EditEvent.css";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);

  const {
    loading,
    saving,
    imageUploading,
    error,
    eventData,
    guestSearch,
    filteredGuests,
    handleInputChange,
    handleImageUpload,
    handleGuestSearch,
    handleAddGuest,
    handleRemoveGuest,
    handleSubmit,
  } = useEditEvent(eventId, currentUser);

  const handleCancel = () => {
    navigate("/profile", { state: { activeSection: "my-events" } });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(navigate);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onGoBack={handleCancel} />;
  }

  return (
    <div className="edit-event-page">
      <div className="edit-event-container">
        <div className="edit-event-header">
          <h1 className="edit-event-title">Edit Event</h1>
          <p className="edit-event-subtitle">
            Update your event details and settings
          </p>
        </div>

        <form onSubmit={onSubmit} className="edit-event-form">
          <EventDetailsSection
            eventData={eventData}
            onInputChange={handleInputChange}
            guestSearch={guestSearch}
            filteredGuests={filteredGuests}
            onGuestSearch={handleGuestSearch}
            onAddGuest={handleAddGuest}
            onRemoveGuest={handleRemoveGuest}
          />

          <DateTimeSection
            eventData={eventData}
            onInputChange={handleInputChange}
          />

          <BannerSection
            eventData={eventData}
            onImageUpload={handleImageUpload}
            imageUploading={imageUploading}
          />

          <FormActions onCancel={handleCancel} saving={saving} />
        </form>
      </div>
    </div>
  );
};

export default EditEvent;

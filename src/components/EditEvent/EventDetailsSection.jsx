import React from "react";
import { useSelector } from "react-redux";
import { IoInformationCircleOutline } from "react-icons/io5";

const EventDetailsSection = ({
  eventData,
  onInputChange,
  guestSearch,
  filteredGuests,
  onGuestSearch,
  onAddGuest,
  onRemoveGuest,
}) => {
  const categories = useSelector((state) => state.category.list);

  return (
    <div className="edit-form-section">
      <h3 className="edit-section-title">
        <IoInformationCircleOutline className="edit-section-icon" />
        Event Details
      </h3>

      <div className="edit-form-group">
        <label htmlFor="title" className="edit-form-label required">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={eventData.title}
          onChange={onInputChange}
          required
          className="edit-form-control"
          placeholder="Enter your event title"
        />
      </div>

      <div className="edit-form-group">
        <label htmlFor="description" className="edit-form-label required">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={eventData.description}
          onChange={onInputChange}
          required
          rows="4"
          className="edit-form-control"
          placeholder="Describe your event in detail..."
        />
      </div>

      <div className="edit-form-group">
        <label htmlFor="location" className="edit-form-label required">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={eventData.location}
          onChange={onInputChange}
          required
          className="edit-form-control"
          placeholder="Event venue or address"
        />
      </div>

      <div className="edit-form-group">
        <label htmlFor="capacity" className="edit-form-label">
          Maximum Attendees
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={eventData.capacity}
          onChange={onInputChange}
          min="1"
          className="edit-form-control"
          placeholder="Leave empty for unlimited"
        />
      </div>

      <div className="edit-form-row">
        <div className="edit-form-group">
          <label htmlFor="category" className="edit-form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={eventData.category}
            onChange={onInputChange}
            className="edit-form-control"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="edit-form-group">
          <label htmlFor="type" className="edit-form-label">
            Event Type
          </label>
          <select
            id="type"
            name="type"
            value={eventData.type}
            onChange={onInputChange}
            className="edit-form-control"
          >
            <option value="">Select event type</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>

      {eventData.type === "Private" && (
        <div className="edit-form-group">
          <label className="edit-form-label">
            Invite Guests (up to {eventData.capacity || "unlimited"})
          </label>
          <input
            type="text"
            placeholder="Search users..."
            value={guestSearch}
            onChange={onGuestSearch}
            className="edit-form-control"
          />
          {filteredGuests.length > 0 && (
            <ul className="guest-suggestions">
              {filteredGuests.map((user) => (
                <li key={user.id} onClick={() => onAddGuest(user)}>
                  {user.name} ({user.email})
                </li>
              ))}
            </ul>
          )}
          <div className="selected-guests">
            {eventData.guests?.map((guest) => (
              <div key={guest.id} className="guest-chip">
                {guest.name}
                <button
                  type="button"
                  onClick={() => onRemoveGuest(guest.id)}
                  className="remove-guest-btn"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsSection;

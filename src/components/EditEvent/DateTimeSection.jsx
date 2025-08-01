import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

const DateTimeSection = ({ eventData, onInputChange }) => {
  return (
    <div className="edit-form-section">
      <h3 className="edit-section-title">
        <IoCalendarOutline className="edit-section-icon" />
        Date & Time
      </h3>

      <div className="edit-form-row">
        <div className="edit-form-group">
          <label htmlFor="startDate" className="edit-form-label required">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={eventData.startDate}
            onChange={onInputChange}
            required
            className="edit-form-control"
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="endDate" className="edit-form-label">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={eventData.endDate}
            onChange={onInputChange}
            className="edit-form-control"
          />
        </div>
      </div>

      <div className="edit-form-row">
        <div className="edit-form-group">
          <label htmlFor="startTime" className="edit-form-label required">
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={eventData.startTime}
            onChange={onInputChange}
            required
            className="edit-form-control"
          />
        </div>
        <div className="edit-form-group">
          <label htmlFor="endTime" className="edit-form-label">
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={eventData.endTime}
            onChange={onInputChange}
            className="edit-form-control"
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;

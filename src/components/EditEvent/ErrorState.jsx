import React from "react";

const ErrorState = ({ error, onGoBack }) => {
  return (
    <div className="edit-event-page">
      <div className="edit-event-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button className="edit-btn edit-btn-secondary" onClick={onGoBack}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

import React from "react";

const LoadingState = () => {
  return (
    <div className="edit-event-page">
      <div className="edit-event-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading event data...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;

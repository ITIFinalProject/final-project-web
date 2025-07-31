const EventDescription = ({ event }) => {
  return (
    <div className="description-section">
      <div className="container">
        <h3 className="section-title">Event Description</h3>
        <div className="description-content">
          {event?.description ? (
            <div className="description-text">
              {event.description.split("\n").map((paragraph, index) => (
                <p key={index} className="description-text">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="description-text">
              No description available for this event.
            </p>
          )}

          {event?.highlights && event.highlights.length > 0 && (
            <div className="reasons-list">
              <h6>Event Highlights:</h6>
              <ul>
                {event.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {event?.requirements && (
            <div className="requirements-section">
              <h6>Requirements:</h6>
              <p className="description-text">{event.requirements}</p>
            </div>
          )}

          {event?.additionalInfo && (
            <div className="additional-info">
              <h6>Additional Information:</h6>
              <p className="description-text">{event.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDescription;

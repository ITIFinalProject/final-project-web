const TagsSection = ({ event }) => {
  // Use tags from event data or fall back to category
  const eventTags = event?.tags || [];
  const category = event?.category;

  // Create tags array from available data
  let tags = [...eventTags];

  // Add category as a tag if it exists and isn't already in tags
  if (category && !tags.includes(category)) {
    tags.unshift(category);
  }

  // If no tags available, show default message
  if (tags.length === 0) {
    return (
      <div className="tags-section">
        <div className="container">
          <h3 className="section-title">Tags</h3>
          <p className="text-muted">No tags available for this event.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tags-section">
      <div className="container">
        <h3 className="section-title">Tags</h3>
        <div className="tags-container">
          {tags.map((tag, index) => (
            <button key={index} className="tag">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagsSection;

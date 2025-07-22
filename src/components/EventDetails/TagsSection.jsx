const TagsSection = () => {
  const tags = [
    "Holiday Concert",
    "Live Performance",
    "Seasonal Event",
    "Family-Friendly",
    "#Christmas_Spirit",
    "#Christmas_Carols",
  ];

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

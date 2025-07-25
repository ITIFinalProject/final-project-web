const CreateBanner = ({ onContinue, onBack }) => {
  return (
    <div>
      <h3>Step 2: Upload Banner</h3>
      {/* Your banner upload UI */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={onBack} className="back-btn">Back</button>
        <button onClick={onContinue} className="save-btn">Continue & Save</button>
      </div>
    </div>
  );
};

export default CreateBanner;

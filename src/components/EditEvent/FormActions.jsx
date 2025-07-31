import React from "react";

const FormActions = ({ onCancel, saving }) => {
  return (
    <div className="edit-form-actions">
      <button
        type="button"
        className="edit-btn edit-btn-secondary"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="edit-btn edit-btn-primary"
        disabled={saving}
      >
        {saving ? "Saving..." : "Update Event"}
      </button>
    </div>
  );
};

export default FormActions;


const CreateDetails = ({ onContinue }) => {
  return (
    <div className="create-details">

      <form className="details-form">
        <section>
          <h3>Event Details</h3>
          <label>
            Event Title <span>*</span>
            <input type="text" placeholder="Enter the name of your event" />
          </label>
          <label>
            Event Category <span>*</span>
            <select>
              <option>Please select one</option>
              {/* Add options dynamically */}
            </select>
          </label>
        </section>

        <section>
          <h3>Date & Time</h3>
          <div className="datetime-fields">
            <label>
              Start Date <span>*</span>
              <input type="date" />
            </label>
            <label>
              Start Time <span>*</span>
              <input type="time" />
            </label>
            <label>
              End Time
              <input type="time" />
            </label>
          </div>
        </section>

        <section>
          <h3>Location</h3>
          <label>
            Where will your event take place? <span>*</span>
            <select>
              <option>Please select one</option>
              {/* Add options dynamically */}
            </select>
          </label>
        </section>

        <section>
          <h3>Additional Information</h3>
          <label>
            Event Description <span>*</span>
            <textarea
              placeholder="Describe what's special about your event & other important details."
            ></textarea>
          </label>
        </section>

        <button type="submit" className="save-btn" onClick={onContinue}>Save & Continue</button>
      </form>
    </div>
  );
};

export default CreateDetails;

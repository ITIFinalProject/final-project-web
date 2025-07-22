import { IoStar, IoShareSocial } from "react-icons/io5";

const EventTitleSection = () => {
  return (
    <div className="event-title-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="event-title">Sound Of Christmas 2023</h1>
          </div>
          <div className="col-lg-4 text-lg-end">
            <div className="action-buttons">
              <button className="action-btn">
                <IoStar />
              </button>
              <button className="action-btn">
                <IoShareSocial />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTitleSection;

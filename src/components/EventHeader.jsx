import { IoCalendar } from "react-icons/io5";
import "../styles/Header.css";

const EventHeader = () => {
  return (
    <>
      <header className="event-header">
        <nav className="navbar navbar-expand-lg navbar-dark">
          <div className="container">
            <a className="navbar-brand" href="#">
              <IoCalendar /> Eventify
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Events
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Contact
                  </a>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <button className="create-event-btn">Create Event</button>
                <div className="profile-avatar"></div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default EventHeader;

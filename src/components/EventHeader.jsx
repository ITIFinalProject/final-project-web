import {
  IoCalendar,
  IoPersonCircle,
  IoChevronDown,
  IoStar,
} from "react-icons/io5";
import { useState } from "react";
import "../styles/Header.css";

const EventHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

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
              onClick={toggleNav}
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
              id="navbarNav"
            >
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Events
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setIsNavOpen(false)}
                  >
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Contact
                  </a>
                </li>
              </ul>
              <div className="d-flex align-items-center header-actions">
                <button
                  className="create-event-btn"
                  onClick={() => setIsNavOpen(false)}
                >
                  Create Event
                </button>
                <button
                  className="interested-btn"
                  onClick={() => setIsNavOpen(false)}
                  title="Interested Events"
                >
                  <IoStar />
                </button>
                <div className="profile-dropdown">
                  <button
                    className="profile-btn"
                    onClick={toggleProfileDropdown}
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <div className="profile-avatar">
                      <IoPersonCircle />
                    </div>
                    <IoChevronDown
                      className={`dropdown-arrow ${
                        isProfileDropdownOpen ? "open" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`dropdown-menu-custom ${
                      isProfileDropdownOpen ? "show" : ""
                    }`}
                  >
                    <a href="#" className="dropdown-item-custom">
                      <IoPersonCircle className="dropdown-icon" />
                      My Profile
                    </a>
                    <hr className="dropdown-divider-custom" />
                    <a href="#" className="dropdown-item-custom">
                      <IoCalendar className="dropdown-icon" />
                      Sign Out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default EventHeader;

import {
  IoCalendar,
  IoPersonCircle,
  IoChevronDown,
  IoStar,
} from "react-icons/io5";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Notification from "./Notification";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Header.css";

const EventHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  return (
    <header className="event-header">
      <nav className="navbar navbar-expand-lg ">
        <div className="container">
          <NavLink
            className="navbar-brand"
            to="/"
            onClick={() => setIsNavOpen(false)}
          >
            <IoCalendar /> Eventify
          </NavLink>

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
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to="/"
                  onClick={() => setIsNavOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to="/Events"
                  onClick={() => setIsNavOpen(false)}
                >
                  Events
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to="/InterestedEvents"
                  onClick={() => setIsNavOpen(false)}
                >
                  Interested
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to="/SignUp"
                  onClick={() => setIsNavOpen(false)}
                >
                  Sign Up
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/Profile"
                  onClick={() => setIsNavOpen(false)}
                >
                  Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/Album"
                  onClick={() => setIsNavOpen(false)}
                >
                  Album
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center header-actions">
              <button
                className="create-event-btn"
                onClick={() => setIsNavOpen(false)}
              >
                Create Event
              </button>
              <NavLink to="/InterestedEvents" title="Interested Events">
                <button
                  className="interested-btn"
                  onClick={() => setIsNavOpen(false)}
                >
                  <IoStar />
                </button>
              </NavLink>

              {/* Notification Component */}
              <Notification />

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
                  <NavLink to="/SignUp" className="dropdown-item-custom">
                    <IoPersonCircle className="dropdown-icon" />
                    My Profile
                  </NavLink>
                  <hr className="dropdown-divider-custom" />
                  <NavLink to="/" className="dropdown-item-custom">
                    <IoCalendar className="dropdown-icon" />
                    Sign Out
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default EventHeader;

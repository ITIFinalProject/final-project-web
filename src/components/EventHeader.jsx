import {
  IoCalendar,
  IoPersonCircle,
  IoChevronDown,
  IoStar,
  IoLogOut,
  IoLogIn,
} from "react-icons/io5";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { useAuth } from "../redux/hooks";
import { logOut } from "../services/authService";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Header.css";

const EventHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();

  const toggleNav = () => setIsNavOpen(!isNavOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleSignOut = async () => {
    await logOut();
    setIsProfileDropdownOpen(false);
    setIsNavOpen(false);
    navigate("/");
  };

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
                  to="/Album"
                  onClick={() => setIsNavOpen(false)}
                >
                  Album
                </NavLink>
              </li>
            </ul>

            <div className="d-flex align-items-center header-actions">
              {/* Create Event button - show for all users */}
              <NavLink
                to="/CreateEvent"
                className="create-event-btn"
                onClick={() => setIsNavOpen(false)}
              >
                Create Event
              </NavLink>

              {loading ? (
                /* Loading state - show minimal UI while checking auth */
                <div className="auth-loading">
                  <div className="loading-spinner"></div>
                </div>
              ) : currentUser ? (
                <>
                  {/* Logged in user - show interested button, notification, and profile dropdown */}
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
                      <span className="profile-name">
                        {userData?.name || currentUser?.displayName || "User"}
                      </span>
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
                      <NavLink to="/Profile" className="dropdown-item-custom">
                        <IoPersonCircle className="dropdown-icon" />
                        My Profile
                      </NavLink>
                      <hr className="dropdown-divider-custom" />
                      <button
                        onClick={handleSignOut}
                        className="dropdown-item-custom logout-btn"
                      >
                        <IoLogOut className="dropdown-icon" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Not logged in - show single sign up/login button */
                <div className="auth-buttons">
                  <NavLink
                    to="/login"
                    className="create-event-btn"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Sign Up / Login
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default EventHeader;

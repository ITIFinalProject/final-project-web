import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Profile/Sidebar";
import AccountInfoPage from "../components/Profile/AccountInfoPage";
import EmailPasswordPage from "../components/Profile/EmailPasswordPage";
import MyEventsPage from "../components/Profile/MyEventsPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Profile.css";
const Profile = () => {
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("account-info");

  useEffect(() => {
    // Check if we came from EditEvent page with a specific section
    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection);
    }
  }, [location]);

  const renderContent = () => {
    switch (activeSection) {
      case "account-info":
        return <AccountInfoPage />;
      case "email-password":
        return <EmailPasswordPage />;
      case "my-events":
        return <MyEventsPage />;
      default:
        return <AccountInfoPage />;
    }
  };

  return (
    <div className="profile-dashboard">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <Sidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>
          <div className="col-lg-8 col-md-12">
            <div className="main-content">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import AccountInfoPage from "../components/Profile/AccountInfoPage";
import EmailPasswordPage from "../components/Profile/EmailPasswordPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Profile.css";
const Profile = () => {
  const [activeSection, setActiveSection] = useState("account-info");

  const renderContent = () => {
    switch (activeSection) {
      case "account-info":
        return <AccountInfoPage />;
      case "email-password":
        return <EmailPasswordPage />;
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

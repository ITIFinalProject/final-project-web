import React, { useState } from "react";
import Sidebar from "../components/Profile/Sidebar";
import AccountInfoPage from "../components/Profile/AccountInfoPage";
import ChangeEmailPage from "../components/Profile/ChangeEmailPage";
import PasswordPage from "../components/Profile/PasswordPage";
import "../styles/Profile.css";
const Profile = () => {
  const [activeSection, setActiveSection] = useState("account-info");

  const renderContent = () => {
    switch (activeSection) {
      case "account-info":
        return <AccountInfoPage />;
      case "change-email":
        return <ChangeEmailPage />;
      case "password":
        return <PasswordPage />;
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

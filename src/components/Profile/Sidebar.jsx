const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "account-info", label: "Account Info" },
    { id: "change-email", label: "Change Email" },
    { id: "password", label: "Password" },
  ];

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">Account Settings</h3>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.id} className="sidebar-item">
            <button
              className={`sidebar-button ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

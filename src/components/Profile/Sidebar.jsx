const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "account-info", label: "Account Info" },
    { id: "email-password", label: "Email & Password" },
    { id: "my-events", label: "My Events" },
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

import React, { useState } from "react";
import { IoMail, IoCheckmarkCircle } from "react-icons/io5";
import "../styles/Notification.css"; // Assuming you have a CSS file for styling

const Notification = () => {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  // Mock invitation notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Invitation: Tech Conference 2025",
      message: "You've been invited to attend the Tech Conference 2025",
      time: "2 minutes ago",
      type: "invitation",
      read: false,
      icon: IoMail,
    },
    {
      id: 2,
      title: "Event Invitation: Music Festival",
      message: "Join us for an amazing Music Festival experience",
      time: "1 hour ago",
      type: "invitation",
      read: false,
      icon: IoMail,
    },
    {
      id: 3,
      title: "Art Exhibition Invitation",
      message: "You're invited to our exclusive Art Exhibition",
      time: "3 hours ago",
      type: "invitation",
      read: true,
      icon: IoMail,
    },
    {
      id: 4,
      title: "Food Festival Invitation",
      message: "Come and taste amazing dishes at our Food Festival",
      time: "1 day ago",
      type: "invitation",
      read: true,
      icon: IoMail,
    },
    {
      id: 5,
      title: "Photography Workshop Invitation",
      message: "Learn photography skills with professional photographers",
      time: "2 days ago",
      type: "invitation",
      read: true,
      icon: IoMail,
    },
  ]);

  const toggleNotificationDropdown = () =>
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <div className="notification-dropdown">
      <button
        className="notification-btn"
        onClick={toggleNotificationDropdown}
        aria-expanded={isNotificationDropdownOpen}
        title="Invitations"
      >
        <IoMail />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      <div
        className={`notification-menu-custom ${
          isNotificationDropdownOpen ? "show" : ""
        }`}
      >
        <div className="notification-header">
          <h6>Invitations</h6>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <IconComponent />
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">{notification.time}</div>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              );
            })
          ) : (
            <div className="no-notifications">
              <IoMail />
              <span>No invitations</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;

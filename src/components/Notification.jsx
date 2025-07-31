import React, { useState, useEffect } from "react";
import { IoMail, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { useSelector } from "react-redux";
import { notificationService } from "../services/notificationService";
import "../styles/Notification.css"; // Assuming you have a CSS file for styling

const Notification = () => {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useSelector((state) => state.auth);

  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribeToUserNotifications(
      currentUser.uid,
      (fetchedNotifications) => {
        // Transform Firebase notifications to match our UI format
        const transformedNotifications = fetchedNotifications.map((notif) => ({
          id: notif.id,
          title: `Invitation: ${notif.eventTitle}`,
          message: `${notif.eventDescription} - Hosted by ${notif.hostName}`,
          time: formatTime(notif.createdAt),
          type: notif.type,
          read: notif.read,
          icon: IoMail,
          status: notif.status,
          eventId: notif.eventId,
          originalNotification: notif, // Keep original for responses
        }));

        setNotifications(transformedNotifications);
        setLoading(false);
      }
    );

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Format timestamp for display
  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / 60000);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60)
        return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
      if (diffInHours < 24)
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
      if (diffInDays < 7)
        return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;

      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  const toggleNotificationDropdown = () =>
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const markAsRead = async (id) => {
    if (!currentUser?.uid) return;

    try {
      await notificationService.markNotificationAsRead(currentUser.uid, id);
      // The real-time subscription will update the UI automatically
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser?.uid) return;

    try {
      await notificationService.markAllNotificationsAsRead(currentUser.uid);
      // The real-time subscription will update the UI automatically
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleInvitationResponse = async (notification, status) => {
    if (!currentUser?.uid) return;

    try {
      // Update the invitation status
      await notificationService.respondToInvitation(
        currentUser.uid,
        notification.id,
        status
      );

      // If accepted, add to joined events
      if (status === "accepted") {
        // Use the original notification data directly
        const originalData = notification.originalNotification;
        await notificationService.addToJoinedEvents(currentUser.uid, {
          id: originalData.eventId,
          title: originalData.eventTitle,
          description: originalData.eventDescription,
          date: originalData.eventDate,
          location: originalData.eventLocation,
          hostName: originalData.hostName,
        });
      }

      // Mark as read
      await markAsRead(notification.id);
    } catch (error) {
      console.error("Error responding to invitation:", error);
      console.error("Notification data:", notification);
      console.error(
        "Original notification:",
        notification.originalNotification
      );
      alert("Failed to respond to invitation. Please try again.");
    }
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
          {loading ? (
            <div className="notification-loading">
              <div className="loading-text">Loading invitations...</div>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
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

                    {/* Show action buttons only for pending invitations */}
                    {notification.status === "pending" && (
                      <div className="notification-actions">
                        <button
                          className="accept-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvitationResponse(notification, "accepted");
                          }}
                        >
                          <IoCheckmarkCircle />
                          Accept
                        </button>
                        <button
                          className="reject-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInvitationResponse(notification, "rejected");
                          }}
                        >
                          <IoCloseCircle />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Show status for responded invitations */}
                    {notification.status === "accepted" && (
                      <div className="notification-status accepted">
                        <IoCheckmarkCircle />
                        Accepted
                      </div>
                    )}
                    {notification.status === "rejected" && (
                      <div className="notification-status rejected">
                        <IoCloseCircle />
                        Rejected
                      </div>
                    )}
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}

                  {/* Mark as read on click if unread */}
                  {!notification.read && (
                    <div
                      className="mark-read-overlay"
                      onClick={() => markAsRead(notification.id)}
                    />
                  )}
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

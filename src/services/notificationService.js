import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const notificationService = {
  // Create invitation notifications for guests when a private event is published
  createEventInvitations: async (eventData) => {
    try {
      if (
        eventData.type !== "Private" ||
        !eventData.guests ||
        eventData.guests.length === 0
      ) {
        return; // No invitations needed for public events or events without guests
      }

      const invitations = [];

      // Create invitation for each guest
      for (const guest of eventData.guests) {
        const invitationData = {
          type: "invitation",
          eventId: eventData.id,
          eventTitle: eventData.title,
          eventDescription: eventData.description,
          eventDate: eventData.date,
          eventTime: eventData.time,
          eventLocation: eventData.location,
          eventCategory: eventData.category,
          hostId: eventData.hostId,
          hostName: eventData.hostName,
          guestId: guest.id,
          guestEmail: guest.email,
          status: "pending", // pending, accepted, rejected
          createdAt: serverTimestamp(),
          read: false,
        };

        // Add notification to the guest's notifications subcollection
        const notificationRef = await addDoc(
          collection(db, "users", guest.id, "notifications"),
          invitationData
        );

        invitations.push({ id: notificationRef.id, ...invitationData });
      }

      return invitations;
    } catch (error) {
      console.error("Error creating event invitations:", error);
      throw error;
    }
  },

  // Get all notifications for a user
  getUserNotifications: async (userId) => {
    try {
      if (!userId) return [];

      const notificationsRef = collection(db, "users", userId, "notifications");
      const q = query(notificationsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  },

  // Real-time listener for user notifications
  subscribeToUserNotifications: (userId, callback) => {
    if (!userId) return () => {};

    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(notificationsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(notifications);
    });
  },

  // Mark notification as read
  markNotificationAsRead: async (userId, notificationId) => {
    try {
      const notificationRef = doc(
        db,
        "users",
        userId,
        "notifications",
        notificationId
      );
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (userId) => {
    try {
      const notificationsRef = collection(db, "users", userId, "notifications");
      const q = query(notificationsRef, where("read", "==", false));
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map((docRef) =>
        updateDoc(docRef.ref, {
          read: true,
          readAt: serverTimestamp(),
        })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Respond to invitation (accept/reject)
  respondToInvitation: async (userId, notificationId, status) => {
    try {
      const notificationRef = doc(
        db,
        "users",
        userId,
        "notifications",
        notificationId
      );
      await updateDoc(notificationRef, {
        status: status, // "accepted" or "rejected"
        respondedAt: serverTimestamp(),
        read: true,
      });

      return true;
    } catch (error) {
      console.error("Error responding to invitation:", error);
      throw error;
    }
  },

  // Add accepted event to user's joined events
  addToJoinedEvents: async (userId, eventData) => {
    try {
      console.log("Adding to joined events:", { userId, eventData });

      if (!eventData.id) {
        throw new Error("Event ID is required");
      }

      const joinedEventsRef = collection(db, "users", userId, "joinedEvents");

      // Check if event is already in joined events
      const existingQuery = query(
        joinedEventsRef,
        where("eventId", "==", eventData.id)
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        console.log("Event already joined, skipping");
        return; // Already joined
      }

      const joinedEventData = {
        eventId: eventData.id,
        eventTitle: eventData.title || "Untitled Event",
        eventDescription: eventData.description || "",
        eventDate: eventData.date || "",
        eventLocation: eventData.location || "",
        hostName: eventData.hostName || "Unknown Host",
        joinedAt: serverTimestamp(),
      };

      console.log("Creating joined event document:", joinedEventData);

      await addDoc(joinedEventsRef, joinedEventData);
      console.log("Successfully added to joined events");
    } catch (error) {
      console.error("Error adding to joined events:", error);
      console.error("Event data received:", eventData);
      throw error;
    }
  },
};

export default notificationService;

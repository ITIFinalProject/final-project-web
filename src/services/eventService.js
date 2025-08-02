import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const eventService = {
  // Create a new event
  createEvent: async (eventData) => {
    try {
      const eventRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: eventRef.id, ...eventData };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  // Get a single event by ID
  getEventById: async (eventId) => {
    try {
      const eventDoc = await getDoc(doc(db, "events", eventId));
      if (eventDoc.exists()) {
        return { id: eventDoc.id, ...eventDoc.data() };
      } else {
        throw new Error("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (eventId, updatedData) => {
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
      return { id: eventId, ...updatedData };
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  // Get events created by a specific user
  getUserCreatedEvents: async (userId) => {
    try {
      console.log("Fetching created events for user:", userId);

      // First try with hostId field
      let eventsQuery = query(
        collection(db, "events"),
        where("hostId", "==", userId)
      );

      let querySnapshot = await getDocs(eventsQuery);
      console.log("Events with hostId:", querySnapshot.size);

      // If no events found with hostId, try with createdBy field
      if (querySnapshot.empty) {
        eventsQuery = query(
          collection(db, "events"),
          where("createdBy", "==", userId)
        );
        querySnapshot = await getDocs(eventsQuery);
        console.log("Events with createdBy:", querySnapshot.size);
      }

      // If still no events, try with userId field
      if (querySnapshot.empty) {
        eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", userId)
        );
        querySnapshot = await getDocs(eventsQuery);
        console.log("Events with userId:", querySnapshot.size);
      }

      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Found created events:", events);
      return events;
    } catch (error) {
      console.error("Error fetching user created events:", error);

      // Fallback: get all events and let user see them for testing
      console.log("Attempting fallback: fetching all events for testing");
      try {
        const simpleQuery = collection(db, "events");
        const simpleSnapshot = await getDocs(simpleQuery);
        const allEvents = simpleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(
          "Fallback: returning all events for testing:",
          allEvents.length
        );
        return allEvents; // For testing purposes, return all events
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
        return [];
      }
    }
  },

  // Get events a user has joined (from accepted invitations)
  getUserJoinedEvents: async (userId) => {
    try {
      console.log("Fetching joined events for user:", userId);

      // Get events from the user's joinedEvents subcollection
      const joinedEventsRef = collection(db, "users", userId, "joinedEvents");
      const joinedSnapshot = await getDocs(joinedEventsRef);

      if (joinedSnapshot.empty) {
        console.log("No joined events found");
        return [];
      }

      const joinedEvents = [];

      // For each joined event, get the full event data from the main events collection
      for (const docSnapshot of joinedSnapshot.docs) {
        const joinedEventData = docSnapshot.data();

        if (!joinedEventData.eventId) {
          console.warn(
            "Invalid eventId found in joined events:",
            joinedEventData
          );
          continue;
        }

        // Get the full event data from the main events collection
        const eventRef = doc(db, "events", joinedEventData.eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          joinedEvents.push({
            id: joinedEventData.eventId,
            joinedAt: joinedEventData.joinedAt,
            ...eventSnapshot.data(),
          });
        } else {
          console.warn(
            "Event not found in main collection:",
            joinedEventData.eventId
          );
        }
      }

      console.log("Found joined events:", joinedEvents);
      return joinedEvents;
    } catch (error) {
      console.error("Error fetching user joined events:", error);

      // Fallback: try to get from interested events for backward compatibility
      try {
        console.log("Attempting fallback: fetching from interested events");
        const interestedQuery = query(
          collection(db, "users", userId, "interestedEvents")
        );
        const interestedSnapshot = await getDocs(interestedQuery);
        const eventIds = interestedSnapshot.docs
          .map((doc) => doc.data().eventId)
          .filter(Boolean);

        if (eventIds.length === 0) {
          return [];
        }

        // Get actual event data
        const events = [];
        for (const eventId of eventIds) {
          try {
            const eventRef = doc(db, "events", eventId);
            const eventSnapshot = await getDoc(eventRef);
            if (eventSnapshot.exists()) {
              events.push({ id: eventId, ...eventSnapshot.data() });
            }
          } catch (eventError) {
            console.warn("Error fetching event:", eventId, eventError);
          }
        }

        return events;
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        return [];
      }
    }
  },

  // Get all events
  getAllEvents: async () => {
    try {
      // Try to order by date field first
      let eventsQuery = query(
        collection(db, "events"),
        orderBy("date", "desc")
      );

      let querySnapshot;
      try {
        querySnapshot = await getDocs(eventsQuery);
      } catch (orderError) {
        // If ordering fails, get all events without ordering
        console.warn(
          "Could not order by date, fetching all events:",
          orderError
        );
        eventsQuery = collection(db, "events");
        querySnapshot = await getDocs(eventsQuery);
      }

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  },

  // Join a public event
  joinEvent: async (userId, eventId) => {
    try {
      console.log("User attempting to join event:", { userId, eventId });

      // First, get the event to check capacity and type
      const eventRef = doc(db, "events", eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (!eventSnapshot.exists()) {
        throw new Error("Event not found");
      }

      const eventData = eventSnapshot.data();

      // Check if event is public
      if (eventData.type !== "Public") {
        throw new Error("This event is private and requires an invitation");
      }

      // Check if user is already joined
      const joinedEventsRef = collection(db, "users", userId, "joinedEvents");
      const existingQuery = query(
        joinedEventsRef,
        where("eventId", "==", eventId)
      );
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        throw new Error("You have already joined this event");
      }

      // Check capacity
      const capacity = eventData.capacity;
      const currentAttendees = eventData.currentAttendees || 0;

      if (capacity && currentAttendees >= capacity) {
        throw new Error("Event is full. Capacity reached.");
      }

      // Add to user's joined events
      const joinedEventData = {
        eventId: eventId,
        eventTitle: eventData.title || "Untitled Event",
        eventDescription: eventData.description || "",
        eventDate: eventData.date || "",
        eventLocation: eventData.location || "",
        hostName: eventData.hostName || "Unknown Host",
        joinedAt: serverTimestamp(),
      };

      await addDoc(joinedEventsRef, joinedEventData);

      // Update event's current attendees count
      await updateDoc(eventRef, {
        currentAttendees: increment(1),
        updatedAt: serverTimestamp(),
      });

      console.log("Successfully joined event");
      return { success: true, message: "Successfully joined the event!" };
    } catch (error) {
      console.error("Error joining event:", error);
      throw error;
    }
  },

  // Leave a joined event
  leaveEvent: async (userId, eventId) => {
    try {
      console.log("User attempting to leave event:", { userId, eventId });

      // Remove from user's joined events
      const joinedEventsRef = collection(db, "users", userId, "joinedEvents");
      const joinedQuery = query(
        joinedEventsRef,
        where("eventId", "==", eventId)
      );
      const joinedSnapshot = await getDocs(joinedQuery);

      if (joinedSnapshot.empty) {
        throw new Error("You haven't joined this event");
      }

      // Delete the joined event document
      await deleteDoc(joinedSnapshot.docs[0].ref);

      // Update event's current attendees count
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        currentAttendees: increment(-1),
        updatedAt: serverTimestamp(),
      });

      console.log("Successfully left event");
      return { success: true, message: "Successfully left the event!" };
    } catch (error) {
      console.error("Error leaving event:", error);
      throw error;
    }
  },

  // Check if user has joined an event
  isUserJoined: async (userId, eventId) => {
    try {
      const joinedEventsRef = collection(db, "users", userId, "joinedEvents");
      const joinedQuery = query(
        joinedEventsRef,
        where("eventId", "==", eventId)
      );
      const joinedSnapshot = await getDocs(joinedQuery);

      return !joinedSnapshot.empty;
    } catch (error) {
      console.error("Error checking if user joined event:", error);
      return false;
    }
  },
};

export default eventService;

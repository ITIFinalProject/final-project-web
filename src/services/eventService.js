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

  // Get events a user has joined (interested in)
  getUserJoinedEvents: async (userId) => {
    try {
      // First get the event IDs the user is interested in
      const interestedQuery = query(
        collection(db, "interestedEvents"),
        where("userId", "==", userId)
      );
      const interestedSnapshot = await getDocs(interestedQuery);
      const eventIds = interestedSnapshot.docs.map((doc) => doc.data().eventId);

      if (eventIds.length === 0) {
        return [];
      }

      // Then get the actual event data
      // Note: Firestore 'in' queries have a limit of 10 items
      const batches = [];
      for (let i = 0; i < eventIds.length; i += 10) {
        const batchIds = eventIds.slice(i, i + 10);
        const eventsQuery = query(
          collection(db, "events"),
          where("__name__", "in", batchIds)
        );
        batches.push(getDocs(eventsQuery));
      }

      const results = await Promise.all(batches);
      const events = [];
      results.forEach((snapshot) => {
        snapshot.docs.forEach((doc) => {
          events.push({ id: doc.id, ...doc.data() });
        });
      });

      return events;
    } catch (error) {
      console.error("Error fetching user joined events:", error);
      throw error;
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
};

export default eventService;

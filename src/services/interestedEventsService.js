import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Add an event to user's interested events
 * @param {string} userId - The user's ID
 * @param {string} eventId - The event's ID
 * @param {object} eventData - Additional event data to store
 */
export const addInterestedEvent = async (userId, eventId, eventData = {}) => {
  try {
    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }
    if (!eventId || typeof eventId !== "string") {
      throw new Error("Valid eventId is required");
    }

    // Reference to the user's interested events subcollection
    const interestedEventsRef = collection(
      db,
      "users",
      userId,
      "interestedEvents"
    );

    // Check if event is already in interested events
    const existingEventQuery = query(
      interestedEventsRef,
      where("eventId", "==", eventId)
    );
    const existingEventSnapshot = await getDocs(existingEventQuery);

    if (!existingEventSnapshot.empty) {
      throw new Error("Event is already in interested events");
    }

    // Add the event to interested events
    const docRef = await addDoc(interestedEventsRef, {
      eventId: eventId,
      addedAt: new Date(),
      ...eventData,
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding interested event:", error);
    throw error;
  }
};

/**
 * Remove an event from user's interested events
 * @param {string} userId - The user's ID
 * @param {string} eventId - The event's ID
 */
export const removeInterestedEvent = async (userId, eventId) => {
  try {
    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }
    if (!eventId || typeof eventId !== "string") {
      throw new Error("Valid eventId is required");
    }

    // Reference to the user's interested events subcollection
    const interestedEventsRef = collection(
      db,
      "users",
      userId,
      "interestedEvents"
    );

    // Find the document with the specified eventId
    const eventQuery = query(
      interestedEventsRef,
      where("eventId", "==", eventId)
    );
    const eventSnapshot = await getDocs(eventQuery);

    if (eventSnapshot.empty) {
      throw new Error("Event not found in interested events");
    }

    // Delete the document
    const eventDoc = eventSnapshot.docs[0];
    await deleteDoc(doc(db, "users", userId, "interestedEvents", eventDoc.id));

    return true;
  } catch (error) {
    console.error("Error removing interested event:", error);
    throw error;
  }
};

/**
 * Get all interested events for a user
 * @param {string} userId - The user's ID
 */
export const getUserInterestedEvents = async (userId) => {
  try {
    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }

    // Reference to the user's interested events subcollection
    const interestedEventsRef = collection(
      db,
      "users",
      userId,
      "interestedEvents"
    );

    // Get all interested events
    const querySnapshot = await getDocs(interestedEventsRef);

    const interestedEvents = [];

    // For each interested event, get the full event data from the main events collection
    for (const docSnapshot of querySnapshot.docs) {
      const interestedEventData = docSnapshot.data();

      // Validate that eventId exists and is a string
      if (
        !interestedEventData.eventId ||
        typeof interestedEventData.eventId !== "string"
      ) {
        console.warn(
          "Invalid eventId found in interested events:",
          interestedEventData
        );
        continue;
      }

      // Get the full event data from the main events collection
      const eventRef = doc(db, "events", interestedEventData.eventId);
      const eventSnapshot = await getDoc(eventRef);

      if (eventSnapshot.exists()) {
        interestedEvents.push({
          id: interestedEventData.eventId,
          interestedDocId: docSnapshot.id,
          addedAt: interestedEventData.addedAt?.toMillis(),
          ...eventSnapshot.data(),
        });
      }
    }

    return interestedEvents;
  } catch (error) {
    console.error("Error fetching interested events:", error);
    throw error;
  }
};

/**
 * Check if an event is in user's interested events
 * @param {string} userId - The user's ID
 * @param {string} eventId - The event's ID
 */
export const isEventInterested = async (userId, eventId) => {
  try {
    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      return false;
    }
    if (!eventId || typeof eventId !== "string") {
      return false;
    }

    // Reference to the user's interested events subcollection
    const interestedEventsRef = collection(
      db,
      "users",
      userId,
      "interestedEvents"
    );

    // Check if event exists in interested events
    const eventQuery = query(
      interestedEventsRef,
      where("eventId", "==", eventId)
    );
    const eventSnapshot = await getDocs(eventQuery);

    return !eventSnapshot.empty;
  } catch (error) {
    console.error("Error checking if event is interested:", error);
    return false;
  }
};

/**
 * Get interested events IDs for a user (lightweight version)
 * @param {string} userId - The user's ID
 */
export const getUserInterestedEventIds = async (userId) => {
  try {
    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      throw new Error("Valid userId is required");
    }

    // Reference to the user's interested events subcollection
    const interestedEventsRef = collection(
      db,
      "users",
      userId,
      "interestedEvents"
    );

    // Get all interested events
    const querySnapshot = await getDocs(interestedEventsRef);

    const eventIds = querySnapshot.docs
      .map((doc) => doc.data().eventId)
      .filter((eventId) => eventId && typeof eventId === "string"); // Filter out invalid eventIds

    return eventIds;
  } catch (error) {
    console.error("Error fetching interested event IDs:", error);
    throw error;
  }
};

import { query, where, getDocs, collectionGroup } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Count how many users are interested in a specific event
 * @param {string} eventId - The ID of the event
 * @returns {Promise<number>} - Number of interested users
 */
export const countInterestedUsers = async (eventId) => {
  try {
    // Use collectionGroup to query all interestedEvents subcollections across all users
    const interestedEventsQuery = query(
      collectionGroup(db, "interestedEvents"),
      where("eventId", "==", eventId)
    );

    const querySnapshot = await getDocs(interestedEventsQuery);
    return querySnapshot.size; // Returns the count of documents
  } catch (error) {
    console.error("Error counting interested users:", error);
    return 0;
  }
};

/**
 * Get interested count for multiple events (batch operation)
 * @param {Array<string>} eventIds - Array of event IDs
 * @returns {Promise<Object>} - Object with eventId as key and count as value
 */
export const getInterestedCountsForEvents = async (eventIds) => {
  try {
    const counts = {};

    // Initialize all counts to 0
    eventIds.forEach((id) => {
      counts[id] = 0;
    });

    if (eventIds.length === 0) return counts;

    // Query all interested events that match any of the eventIds
    const interestedEventsQuery = query(
      collectionGroup(db, "interestedEvents"),
      where("eventId", "in", eventIds)
    );

    const querySnapshot = await getDocs(interestedEventsQuery);

    // Count occurrences of each eventId
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.eventId &&
        Object.prototype.hasOwnProperty.call(counts, data.eventId)
      ) {
        counts[data.eventId]++;
      }
    });

    return counts;
  } catch (error) {
    console.error("Error getting interested counts for events:", error);
    return {};
  }
};

/**
 * Real-time listener for interested count of a specific event
 * This is a placeholder for future implementation
 * @param {string} eventId - The ID of the event
 * @returns {Function} - Unsubscribe function
 */
export const listenToInterestedCount = (eventId) => {
  try {
    // For now, return a simple unsubscribe function
    // Real-time updates with collectionGroup can be complex
    // Consider implementing with a separate events collection field
    console.log("Setting up listener for event:", eventId);

    const unsubscribe = () => {
      console.log("Unsubscribing from interested count listener");
    };

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up interested count listener:", error);
    return () => {};
  }
};

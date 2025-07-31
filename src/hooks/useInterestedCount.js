import { useState, useEffect, useCallback } from "react";
import {
  countInterestedUsers,
  getInterestedCountsForEvents,
} from "../services/interestedCountService";

/**
 * Hook to get interested count for a single event
 * @param {string} eventId - The event ID
 * @returns {Object} - { count, loading, refetch }
 */
export const useInterestedCount = (eventId) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    try {
      const interestedCount = await countInterestedUsers(eventId);
      setCount(interestedCount);
    } catch (error) {
      console.error("Error fetching interested count:", error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return {
    count,
    loading,
    refetch: fetchCount,
  };
};

/**
 * Hook to get interested counts for multiple events
 * @param {Array<string>} eventIds - Array of event IDs
 * @returns {Object} - { counts, loading, refetch }
 */
export const useInterestedCounts = (eventIds) => {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Create a stable string representation of eventIds for dependency
  const eventIdsString = eventIds ? JSON.stringify([...eventIds].sort()) : "[]";

  const fetchCounts = useCallback(async () => {
    if (!eventIds || eventIds.length === 0) {
      setCounts({});
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const interestedCounts = await getInterestedCountsForEvents(eventIds);
      setCounts(interestedCounts);
    } catch (error) {
      console.error("Error fetching interested counts:", error);
      setCounts({});
    } finally {
      setLoading(false);
    }
  }, [eventIds]);

  useEffect(() => {
    fetchCounts();
  }, [eventIdsString, fetchCounts]);

  return {
    counts,
    loading,
    refetch: fetchCounts,
  };
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addInterestedEvent,
  removeInterestedEvent,
  getUserInterestedEvents,
  getUserInterestedEventIds,
} from "../../services/interestedEventsService";

// Async thunk to fetch user's interested events
export const fetchInterestedEvents = createAsyncThunk(
  "interested/fetchInterestedEvents",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const interestedEvents = await getUserInterestedEvents(userId);
      return interestedEvents;
    } catch (error) {
      console.error("Error in fetchInterestedEvents:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch user's interested event IDs
export const fetchInterestedEventIds = createAsyncThunk(
  "interested/fetchInterestedEventIds",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const eventIds = await getUserInterestedEventIds(userId);
      return eventIds;
    } catch (error) {
      console.error("Error in fetchInterestedEventIds:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add event to interested
export const addToInterested = createAsyncThunk(
  "interested/addToInterested",
  async ({ userId, eventId, eventData }, { rejectWithValue }) => {
    try {
      if (!userId || !eventId) {
        throw new Error("User ID and Event ID are required");
      }
      await addInterestedEvent(userId, eventId, eventData);
      return eventId;
    } catch (error) {
      console.error("Error in addToInterested:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove event from interested
export const removeFromInterested = createAsyncThunk(
  "interested/removeFromInterested",
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      if (!userId || !eventId) {
        throw new Error("User ID and Event ID are required");
      }
      await removeInterestedEvent(userId, eventId);
      return eventId;
    } catch (error) {
      console.error("Error in removeFromInterested:", error);
      return rejectWithValue(error.message);
    }
  }
);

const interestedSlice = createSlice({
  name: "interested",
  initialState: {
    events: [],
    eventIds: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearInterestedEvents: (state) => {
      state.events = [];
      state.eventIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Interested events cases
      .addCase(fetchInterestedEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterestedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchInterestedEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Interested event IDs cases
      .addCase(fetchInterestedEventIds.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchInterestedEventIds.fulfilled, (state, action) => {
        state.eventIds = action.payload;
      })
      .addCase(fetchInterestedEventIds.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Add to interested cases
      .addCase(addToInterested.fulfilled, (state, action) => {
        state.eventIds.push(action.payload);
      })
      .addCase(addToInterested.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Remove from interested cases
      .addCase(removeFromInterested.fulfilled, (state, action) => {
        state.eventIds = state.eventIds.filter((id) => id !== action.payload);
        state.events = state.events.filter(
          (event) => event.id !== action.payload
        );
      })
      .addCase(removeFromInterested.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearInterestedEvents } = interestedSlice.actions;

export default interestedSlice.reducer;

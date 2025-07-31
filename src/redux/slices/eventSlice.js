import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // adjust path to your firebase config
import { eventService } from "../../services/eventService";

// export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
//   const querySnapshot = await getDocs(collection(db, "events"));
//   const events = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   return events;
// });
// Async thunk to fetch events
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (currentUserId) => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Filter based on type and user participation
    const filteredEvents = allEvents.filter((event) => {
      return (
        event.type === "Public" ||
        event.hostId === currentUserId ||
        (Array.isArray(event.guests) && event.guests.includes(currentUserId))///
      );
    });

    return filteredEvents;
  }
);

// Async thunk to fetch a single event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (eventId) => {
    const event = await eventService.getEventById(eventId);
    return event;
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: {
    data: [],
    currentEvent: null,
    loading: false,
    currentEventLoading: false,
    error: null,
    currentEventError: null,
  },
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.currentEventError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.currentEventLoading = true;
        state.currentEventError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.currentEventLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.currentEventLoading = false;
        state.currentEventError = action.error.message;
      });
  },
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;

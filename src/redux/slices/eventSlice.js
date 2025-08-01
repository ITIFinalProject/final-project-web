import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { eventService } from "../../services/eventService";


export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (currentUserId) => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const joinedEventsData = await eventService.getUserJoinedEvents(
      currentUserId
    );

    // Extract eventIds from joined events array
    const joinedEventIds = joinedEventsData.map(joinedEvent => joinedEvent.id);

    // Filter based on type and user participation
    const filteredEvents = allEvents.filter((event) => {
      return (
        event.type === "Public" ||
        event.hostId === currentUserId ||
        joinedEventIds.includes(event.id)
      );
    });

    return filteredEvents;
  }
);
export const fetchMyEvents = createAsyncThunk(
  "events/fetchMyEvents",
  async (currentUserId) => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const allEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const joinedEventsData = await eventService.getUserJoinedEvents(
      currentUserId
    );

    // Extract eventIds from joined events array
    const joinedEventIds = joinedEventsData.map(joinedEvent => joinedEvent.id);

    // Filter based on type and user participation
    const filteredEvents = allEvents.filter((event) => {
      return (
        event.hostId === currentUserId ||
        joinedEventIds.includes(event.id)
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
    myEvents: [],
    currentEvent: null,
    loading: false,
    myEventsLoading: false,
    currentEventLoading: false,
    error: null,
    myEventsError: null,
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
      .addCase(fetchMyEvents.pending, (state) => {
        state.myEventsLoading = true;
        state.myEventsError = null;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.myEventsLoading = false;
        state.myEvents = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.myEventsLoading = false;
        state.myEventsError = action.error.message;
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


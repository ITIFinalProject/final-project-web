import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase/config"; // adjust path to your firebase config
import { eventService } from "../../services/eventService";

// // export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
// //   const querySnapshot = await getDocs(collection(db, "events"));
// //   const events = querySnapshot.docs.map((doc) => ({
// //     id: doc.id,
// //     ...doc.data(),
// //   }));
// //   return events;
// // });
// // Async thunk to fetch events


// // export const fetchEvents = createAsyncThunk(
// //   "events/fetchEvents",
// //   async (_, thunkAPI) => {
// //     const state = thunkAPI.getState();
// //     const currentUser = state.auth.userData; // or use currentUser if you store ID there
// // console.log(currentUser);

// //     const querySnapshot = await getDocs(collection(db, "events"));
// //     const allEvents = querySnapshot.docs.map((doc) => ({
// //       ...doc.data(),
// //     }));

// //     const filteredEvents = allEvents.filter((event) => {
// //       return (
// //         event.type === "Public" ||
// //         (currentUser && event.hostId === currentUser.id) ||
// //         (currentUser?.joinedEvents &&
// //           currentUser.joinedEvents.some((e) => e.eventId === event.id))
// //       );
// //     });

// //     return filteredEvents;
// //   }
// // );


// export const fetchEvents = createAsyncThunk(
//   "events/fetchEvents",
//   async (_, thunkAPI) => {
//     const state = thunkAPI.getState();
//     const currentUser = state.auth.currentUser; // from Firebase auth

//     const querySnapshot = await getDocs(collection(db, "events"));
//     const allEvents = querySnapshot.docs.map((doc) => ({
//       ...doc.data(),
//       id: doc.id,
//     }));

//     let joinedEventIds = [];

//     // If user is logged in, fetch their joinedEvents subcollection
//     if (currentUser?.uid) {
//       const joinedEventsSnapshot = await getDocs(
//         collection(db, `users/${currentUser.uid}/joinedEvents`)
//       );
//       joinedEventIds = joinedEventsSnapshot.docs.map((doc) => doc.id);
//     }
// console.log(joinedEventIds);

//     // Filter events
//     const filteredEvents = allEvents.filter((event) => {
//       return (
//         event.type === "Public" ||
//         event.hostId === currentUser?.uid ||
//         joinedEventIds.includes(event.id)
//       );
//     });

//     return filteredEvents;
//   }
// );
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
    console.log(joinedEventsData);

    // Filter based on type and user participation
    const filteredEvents = allEvents.filter((event) => {
      return (
        event.type === "Public" ||
        event.hostId === currentUserId
        || event.id === joinedEventsData.eventId
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

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config"; // adjust path to your firebase config

// Async thunk to fetch events
export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const querySnapshot = await getDocs(collection(db, "events"));
  const events = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return events;
});

const eventSlice = createSlice({
  name: "events",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
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
      });
  },
});

export default eventSlice.reducer;

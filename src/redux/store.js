import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import eventReducer from "./slices/eventSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    events: eventReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["auth/setAuthState"],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["payload.currentUser"],
        // Ignore these paths in the state
        ignoredPaths: ["auth.currentUser"],
      },
    }),
});

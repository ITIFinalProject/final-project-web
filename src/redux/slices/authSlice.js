import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import {
  getUserData,
  logOut,
  checkUserStatus,
} from "../../services/authService";
// Add this import at the top of authSlice.js

// Async thunk for listening to auth state changes
export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            console.log("Auth state changed - user logged in:", user.uid);

            // First check user status before proceeding
            const { isActive, status, error } = await checkUserStatus(user.uid);

            if (!isActive) {
              console.log(`User is ${status}, logging out...`);
              await logOut();

              // Dispatch an action to store the status error
              dispatch(
                setAuthState({
                  currentUser: null,
                  userData: null,
                  loading: false,

                  statusError:
                    error ||
                    (status === "disabled"
                      ? "Your account has been disabled for violation of the rules."
                      : "Your account has been temporarily banned for violation of the rules. The ban will be lifted in 30 days."),
                })
              );

              return; // Exit early
            }

            // Rest of your existing code for fetching user data...
            let userData = null;
            let retries = 3;

            while (retries > 0 && !userData) {
              console.log(
                `Attempting to fetch user data (attempt ${4 - retries})`
              );
              const { userData: firestoreData } = await getUserData(user.uid);
              if (firestoreData) {
                userData = firestoreData;
                console.log("User data fetched successfully:", userData);
                break;
              }

              retries--;
              if (retries > 0) {
                console.log(
                  `User data not found, retrying in 500ms... (${retries} attempts left)`
                );
                await new Promise((resolve) => setTimeout(resolve, 500));
              }
            }

            if (!userData) {
              console.warn("Failed to fetch user data after all retries");
            }

            dispatch(
              setAuthState({
                currentUser: user,
                userData: userData,
                loading: false,
                statusError: null,
              })
            );
          } catch (error) {
            console.error("Error fetching user data:", error);
            dispatch(
              setAuthState({
                currentUser: user,
                userData: null,
                loading: false,
                statusError: error.message,
              })
            );
          }
        } else {
          console.log("Auth state changed - user logged out");
          dispatch(
            setAuthState({
              currentUser: null,
              userData: null,
              loading: false,
              statusError: null,
            })
          );
        }
      });

      resolve(unsubscribe);
    });
  }
);

const initialState = {
  currentUser: null,
  userData: null,
  loading: true,
  error: null,
  statusError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { currentUser, userData, loading, statusError } = action.payload;
      state.currentUser = currentUser;
      state.userData = userData;
      state.loading = loading;
      state.error = null;
      state.statusError = statusError || null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.userData = null;
      state.loading = false;
      state.error = null;
    },
  },
  //
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(listenToAuthState.pending, (state) => {
  //       state.loading = true;
  //     })
  //     .addCase(listenToAuthState.fulfilled, () => {
  //       // Auth state is handled by the callback in the thunk
  //     })
  //     .addCase(listenToAuthState.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.error.message;
  //     });
  // },
});

export const { setAuthState, setLoading, setError, clearError, logout } =
  authSlice.actions;

export default authSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import { getUserData } from "../../services/authService";

// Async thunk for listening to auth state changes
export const listenToAuthState = createAsyncThunk(
  "auth/listenToAuthState",
  async (_, { dispatch }) => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            console.log("Auth state changed - user logged in:", user.uid);
            // Retry logic for fetching user data with a small delay
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
                // Wait 500ms before retrying
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
              })
            );
          } catch (error) {
            console.error("Error fetching user data:", error);
            dispatch(
              setAuthState({
                currentUser: user,
                userData: null,
                loading: false,
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
            })
          );
        }
      });

      // Store the unsubscribe function for cleanup
      resolve(unsubscribe);
    });
  }
);

const initialState = {
  currentUser: null,
  userData: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { currentUser, userData, loading } = action.payload;
      state.currentUser = currentUser;
      state.userData = userData;
      state.loading = loading;
      state.error = null;
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

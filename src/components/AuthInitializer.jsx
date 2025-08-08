// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { listenToAuthState } from "../redux/slices/authSlice";
// import {
//   fetchInterestedEventIds,
//   clearInterestedEvents,
// } from "../redux/slices/interestedSlice";

// const AuthInitializer = ({ children }) => {
//   const dispatch = useDispatch();
//   const { currentUser, loading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     let unsubscribe;

//     // Start listening to auth state changes
//     dispatch(listenToAuthState()).then((result) => {
//       unsubscribe = result.payload;
//     });

//     // Cleanup function
//     return () => {
//       if (unsubscribe && typeof unsubscribe === "function") {
//         unsubscribe();
//       }
//     };
//   }, [dispatch]);

//   // Fetch interested events when user logs in, but only after auth is not loading
//   useEffect(() => {
//     if (!loading) {
//       if (currentUser) {
//         dispatch(fetchInterestedEventIds(currentUser.uid));
//       } else {
//         // Clear interested events when user logs out
//         dispatch(clearInterestedEvents());
//       }
//     }
//   }, [dispatch, currentUser, loading]);

//   return children;
// };

// export default AuthInitializer;

// AuthInitializer.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listenToAuthState } from "../redux/slices/authSlice";
import {
  fetchInterestedEventIds,
  clearInterestedEvents,
} from "../redux/slices/interestedSlice";
import StatusErrorHandler from "./StatusErrorHandler";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    let unsubscribe;

    // Start listening to auth state changes
    dispatch(listenToAuthState()).then((result) => {
      unsubscribe = result.payload;
    });

    // Cleanup function
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [dispatch]);

  // Fetch interested events when user logs in, but only after auth is not loading
  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        dispatch(fetchInterestedEventIds(currentUser.uid));
      } else {
        // Clear interested events when user logs out
        dispatch(clearInterestedEvents());
      }
    }
  }, [dispatch, currentUser, loading]);

  return (
    <>
      {children}
      <StatusErrorHandler />
    </>
  );
};

export default AuthInitializer;

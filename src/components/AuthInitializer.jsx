import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { listenToAuthState } from "../redux/slices/authSlice";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

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

  return children;
};

export default AuthInitializer;

// StatusErrorHandler.jsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { useAppSelector } from "../redux/hooks";

const StatusErrorHandler = () => {
  const dispatch = useDispatch();
  const { statusError } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (statusError) {
      alert(statusError);
      dispatch(logout());
      window.location.href = "/login"; // Using window.location instead of navigate
    }
  }, [statusError, dispatch]);

  return null;
};

export default StatusErrorHandler;

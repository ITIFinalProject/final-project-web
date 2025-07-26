import { useSelector, useDispatch } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = (selector) => useSelector(selector);

// Auth-specific hooks
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

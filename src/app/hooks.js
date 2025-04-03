import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthToken,
} from "../features/auth/authSlice";

// Use these custom hooks in your components
export const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);

  return {
    user,
    isAuthenticated,
    token,
  };
};

export const useAppDispatch = () => useDispatch();

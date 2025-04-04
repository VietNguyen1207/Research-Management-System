import { store } from "../app/store";
import { refreshAuthToken } from "../features/auth/authSlice";

// Function to check if token is expired or about to expire
export const checkTokenExpiration = () => {
  const state = store.getState().auth;
  const { token, tokenExpiresAt } = state;

  if (!token || !tokenExpiresAt) {
    return false;
  }

  // Parse expiration date
  const expiresAt = new Date(tokenExpiresAt);
  const now = new Date();

  // If token expires in less than 5 minutes, refresh it
  const fiveMinutesInMs = 5 * 60 * 1000;
  if (expiresAt.getTime() - now.getTime() < fiveMinutesInMs) {
    store.dispatch(refreshAuthToken());
    return true;
  }

  return false;
};

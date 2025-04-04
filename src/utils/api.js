import { checkTokenExpiration } from "./authUtils";

// Function to make authenticated API requests
export const fetchWithAuth = async (url, options = {}) => {
  // Check if token needs to be refreshed
  checkTokenExpiration();

  // Get the current auth token
  const token = localStorage.getItem("authToken");

  // Create headers with authentication
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Make the request
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token and retry once
  if (response.status === 401) {
    const refreshed = await checkTokenExpiration();

    if (refreshed) {
      // If token was refreshed, retry the request with new token
      const newToken = localStorage.getItem("authToken");
      headers["Authorization"] = `Bearer ${newToken}`;

      return fetch(url, {
        ...options,
        headers,
      });
    }
  }

  return response;
};

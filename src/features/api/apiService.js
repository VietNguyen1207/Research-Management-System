import { fetchBaseQuery } from "@reduxjs/toolkit/query";

// Create a function to make authenticated requests with token refresh
export const createAuthenticatedRequest = (
  baseUrl,
  logoutAction,
  refreshAction
) => {
  // Create the base query with auth headers
  const baseQueryWithAuth = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  // Return a wrapped version with reauth
  return async (args, api, extraOptions) => {
    // First attempt
    let result = await baseQueryWithAuth(args, api, extraOptions);

    // If we get a 401 Unauthorized response
    if (result.error && result.error.status === 401) {
      // Try to refresh the token
      const { refreshToken } = api.getState().auth;

      if (refreshToken) {
        try {
          // Make a direct fetch request to refresh the token
          const refreshResult = await fetch(`${baseUrl}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResult.ok) {
            const data = await refreshResult.json();

            // Store the new tokens
            api.dispatch({
              type: "auth/updateTokens",
              payload: {
                token: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                tokenExpiresAt: data.data.tokenExpiresAt,
              },
            });

            // Retry the original request with the new token
            return baseQueryWithAuth(args, api, extraOptions);
          } else {
            // Refresh failed, logout the user
            api.dispatch(logoutAction());
          }
        } catch (error) {
          // Network error or other exception
          api.dispatch(logoutAction());
        }
      } else {
        // No refresh token, logout the user
        api.dispatch(logoutAction());
      }
    }

    return result;
  };
};

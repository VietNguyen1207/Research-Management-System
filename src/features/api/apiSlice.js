import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = import.meta.env.VITE_API_URL || "https://localhost:7045/api";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: (headers, { getState }) => {
    // Get token from state and add to headers
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  // Define tags for cache invalidation
  tagTypes: ["User", "Notifications", "Students", "Groups"],
  //Inject endpoints
  endpoints: () => ({}),
});

// Export the middleware for use in store setup
export const apiMiddleware = apiSlice.middleware;

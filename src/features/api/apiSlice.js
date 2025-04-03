import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the base API slice with shared configuration
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7045/api",
    prepareHeaders: (headers, { getState }) => {
      // Get token from state and add to headers if it exists
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  // Define tag types for cache invalidation
  tagTypes: ["User", "Notifications", "Students", "Groups"],
  // We'll inject endpoints from other files, so leave this empty
  endpoints: () => ({}),
});

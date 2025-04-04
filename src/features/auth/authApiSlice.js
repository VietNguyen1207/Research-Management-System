import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create a dedicated API slice for auth
export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7045/api",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      }),
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = authApiSlice;

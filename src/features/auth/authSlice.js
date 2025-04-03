import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// Create an async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log(
        "Making API request to:",
        "https://localhost:7045/api/auth/login"
      );
      console.log("With credentials:", credentials);

      const response = await fetch("https://localhost:7045/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        // Try to get error details
        try {
          const errorData = await response.json();
          console.error("Error data:", errorData);
          return rejectWithValue(errorData.message || "Login failed");
        } catch (e) {
          return rejectWithValue(`Server error: ${response.status}`);
        }
      }

      const responseData = await response.json();
      console.log("Login response data:", responseData);

      // Map role integer to string based on backend enum
      const roleMap = {
        0: "admin",
        1: "lecturer",
        2: "student",
        3: "department", // Accounting_Department
        4: "office",
      };

      // Extract the user data from the response
      const userData = responseData.data;

      // Transform the response to match your expected format
      return {
        user: {
          id: userData.userId,
          email: userData.email,
          full_name: userData.fullName,
          status: userData.status,
          role: roleMap[userData.role] || "unknown",
          groups: userData.groups,
        },
        token: userData.accessToken,
      };
    } catch (error) {
      console.error("Login fetch error:", error);
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Add a thunk to check auth state
export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No stored auth data");
      }

      // For now, just return a basic user object from localStorage
      // In a real app, you would validate the token with your API
      return {
        user: { role: "lecturer" }, // Default role as placeholder
        token: token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    // Clear local storage
    localStorage.removeItem("authToken");

    // You could also invalidate any cached API data
    if (apiSlice.util && apiSlice.util.resetApiState) {
      dispatch(apiSlice.util.resetApiState());
    }

    return null;
  }
);

// Define auth-related API endpoints
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // We'll add more endpoints later like register, getCurrentUser, etc.
  }),
});

// Export the auto-generated hooks
export const { useLoginMutation } = authApiSlice;

// Create a slice for auth state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("authToken") || null,
    isAuthenticated: !!localStorage.getItem("authToken"),
    isLoading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      const { user, token } = payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      // Store token in localStorage for persistence
      localStorage.setItem("authToken", token);
    },
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Remove token from localStorage
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("authToken", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, logOut } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;

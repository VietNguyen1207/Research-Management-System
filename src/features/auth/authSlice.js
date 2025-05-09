import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApiSlice } from "./authApiSlice";
import { apiSlice } from "../api/apiSlice";

// Login thunk that uses authApiSlice
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      // Use the login endpoint from authApiSlice
      const result = await dispatch(
        authApiSlice.endpoints.login.initiate(credentials)
      ).unwrap();

      console.log("Login response data:", result);

      // Map role integer to string based on backend enum
      const roleMap = {
        0: "admin",
        1: "lecturer",
        2: "student",
        3: "department",
        4: "office",
      };

      // Map lecturer level to string based on backend enum
      const levelMap = {
        0: "Professor",
        1: "Associate Professor",
        2: "PhD",
        3: "Master",
        4: "Bachelor",
      };

      // Extract the user data from the response
      const userData = result.data;

      // Get the role as a string
      const roleString = roleMap[userData.role] || "unknown";

      // Create the user object with proper transformations
      const user = {
        id: userData.userId,
        email: userData.email,
        full_name: userData.fullName,
        status: userData.status,
        role: roleString,
        groups: userData.groups,
        // Only include level if user is a lecturer
        ...(roleString === "lecturer" && {
          level: userData.level !== undefined ? levelMap[userData.level] : null,
        }),
        // Add new attributes
        department: userData.department,
        profileImageUrl: userData.profileImageUrl,
        lastLogin: userData.lastLogin,
      };

      // Store the complete user data in localStorage
      localStorage.setItem("userData", JSON.stringify(user));
      localStorage.setItem("authToken", userData.accessToken);
      localStorage.setItem("refreshToken", userData.refreshToken);
      localStorage.setItem("tokenExpiresAt", userData.tokenExpiresAt);

      return {
        user,
        token: userData.accessToken,
        refreshToken: userData.refreshToken,
        tokenExpiresAt: userData.tokenExpiresAt,
      };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Add a thunk to check auth state
export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        throw new Error("No stored auth data");
      }

      // Parse the stored user data
      const user = JSON.parse(userData);

      return {
        user,
        token,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      // Get refresh token from state
      const { refreshToken } = getState().auth;

      if (refreshToken) {
        // Call logout API endpoint
        await dispatch(
          authApiSlice.endpoints.logout.initiate({ refreshToken })
        ).unwrap();
      }

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("userData");

      // Reset API state to clear cache
      dispatch(apiSlice.util.resetApiState());

      return null;
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear storage even if API call fails
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("userData");

      // Reset API state
      dispatch(apiSlice.util.resetApiState());

      return null;
    }
  }
);

// Similarly for refreshAuthToken
export const refreshAuthToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Use the refresh endpoint from authApiSlice
      const result = await dispatch(
        authApiSlice.endpoints.refreshToken.initiate({ refreshToken })
      ).unwrap();

      if (!result.data) {
        throw new Error("No data in response");
      }

      const data = result.data;

      return {
        token: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiresAt: data.tokenExpiresAt,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to refresh token");
    }
  }
);

// Create a slice for auth state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("authToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    tokenExpiresAt: localStorage.getItem("tokenExpiresAt") || null,
    isAuthenticated: !!localStorage.getItem("authToken"),
    isLoading: false,
    authChecked: false,
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
    updateToken: (state, { payload }) => {
      const { token, refreshToken, tokenExpiresAt } = payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.tokenExpiresAt = tokenExpiresAt;
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenExpiresAt", tokenExpiresAt);
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
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
        state.isAuthenticated = true;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("tokenExpiresAt", action.payload.tokenExpiresAt);
        localStorage.setItem("userData", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.authChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiresAt");
        localStorage.removeItem("userData");
      })
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
        state.isAuthenticated = true;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("tokenExpiresAt", action.payload.tokenExpiresAt);
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // If token refresh fails, log the user out
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tokenExpiresAt = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiresAt");
        localStorage.removeItem("userData");
      });
  },
});

export const { setCredentials, logOut, updateToken } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthChecked = (state) => state.auth.authChecked;

export default authSlice.reducer;

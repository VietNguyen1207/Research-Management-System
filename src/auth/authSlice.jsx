import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userData from "../data/account.json";

// Get initial user data from localStorage
const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call with local data
      const user = userData.user.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Store both token and user data in localStorage
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  // Clear both token and user data from localStorage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return null;
});

// Add a new thunk to check auth state
export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { rejectWithValue }) => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (!storedUser || !storedToken) {
        throw new Error("No stored auth data");
      }

      return JSON.parse(storedUser);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // loginSuccess: (state, action) => {
    //   console.log("Login payload:", action.payload);
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   localStorage.setItem("user", JSON.stringify(action.payload.user));
    //   localStorage.setItem("token", action.payload.token);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Add cases for checkAuthState
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export default authSlice.reducer;

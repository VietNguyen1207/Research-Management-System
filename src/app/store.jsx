import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// For JavaScript, we can export these as simple functions
export const getState = () => store.getState();
export const dispatch = () => store.dispatch;

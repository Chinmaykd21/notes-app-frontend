/**
 * This file is important because if there are multiple stores, they can be registered here
 * e.g., "user", "settings"
 */
import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "./slices/notesSlice";

const store = configureStore({
  reducer: {
    notes: notesReducer, // Register the "notes" slice in the Redux Store
  },
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>; // Type of overall state
export type AppDispatch = typeof store.dispatch; // Type of dispatch function
export default store;

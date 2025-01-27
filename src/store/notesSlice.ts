/**
 * This file defines a slice of Redux state to manage the content of the text editor.
 * A "slice" in Redux Toolkit combines state, actions, and reducers for a specific
 * part of the app.
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotesState {
  content: string; // Type of state that defines editors content type
}

const initialState: NotesState = {
  content: "",
};

// Create a redux slice for "notes" feature
const notesSlice = createSlice({
  name: "notes", // Name of the slice. Used to identify actions in Redux DevTools.
  initialState, // Initial state for this slice.
  reducers: {
    setContent(state, action: PayloadAction<string>) {
      state.content = action.payload; // Updates the "content" field with the new value from the action.
    },
  },
});

export const { setContent } = notesSlice.actions;
export default notesSlice.reducer;

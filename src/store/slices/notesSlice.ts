import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchNotes,
  fetchNoteById,
  addNote,
  updateNote,
  deleteNote,
} from "../../api/graphqlClient";

export interface Note {
  id: string;
  title: string;
  content: string;
}

interface NotesState {
  list: Note[];
  activeNote?: Note | null;
  status: "idle" | "loading" | "failed";
}

const initialState: NotesState = {
  list: [],
  activeNote: null,
  status: "idle",
};

// ✅ Async Thunks
export const getNotes = createAsyncThunk("notes/getNotes", async () => {
  const response = await fetchNotes();
  return response.notes;
});

export const getNoteById = createAsyncThunk(
  "notes/getNoteById",
  async (noteId: string) => {
    const response = await fetchNoteById(noteId);
    return response.noteById;
  }
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async ({ title, content }: { title: string; content: string }) => {
    const response = await addNote(title, content);
    return response.addNote;
  }
);

export const editNote = createAsyncThunk(
  "notes/editNote",
  async ({
    noteId,
    title,
    content,
  }: {
    noteId: string;
    title: string;
    content: string;
  }) => {
    await updateNote(noteId, title, content);
    return { noteId, content };
  }
);

export const removeNote = createAsyncThunk(
  "notes/removeNote",
  async (noteId: string) => {
    await deleteNote(noteId);
    return noteId;
  }
);

// ✅ Redux Slice
const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setActiveNote(state, action: PayloadAction<string | null>) {
      state.activeNote =
        state.list.find((note) => note.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.activeNote = action.payload;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editNote.fulfilled, (state, action) => {
        const note = state.list.find((n) => n.id === action.payload.noteId);
        if (note) {
          note.content = action.payload.content;
        }
      })
      .addCase(removeNote.fulfilled, (state, action) => {
        state.list = state.list.filter((n) => n.id !== action.payload);
        if (state.activeNote?.id === action.payload) {
          state.activeNote = null;
        }
      });
  },
});

export const { setActiveNote } = notesSlice.actions;
export default notesSlice.reducer;

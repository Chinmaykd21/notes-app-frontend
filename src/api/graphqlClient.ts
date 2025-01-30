import { GraphQLClient, gql } from "graphql-request";
import { Note } from "../store/slices/notesSlice";

const client = new GraphQLClient("http://localhost:8000/graphql");

// ✅ Ensure title is included in queries
export const GET_NOTES = gql`
  query {
    notes {
      id
      title
      content
    }
  }
`;

export const GET_NOTE_BY_ID = gql`
  query GetNoteById($noteId: String!) {
    noteById(noteId: $noteId) {
      id
      title
      content
    }
  }
`;

export const ADD_NOTE = gql`
  mutation AddNote($title: String!, $content: String!) {
    addNote(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation UpdateNote($noteId: String!, $title: String!, $content: String!) {
    updateNote(noteId: $noteId, title: $title, content: $content)
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($noteId: String!) {
    deleteNote(noteId: $noteId)
  }
`;

export const fetchNotes = async (): Promise<{ notes: Note[] }> => {
  return client.request(GET_NOTES);
};

export const fetchNoteById = async (
  noteId: string
): Promise<{ noteById: Note }> => {
  return client.request(GET_NOTE_BY_ID, { noteId });
};

export const addNote = async (
  title: string,
  content: string
): Promise<{ addNote: Note }> => {
  return client.request(ADD_NOTE, { title, content });
};

export const updateNote = async (
  noteId: string,
  title: string,
  content: string
): Promise<{ updateNote: boolean }> => {
  return client.request(UPDATE_NOTE, { noteId, title, content });
};

export const deleteNote = async (
  noteId: string
): Promise<{ deleteNote: boolean }> => {
  return client.request(DELETE_NOTE, { noteId });
};

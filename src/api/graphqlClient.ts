import { GraphQLClient, gql } from "graphql-request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export interface Note {
  id: string;
  title: string;
  content: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API_URL = `${BACKEND_URL}/graphql`;
const client = new GraphQLClient(API_URL);

// Fetch notes query
export const useFetchNotes = () => {
  return useQuery<{ notes: Note[] }>({
    queryKey: ["notes"],
    queryFn: async () => {
      const data = await client.request<{ notes: Note[] }>(gql`
        query {
          notes {
            id
            title
            content
          }
        }
      `);

      return data;
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useFetchNoteById = (noteId: string, _p0: { enabled: boolean }) => {
  return useQuery<{ noteById: Note }>({
    queryKey: ["notes", noteId],
    queryFn: async (): Promise<{ noteById: Note }> => {
      const data = await client.request<{ noteById: Note }>(
        gql`
          query GetNoteById($noteId: String!) {
            noteById(noteId: $noteId) {
              id
              title
              content
            }
          }
        `,
        { noteId }
      );
      return data;
    },
    enabled: !!noteId, // ✅ Only fetch if `noteId` exists
  });
};

// ✅ Create Note Mutation
export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ title, content }: Omit<Note, "id">) => {
      const data = await client.request<{ addNote: Note }>(
        gql`
          mutation AddNote($title: String!, $content: String!) {
            addNote(title: $title, content: $content) {
              id
              title
              content
            }
          }
        `,
        { title, content }
      );
      return data.addNote;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};

// ✅ Update Note Mutation
export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, content }: Note) => {
      return client.request<{ updateNote: boolean }>(
        gql`
          mutation UpdateNote(
            $noteId: String!
            $title: String!
            $content: String!
          ) {
            updateNote(noteId: $noteId, title: $title, content: $content)
          }
        `,
        { noteId: id, title, content }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};

// ✅ Delete Note Mutation
export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      return client.request<{ deleteNote: boolean }>(
        gql`
          mutation DeleteNote($noteId: String!) {
            deleteNote(noteId: $noteId)
          }
        `,
        { noteId }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });
};

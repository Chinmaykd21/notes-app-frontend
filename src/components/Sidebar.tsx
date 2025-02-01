import { FC, Dispatch, SetStateAction, useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useFetchNotes, useFetchNoteById, Note } from "../api/graphqlClient";
import { WebSocketService, WS_URL } from "../utils/websocket";

const ws = WebSocketService.getInstance(WS_URL);

type SidebarProps = {
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

export const Sidebar: FC<SidebarProps> = ({ activeNote, setActiveNote }) => {
  const { data, isLoading } = useFetchNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);

  // ✅ Fetch selected note details when selectedNoteId changes
  const { data: noteData, isFetching } = useFetchNoteById(
    selectedNoteId ?? "",
    { enabled: !!selectedNoteId }
  );

  // ✅ Set active note when data is available (Avoid setting state inside render)
  useEffect(() => {
    if (noteData?.noteById && selectedNoteId === noteData.noteById.id) {
      setActiveNote(noteData.noteById);
      toast.dismiss();
      toast.success("Note loaded successfully!", { id: selectedNoteId });
      setSelectedNoteId(null); // ✅ Reset after loading
    }
  }, [noteData, selectedNoteId, setActiveNote]);

  // Set notes initially
  useEffect(() => {
    if (data?.notes) {
      setNotes(data.notes);
    }
  }, [data]);

  // ✅ Listen for WebSocket updates (real-time changes)
  useEffect(() => {
    ws.onMessage((message) => {
      if (message.type === "note_create") {
        // ✅ Add the new note to the list
        setNotes((prevNotes) => [message.note, ...prevNotes]);
      } else if (message.type === "note_update") {
        // ✅ Update the existing note
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === message.note.id ? message.note : note
          )
        );
      } else if (message.type === "note_delete") {
        // ✅ Remove the deleted note
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== message.noteId)
        );
      }
    });
  }, []);

  const handleLoadNote = (note: Note) => {
    if (activeNote?.id === note.id) return; // Prevent reloading the same note
    setSelectedNoteId(note.id); // ✅ Set note ID to trigger fetching
    toast.loading("Loading note...", { id: note.id });
  };

  if (isLoading)
    return (
      <div className="w-80 flex items-center justify-center border rounded-lg shadow-lg">
        Loading Notes...
      </div>
    );

  if (notes.length === 0) {
    return (
      <div className="w-80 flex items-center justify-center border rounded-lg shadow-lg">
        No Notes To Display
      </div>
    );
  }

  return (
    <div className="w-80 flex items-center justify-center border rounded-lg shadow-lg">
      <aside className="w-80 h-screen overflow-y-auto p-4">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 bg-white rounded shadow flex flex-col items-start w-full gap-5 ${
                activeNote?.id === note.id ? "border border-blue-500" : ""
              }`}
            >
              <div className="w-full space-x-2">
                <h4 className="font-medium truncate w-full" title={note.title}>
                  {note.title}
                </h4>
                <p className="text-gray-500 text-sm break-words">
                  {note.content.length > 70
                    ? note.content.substring(0, 70) + "..."
                    : note.content}
                </p>
              </div>
              <button
                className={`px-3 py-1 rounded w-full text-center transition-all ${
                  activeNote?.id === note.id
                    ? "bg-gray-300"
                    : isFetching && selectedNoteId === note.id
                    ? "bg-yellow-500 text-white cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-500"
                }`}
                onClick={() => handleLoadNote(note)}
                disabled={isFetching && selectedNoteId === note.id}
              >
                {isFetching && selectedNoteId === note.id
                  ? "Loading..."
                  : "Load"}
              </button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

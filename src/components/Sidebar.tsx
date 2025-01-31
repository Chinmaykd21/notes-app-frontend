import { Note } from "../store/slices/notesSlice";
import { FC, Dispatch, SetStateAction, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useFetchNotes, useFetchNoteById } from "../api/graphqlClient";

type SidebarProps = {
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

export const Sidebar: FC<SidebarProps> = ({ activeNote, setActiveNote }) => {
  const { data, isLoading } = useFetchNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // ✅ Fetch selected note details when selectedNoteId changes
  const { data: noteData, isFetching } = useFetchNoteById(
    selectedNoteId ?? "",
    {
      enabled: !!selectedNoteId, // ✅ Only fetch if `selectedNoteId` is set
    }
  );

  const handleLoadNote = (note: Note) => {
    if (activeNote?.id === note.id) return; // Prevent reloading the same note
    setSelectedNoteId(note.id); // ✅ Set note ID to trigger fetching

    toast.loading("Loading note...", { id: note.id });
  };

  // ✅ When noteData is available, update `activeNote`
  if (
    noteData &&
    noteData.noteById &&
    selectedNoteId === noteData.noteById.id
  ) {
    setActiveNote(noteData.noteById);
    toast.dismiss();
    toast.success("Note loaded successfully!", { id: selectedNoteId });
    setSelectedNoteId(null); // ✅ Reset selection after setting active note
  }

  if (isLoading)
    return <div className="flex justify-center">Loading Notes...</div>;

  if (!data || !data.notes || data.notes.length === 0) {
    return <div className="flex justify-center">No Notes To Display</div>;
  }

  return (
    <div className="w-80 flex items-center justify-center border rounded-lg shadow-lg">
      <aside className="w-80 h-screen overflow-y-auto p-4">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="space-y-2">
          {data.notes.map((note) => (
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

import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { getNoteById } from "../store/slices/notesSlice";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notes = useSelector((state: RootState) => state.notes.list);
  const activeNote = useSelector((state: RootState) => state.notes.activeNote);

  const [loadingNote, setLoadingNote] = useState<string | null>(null);

  const handleLoadNote = async (noteId: string) => {
    setLoadingNote(noteId);
    toast.loading("Note loaded successfully", { id: noteId });

    try {
      await dispatch(getNoteById(noteId));
      toast.success("Note loaded successfully!", { id: noteId });
    } catch (error) {
      toast.error("Failed to load note.");
      console.error("Failed to load note.", error);
    } finally {
      setLoadingNote(null);
    }
  };

  return (
    <aside className="w-80 h-screen overflow-y-auto p-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="space-y-2">
        {notes.length === 0 && (
          <div className="flex justify-center">No Notes To Display</div>
        )}
        {notes.length > 0 &&
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-white rounded shadow flex flex-col items-start w-full gap-5"
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
                    : loadingNote === note.id
                    ? "bg-yellow-500 text-white cursor-not-allowed"
                    : "bg-blue-400 text-white hover:bg-blue-500"
                }`}
                onClick={() => handleLoadNote(note.id)}
                disabled={loadingNote !== null}
              >
                {loadingNote === note.id ? "Loading..." : "Load"}
              </button>
            </div>
          ))}
      </div>
    </aside>
  );
};

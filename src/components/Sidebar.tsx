import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { getNoteById, Note } from "../store/slices/notesSlice";
import { FC, useState, Dispatch, SetStateAction } from "react";
import toast, { Toaster } from "react-hot-toast";

type SidebarProps = {
  notes: Note[];
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

export const Sidebar: FC<SidebarProps> = ({
  notes,
  activeNote,
  setActiveNote,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loadingNote, setLoadingNote] = useState<string | null>(null);

  const handleLoadNote = async (note: Note) => {
    setLoadingNote(note.id);
    toast.loading("Loading note...", { id: note.id });

    try {
      await dispatch(getNoteById(note.id)).unwrap();
      setActiveNote(note); // ✅ Ensure note loads into LeftSection
      toast.success("Note loaded successfully!", { id: note.id });
    } catch (error) {
      toast.error("Failed to load note.");
      console.error("Failed to load note.", error);
    } finally {
      setLoadingNote(null);
    }
  };

  return (
    <div className="w-80 flex items-center justify-center border rounded-lg shadow-lg">
      <aside className="w-80 h-screen overflow-y-auto p-4">
        <Toaster position="top-right" reverseOrder={false} />
        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="flex justify-center">No Notes To Display</div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className={`p-3 bg-white rounded shadow flex flex-col items-start w-full gap-5 ${
                  activeNote?.id === note.id ? "border border-blue-500" : ""
                }`}
              >
                <div className="w-full space-x-2">
                  <h4
                    className="font-medium truncate w-full"
                    title={note.title}
                  >
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
                  onClick={() => handleLoadNote(note)}
                  disabled={loadingNote !== null}
                >
                  {loadingNote === note.id ? "Loading..." : "Load"}
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};

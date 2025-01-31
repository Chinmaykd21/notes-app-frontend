import { useState, useEffect, FC, Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import {
  createNote,
  editNote,
  Note,
  removeNote,
} from "../store/slices/notesSlice";
import { AppDispatch } from "../store";
import toast, { Toaster } from "react-hot-toast";

type LeftSectionProps = {
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

export const LeftSection: FC<LeftSectionProps> = ({
  activeNote,
  setActiveNote,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [processing, setProcessing] = useState<
    "create" | "update" | "delete" | null
  >(null);

  // ✅ Detect when activeNote changes (for editing mode)
  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || "");
      setContent(activeNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeNote]);

  // ✅ Handle Creating a New Note
  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) return;

    setProcessing("create");
    try {
      await dispatch(createNote({ title, content })).unwrap();
      toast.success("Note created successfully!", { id: "create" });
      setActiveNote(null); // Reset after creating
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to create note: ", error);
      toast.error("Failed to create note", { id: "create" });
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Handle Updating an Existing Note
  const handleUpdateNote = async () => {
    if (activeNote && content.trim()) {
      setProcessing("update");
      toast.loading("Updating note...", { id: "update" });

      try {
        await dispatch(
          editNote({ noteId: activeNote.id, title, content })
        ).unwrap();
        toast.success("Note updated successfully!", { id: "update" });
      } catch (error) {
        console.error("Failed to update note.", error);
        toast.error("Failed to update note.", { id: "update" });
      } finally {
        setProcessing(null);
      }
    }
  };

  // ✅ Handle Deleting a Note
  const handleDeleteNote = async () => {
    if (!activeNote) return;

    setProcessing("delete");
    toast.loading("Deleting note...", { id: "delete" });

    try {
      await dispatch(removeNote(activeNote.id)).unwrap();
      toast.success("Note deleted successfully!", { id: "delete" });
      setActiveNote(null); // Clear activeNote after deletion
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to delete note.", error);
      toast.error("Failed to delete note.", { id: "delete" });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col border rounded-lg p-6 text-white shadow-lg">
      <Toaster position="top-right" reverseOrder={false} />

      {/* ✅ "New Note" button (only visible when NOT editing) */}
      {!activeNote && (
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          onClick={() => setActiveNote(null)}
        >
          New Note
        </button>
      )}

      {/* ✅ Form for Editing OR Creating */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded text-black"
        />
        <textarea
          placeholder="Enter note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="p-2 border rounded h-80 text-black"
        />

        <div className="flex gap-2">
          {/* ✅ If there's an active note, show update/delete buttons */}
          {activeNote ? (
            <>
              <button
                className={`flex-1 px-4 py-2 rounded shadow ${
                  processing === "update"
                    ? "bg-yellow-500 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
                onClick={handleUpdateNote}
                disabled={processing !== null}
              >
                {processing === "update" ? "Updating..." : "Update Note"}
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded ${
                  processing === "delete"
                    ? "bg-red-500 cursor-not-allowed"
                    : "bg-red-400 hover:bg-red-500"
                }`}
                onClick={handleDeleteNote}
                disabled={processing !== null}
              >
                {processing === "delete" ? "Deleting..." : "Delete Note"}
              </button>
            </>
          ) : (
            <>
              {/* ✅ If creating a new note, show Save & Cancel */}
              <button
                className={`flex-1 px-4 py-2 rounded shadow ${
                  processing === "create"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                onClick={handleCreateNote}
                disabled={processing !== null}
              >
                {processing === "create" ? "Saving..." : "Save Note"}
              </button>
              <button
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
                onClick={() => setActiveNote(null)} // Cancel new note creation
                disabled={processing !== null}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

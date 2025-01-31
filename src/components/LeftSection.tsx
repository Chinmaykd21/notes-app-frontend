import { useState } from "react";
import { Editor } from "./Editor";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { createNote } from "../store/slices/notesSlice";
import toast, { Toaster } from "react-hot-toast";

export const LeftSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    setIsSaving(true);
    try {
      await dispatch(
        createNote({ title: newNoteTitle, content: newNoteContent })
      );
      setIsCreating(false);
      setNewNoteTitle("");
      setNewNoteContent("");
      toast.success("Note created successfully", { id: "create" });
    } catch (error) {
      console.error("Failed to create the note: ", error);
      toast.error("Failed to create the note", { id: "create" });
    }
    setIsSaving(false);
  };

  return (
    <div className="flex-1 flex flex-col border rounded-lg p-6  text-white shadow-lg">
      <Toaster position="top-right" reverseOrder={false} />
      {/* ✅ "New Note" button sits above everything in the left section */}
      {!isCreating && (
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          onClick={() => setIsCreating(true)}
        >
          New Note
        </button>
      )}

      {/* ✅ Show form if creating a new note */}
      {isCreating ? (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter note title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="p-2 border rounded text-black"
          />
          <textarea
            placeholder="Enter note content"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="p-2 border rounded h-80 text-black"
          />
          <div className="flex gap-2">
            <button
              className={`flex-1 px-4 py-2 rounded shadow ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={handleCreateNote}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Note"}
            </button>
            <button
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
              onClick={() => setIsCreating(false)}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <Editor />
      )}
    </div>
  );
};

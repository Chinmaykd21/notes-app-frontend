import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editNote, removeNote } from "../store/slices/notesSlice";
import { RootState, AppDispatch } from "../store";
import toast, { Toaster } from "react-hot-toast";

export const Editor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeNote = useSelector((state: RootState) => state.notes.activeNote);

  const [localTitle, setLocalTitle] = useState<string>("");
  const [localContent, setLocalContent] = useState<string>("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (activeNote) {
      setLocalTitle(activeNote.title || "");
      setLocalContent(activeNote.content || "");
    }
  }, [activeNote]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(event.target.value);
  };

  const handleUpdateNote = async () => {
    if (activeNote && localContent.trim()) {
      setProcessing("update");
      toast.loading("Updating note...", { id: "update" });

      try {
        await dispatch(
          editNote({
            noteId: activeNote.id,
            title: localTitle,
            content: localContent,
          })
        ).unwrap();
        toast.success("Note updated successfully!", { id: "update" });
      } catch (error) {
        console.error("Failed to update note. ", error);
        toast.error("Failed to update note. Please try again.");
      } finally {
        setProcessing(null);
      }
    }
  };

  const handleDeleteNote = async () => {
    if (activeNote) {
      setProcessing("delete");
      toast.loading("Deleting note...", { id: "delete" });

      try {
        await dispatch(removeNote(activeNote.id)).unwrap();
        toast.success("Note deleted successfully!", { id: "delete" });
      } catch (error) {
        console.error("Failed to delete note. ", error);
        toast.error("Failed to delete note. Please try again.");
      } finally {
        setProcessing(null);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      <Toaster position="top-right" reverseOrder={false} />
      {activeNote ? (
        <>
          <input
            type="text"
            className="w-full p-2 border rounded text-black"
            value={localTitle}
            onChange={handleTitleChange}
          />
          <textarea
            className="w-full h-full p-4 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            value={localContent}
            onChange={handleContentChange}
          />
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleUpdateNote}
              className={`px-4 py-2 rounded ${
                processing === "update"
                  ? "bg-yellow-500 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500"
              }`}
              disabled={processing !== null}
            >
              {processing === "update" ? "Updating..." : "Update Note"}
            </button>
            <button
              onClick={handleDeleteNote}
              className={`px-4 py-2 rounded ${
                processing === "delete"
                  ? "bg-red-500 cursor-not-allowed"
                  : "bg-red-400 hover:bg-red-500"
              }`}
              disabled={processing !== null}
            >
              {processing === "delete" ? "Deleting..." : "Delete Note"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-3xl">
          Load or create a note to get started.
        </div>
      )}
    </div>
  );
};

import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editNote, removeNote } from "../store/slices/notesSlice";
import { RootState, AppDispatch } from "../store";

export const Editor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activeNote = useSelector((state: RootState) => state.notes.activeNote);

  const [localTitle, setLocalTitle] = useState("");
  const [localContent, setLocalContent] = useState("");
  const [message, setMessage] = useState("");

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
      try {
        await dispatch(
          editNote({
            noteId: activeNote.id,
            title: localTitle,
            content: localContent,
          })
        ).unwrap();
        setMessage("Note updated successfully!");
      } catch (error) {
        console.error("Failed to update note. ", error);
        setMessage("Failed to update note. Please try again.");
      }
    }
  };

  const handleDeleteNote = async () => {
    if (activeNote) {
      try {
        await dispatch(removeNote(activeNote.id)).unwrap();
        setMessage("Note deleted successfully!");
      } catch (error) {
        console.error("Failed to delete note. ", error);
        setMessage("Failed to delete note. Please try again.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
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
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Update Note
            </button>
            <button
              onClick={handleDeleteNote}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete Note
            </button>
          </div>
          {message && (
            <p className="mt-2 text-center text-green-600">{message}</p>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 text-3xl">
          Load or create a note to get started.
        </div>
      )}
    </div>
  );
};

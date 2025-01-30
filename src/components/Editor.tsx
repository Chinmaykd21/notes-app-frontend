import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContent, editNote, removeNote } from "../store/slices/notesSlice";
import { RootState, AppDispatch } from "../store";

export const Editor = () => {
  const dispatch = useDispatch<AppDispatch>();
  const content = useSelector(
    (state: RootState) => state.notes.activeNote?.content
  );
  const activeNote = useSelector((state: RootState) => state.notes.activeNote);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNote) {
      dispatch(
        setContent({ noteId: activeNote.id, content: event.target.value })
      );
    }
  };

  const handleUpdateNote = () => {
    if (activeNote && content?.trim()) {
      dispatch(
        editNote({
          noteId: activeNote.id,
          title: activeNote.title,
          content: activeNote.content,
        })
      );
    }
  };

  const handleDeleteNote = () => {
    if (activeNote) {
      dispatch(removeNote(activeNote.id));
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6">
      {activeNote ? (
        <>
          <h2 className="text-xl font-bold mb-4">{activeNote.title}</h2>
          <textarea
            className="w-full h-full p-4 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={handleInputChange}
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
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Load or create a note to get started.
        </div>
      )}
    </div>
  );
};

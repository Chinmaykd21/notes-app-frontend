import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { getNoteById } from "../store/slices/notesSlice";

export const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notes = useSelector((state: RootState) => state.notes.list);
  const activeNote = useSelector((state: RootState) => state.notes.activeNote);
  return (
    <aside className="w-80 h-screen overflow-y-auto p-4 bg-blue-100 border-l">
      <h3 className="text-lg font-semibold mb-4">Notes</h3>
      <div className="space-y-2">
        {notes.length === 0 && (
          <div className="flex justify-center">No Notes To Display</div>
        )}
        {notes.length > 0 &&
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-white rounded shadow flex justify-between items-center"
            >
              <div>
                <h4 className="font-medium">{note.title}</h4>
                <p className="text-gray-500 text-sm truncate">
                  {note.content.substring(0, 40)}...
                </p>
              </div>
              <button
                className={`px-3 py-1 rounded ${
                  activeNote?.id === note.id
                    ? "bg-gray-300"
                    : "bg-blue-400 text-white"
                }`}
                onClick={() => dispatch(getNoteById(note.id))}
                disabled={activeNote?.id === note.id}
              >
                Load
              </button>
            </div>
          ))}
      </div>
    </aside>
  );
};

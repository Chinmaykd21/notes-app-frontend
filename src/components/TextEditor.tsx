import { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContent, setSelectedText } from "../store/notesSlice"; // Import the action to update the note content in Redux state
import { RootState } from "../store";

export const TextEditor = () => {
  // Dispatch function to trigger redux actions
  const dispatch = useDispatch();
  // Selector to fetch current content from Redux store
  const content = useSelector((state: RootState) => state.notes.content);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const updateContent = event.target.value;

    // Dispatch the setContent action to update redux state
    dispatch(setContent(updateContent));
  };

  const handleTextSelect = () => {
    const selectedText = window.getSelection()?.toString();
    dispatch(setSelectedText(selectedText));
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Text Editor</h2>
      <textarea
        className="w-full h-40 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={content}
        onChange={handleInputChange}
        onMouseUp={handleTextSelect}
        placeholder="Write your notes here..."
      />
    </div>
  );
};

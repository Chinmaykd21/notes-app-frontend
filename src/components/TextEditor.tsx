import { RootState } from "../store"; // Import RootState type to strongly type the state selector
import { ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setContent } from "../store/notesSlice"; // Import the action to update the note content in Redux state
import { WebSocketService } from "../utils/websocket";

const ws = new WebSocketService();

export const TextEditor = () => {
  // Selector to fetch the current content from redux store
  const content = useSelector((state: RootState) => state.notes.content);

  // Dispatch function to trigger redux actions
  const dispatch = useDispatch();

  useEffect(() => {
    ws.connect();

    ws.onMessage((data) => {
      if (data.type === "update") {
        dispatch(setContent(data.content));
      }
    });

    return () => {
      ws.disconnect(); // send disconnect signal
    };
  }, [dispatch]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const updateContent = event.target.value;
    // Dispatch the setContent action to update redux state
    dispatch(setContent(updateContent));
    ws.send({ type: "update", content: updateContent }); // send updates to the websocket
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto mt-10 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Text Editor</h2>
      <textarea
        className="w-full h-40 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={content}
        onChange={handleChange}
        placeholder="Start typing here..."
      />
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("bold clicked")}
        >
          Bold
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => alert("italic clicked")}
        >
          Italic
        </button>
      </div>
    </div>
  );
};

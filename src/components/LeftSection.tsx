import { useState, useEffect, FC, Dispatch, SetStateAction } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Note,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "../api/graphqlClient";
import { WebSocketService, WS_URL } from "../utils/websocket";

const ws = WebSocketService.getInstance(WS_URL);

type LeftSectionProps = {
  activeNote: Note | null;
  setActiveNote: Dispatch<SetStateAction<Note | null>>;
};

export const LeftSection: FC<LeftSectionProps> = ({
  activeNote,
  setActiveNote,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [processing, setProcessing] = useState<
    "create" | "update" | "delete" | null
  >(null);

  // ✅ Sync title and content with the active note
  useEffect(() => {
    ws.onMessage((message) => {
      if (
        message.type === "note_update" &&
        activeNote?.id === message.note.id
      ) {
        console.log("📩 WebSocket Update Received:", message);
        setTitle(message.note.title);
        setContent(message.note.content);
      }
    });

    if (activeNote) {
      setTitle(activeNote.title || "");
      setContent(activeNote.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [activeNote]);

  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  // ✅ Handle Updating a Note
  const handleUpdateNote = async () => {
    if (!activeNote) return;
    setProcessing("update");

    try {
      await updateNote.mutateAsync({ id: activeNote.id, title, content });

      // Send update over WebSocket
      ws.send({
        type: "note_update",
        note: { id: activeNote.id, title, content },
      });

      toast.success("Note updated successfully!", { id: "update" });
    } catch (error) {
      console.error("Failed to update note.", error);
      toast.error("Failed to update note.", { id: "update" });
    } finally {
      setProcessing(null);
    }
  };

  let autoSaveId: ReturnType<typeof setTimeout>;

  const performAutoSave = () => {
    clearTimeout(autoSaveId);
    autoSaveId = setTimeout(() => {
      handleUpdateNote();
    }, 2000);
  };

  // ✅ Handle Creating a New Note
  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setProcessing("create");

    try {
      const newNote = await createNote.mutateAsync({ title, content });

      // Send update via WebSocket
      ws.send({
        type: "note_create",
        note: newNote,
      });

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

  // ✅ Handle Deleting a Note
  const handleDeleteNote = async () => {
    if (!activeNote) return;
    setProcessing("delete");

    try {
      await deleteNote.mutateAsync(activeNote.id);

      // Send update over WebSocket
      ws.send({
        type: "note_delete",
        noteId: activeNote.id,
      });

      toast.success("Note deleted successfully!", { id: "delete" });
      setActiveNote(null); // Clear after delete
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
    <div className="flex-1 flex flex-col border rounded-lg p-6">
      <Toaster position="top-right" reverseOrder={false} />

      {activeNote && (
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
          onClick={() => setActiveNote(null)}
        >
          New Note
        </button>
      )}

      {/* ✅ Form for Editing OR Creating */}
      <div className="flex flex-col gap-4 h-full">
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            performAutoSave();
          }}
          className="p-2 border rounded text-black"
        />
        <textarea
          placeholder="Enter note content"
          value={content}
          onChange={(e) => {
            setTitle(e.target.value);
            performAutoSave();
          }}
          className="p-2 border rounded text-black h-full"
        />

        <div className="flex gap-2">
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
                onClick={() => setActiveNote(null)}
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

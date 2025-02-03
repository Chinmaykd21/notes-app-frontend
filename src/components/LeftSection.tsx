import {
  useState,
  useEffect,
  FC,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Note,
  useCreateNote,
  useDeleteNote,
  useUpdateNote,
} from "../api/graphqlClient";
import { WebSocketService, WS_URL } from "../utils/websocket";
import { debounce } from "lodash";
import { LeftSectionHeader } from "./LeftSectionHeader";
import { generateGuestUsername } from "../utils/userUtils";

const username = generateGuestUsername();
const ws = WebSocketService.getInstance(username, WS_URL);

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

  // ✅ Sync title and content with the active note (WebSocket messages should NOT override typing)
  useEffect(() => {
    ws.onMessage((message) => {
      if (
        message.type === "note_update" &&
        activeNote?.id === message.note.id
      ) {
        setTitle((prev) =>
          prev === message.note.title ? prev : message.note.title
        );
        setContent((prev) =>
          prev === message.note.content ? prev : message.note.content
        );
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

  const updateNote = useUpdateNote();

  const debouncedAutoSave = useRef(
    debounce(async (noteId, title, content) => {
      if (!noteId) return;
      console.log("💾 Auto-saving note..."); // ✅ Should now log

      await updateNote.mutateAsync({ id: noteId, title, content });

      ws.send({
        type: "note_update",
        note: { id: noteId, title, content },
      });

      toast.success("Auto-saved!", { id: "autosave" });
    }, 2000) // ✅ Triggers after 2 seconds
  ).current;

  // ✅ Cleanup debounce when component unmounts
  useEffect(() => {
    return () => {
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  const createNote = useCreateNote();
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

  // ✅ Handle User Input With Auto-Save
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (activeNote) debouncedAutoSave(activeNote.id, e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (activeNote) debouncedAutoSave(activeNote.id, title, e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col border rounded-lg p-6">
      <Toaster position="top-right" reverseOrder={false} />

      <LeftSectionHeader />

      {/* ✅ Form for Editing OR Creating */}
      <div className="flex flex-col gap-4 h-full">
        <input
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={handleTitleChange}
          className="p-2 border rounded text-black"
        />
        <textarea
          placeholder="Enter note content"
          value={content}
          onChange={handleContentChange}
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

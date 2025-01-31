import { useSelector } from "react-redux";
import { LeftSection } from "./components/LeftSection";
import { Navigation } from "./components/Navigation";
import { RootState } from "./store";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Note } from "./store/slices/notesSlice";

function App() {
  const notes = useSelector((state: RootState) => state.notes.list);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  return (
    <div className="min-h-screen flex flex-col p-10">
      <Navigation title="Real-Time Collaborative Notes Application" />
      <div className="flex flex-1 gap-6">
        <LeftSection activeNote={activeNote} setActiveNote={setActiveNote} />
        {/* Divider */}
        <div className="w-[3px] bg-gray-300 rounded"></div>
        <Sidebar
          notes={notes}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
        />
      </div>
    </div>
  );
}

export default App;

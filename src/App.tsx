import { LeftSection } from "./components/LeftSection";
import { Navigation } from "./components/Navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Note } from "./api/graphqlClient";
import { WebSocketService } from "./utils/websocket";

function App() {
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  useEffect(() => {
    const ws = new WebSocketService();

    ws.connect();

    return () => ws.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-10">
      <Navigation title="Real-Time Collaborative Notes Application" />
      <div className="flex flex-1 gap-6">
        <LeftSection activeNote={activeNote} setActiveNote={setActiveNote} />
        {/* Divider */}
        <div className="w-[3px] bg-gray-300 rounded"></div>
        <Sidebar activeNote={activeNote} setActiveNote={setActiveNote} />
      </div>
    </div>
  );
}

export default App;

import "./App.css";
import { KeepBackEndAlive } from "./components/KeepBackEndAlive";
import { TextEditor } from "./components/TextEditor";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <KeepBackEndAlive />
      <TextEditor />
    </div>
  );
}

export default App;

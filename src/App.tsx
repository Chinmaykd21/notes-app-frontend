import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";

function App() {
  return (
    <div className="min-h-screen flex flex-col p-10">
      {/* Top Navigation - App Title */}
      <header className="w-full p-4 bg-gray-200 shadow text-center text-xl font-bold">
        Notes Application
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 mt-10 gap-y-10">
        {/* Left Section - Active Note Editor */}
        <div className="flex-1 bg-black">
          <Editor />
        </div>

        {/* Right Section - Sticky Notes Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}

export default App;

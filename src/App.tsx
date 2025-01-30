import { Sidebar } from "./components/Sidebar";
import { Editor } from "./components/Editor";

function App() {
  return (
    <div className="min-h-screen flex flex-col p-10">
      {/* Top Navigation - App Title */}
      <header className="w-full p-4 bg-gray-200 shadow text-xl font-bold mb-5">
        Notes Application
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 gap-6">
        {" "}
        {/* Added padding and gap between sections */}
        {/* Left Section - Active Note Editor */}
        <div className="flex-1 flex items-center justify-center border rounded-lg p-6 text-white shadow-lg">
          <Editor />
        </div>
        {/* Divider */}
        <div className="w-[3px] bg-gray-300 rounded"></div>
        {/* Right Section - Sticky Notes Sidebar */}
        <div className="w-80 flex items-center justify-center border rounded-lg p-6 shadow-lg">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}

export default App;

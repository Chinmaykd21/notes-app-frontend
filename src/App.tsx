import { LeftSection } from "./components/LeftSection";
import { Navigation } from "./components/Navigation";
import { RightSection } from "./components/RightSection";

function App() {
  return (
    <div className="min-h-screen flex flex-col p-10">
      {/* Top Navigation - App Title */}
      <Navigation title="Real-Time Collaborative Notes Application" />

      {/* Main Content Layout */}
      <div className="flex flex-1 gap-6">
        <LeftSection />
        {/* Divider */}
        <div className="w-[3px] bg-gray-300 rounded"></div>
        <RightSection />
      </div>
    </div>
  );
}

export default App;

import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CodeEditor from "./components/CodeEditor";
import Results from "./components/Results";
import { mockScanResult } from "./data/mockResults";

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  function scrollToScan() {
    document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleScan() {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header onStartScanning={scrollToScan} />
      <Hero onStartScanning={scrollToScan} />
      <CodeEditor onScan={handleScan} isScanning={isScanning} />
      {showResults && <Results result={mockScanResult} />}
      <footer
        id="footer"
        className="border-t border-border py-8 text-center text-xs text-text-muted"
      >
        Built with React + TypeScript + Tailwind CSS
      </footer>
    </div>
  );
}
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import CodeEditor from "./components/CodeEditor";
import Results from "./components/Results";
import type {
  AnalyzeResponseBody,
  ScanResult,
  SupportedLanguage,
  Vulnerability,
} from "./types";
import { groupVulnerabilities } from "./utils/groupVulnerabilities";

const API_URL = "http://localhost:3001/api/analyze";

function toScanResult(data: AnalyzeResponseBody, language: SupportedLanguage, code: string, fileName = "submitted-code"): ScanResult {
  const vulnerabilities = groupVulnerabilities(data.vulnerabilities.map((v, i): Vulnerability => ({
    ...v,
    id: `vuln-${i}`,
    language,
  })));

  return {
    summary: {
      securityScore: data.securityScore,
      riskStatus: data.riskStatus,
      vulnerabilitiesFound: vulnerabilities.length,
      highSeverity: vulnerabilities.filter(
        (v) => v.severity === "Very High" || v.severity === "High"
      ).length,
      mediumSeverity: vulnerabilities.filter((v) => v.severity === "Medium").length,
      lowSeverity: vulnerabilities.filter((v) => v.severity === "Low").length,
      scannedFileName: vulnerabilities[0]?.fileName ?? fileName,
      scannedLanguage: language,
      linesScanned: data.linesScanned ?? code.split("\n").length,
      scanDurationMs: 0,
      checksReviewed: data.coverage.length,
      checksNeedContext: data.coverage.filter((check) => check.status === "needs_context").length,
    },
    vulnerabilities,
    analysisLenses: data.analysisLenses,
  };
}

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function scrollToScan() {
    document.getElementById("scan")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleScan(language: SupportedLanguage, code: string) {
    setIsScanning(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      if (!res.ok) throw new Error("Scan failed. Please try again.");

      const data: AnalyzeResponseBody = await res.json();
      setResult(toScanResult(data, language, code));

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Couldn't reach the scanning service. Is the backend running?");
    } finally {
      setIsScanning(false);
    }
  }

  async function handleArchiveUpload(file: File) {
    setIsScanning(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("archive", file);
      const res = await fetch(`${API_URL}/archive`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Archive scan failed. Please try again.");

      setResult(toScanResult(data as AnalyzeResponseBody, "TypeScript", "", file.name));
      setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the scanning service. Is the backend running?");
    } finally {
      setIsScanning(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header onStartScanning={scrollToScan} />
      <Hero onStartScanning={scrollToScan} />
      <CodeEditor onScan={handleScan} onUpload={handleArchiveUpload} isScanning={isScanning} error={error} />
      {result && <Results result={result} />}
      <footer
        id="footer"
        className="border-t border-border py-8 text-center text-xs text-text-muted"
      >
      </footer>
    </div>
  );
}

export type Severity = "Very High" | "High" | "Medium" | "Low";

export type SupportedLanguage =
  | "JavaScript"
  | "TypeScript"
  | "Python"
  | "Java"
  | "C++";

export interface Vulnerability {
  id: string;
  name: string;
  severity: Severity;
  fileName: string;
  lineNumber: number;
  owaspCategory: string;
  language: SupportedLanguage;
  description: string;
  whyItMatters: string;
  recommendedFix: string;
  codeBefore: string;
  codeAfter: string;
}

export interface ScanSummary {
  securityScore: number;
  riskStatus: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
  vulnerabilitiesFound: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
  scannedFileName: string;
  scannedLanguage: SupportedLanguage;
  linesScanned: number;
  scanDurationMs: number;
}

export interface ScanResult {
  summary: ScanSummary;
  vulnerabilities: Vulnerability[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface SidebarFilters {
  severities: Severity[];
  languages: SupportedLanguage[];
  owaspCategories: string[];
}

export interface AnalyzeRequestBody {
  language: string;
  code: string;
}

export interface BackendVulnerability {
  name: string;
  severity: Severity;
  fileName: string;
  lineNumber: number;
  owaspCategory: string;
  description: string;
  whyItMatters: string;
  recommendedFix: string;
  codeBefore: string;
  codeAfter: string;
}

export interface AnalyzeResponseBody {
  securityScore: number;
  riskStatus: ScanSummary["riskStatus"];
  vulnerabilities: BackendVulnerability[];
  scannedFiles?: number;
  linesScanned?: number;
}

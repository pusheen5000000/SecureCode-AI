export interface AnalyzeRequestBody {
  language: string;
  code: string;
}

export interface Vulnerability {
  name: string;
  severity: "Very High" | "High" | "Medium" | "Low";
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
  riskStatus: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
  vulnerabilities: Vulnerability[];
}

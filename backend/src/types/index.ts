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

export type CoverageStatus = "affected" | "not_affected" | "not_applicable" | "needs_context";

export interface SecurityCheckCoverage {
  checkId: string;
  status: CoverageStatus;
  rationale: string;
}

export type AnalysisLensId =
  | "cross_boundary_flow"
  | "business_logic_context"
  | "exploitability_without_execution"
  | "patch_safety";

export type AnalysisLensStatus = "identified" | "assessed" | "needs_context" | "not_applicable";

/**
 * Auditable evidence for the four analysis modes that compensate for common
 * SAST and agentic-security blind spots. These are analysis claims, not proof
 * that an exploit was executed or a patch was deployed.
 */
export interface AnalysisLensResult {
  lensId: AnalysisLensId;
  status: AnalysisLensStatus;
  evidence: string;
  limitation: string;
  recommendedNextStep: string;
}

export interface AnalyzeResponseBody {
  securityScore: number;
  riskStatus: "Low Risk" | "Moderate Risk" | "High Risk" | "Critical Risk";
  vulnerabilities: Vulnerability[];
  coverage: SecurityCheckCoverage[];
  analysisLenses: AnalysisLensResult[];
}

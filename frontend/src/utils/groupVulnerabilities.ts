import type { Vulnerability } from "../types";

const severityRank = {
  "Very High": 4,
  High: 3,
  Medium: 2,
  Low: 1,
} as const;

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * A scanner can describe the same vulnerable statement under several rule
 * names. Keep that single root cause in one card while leaving distinct
 * vulnerable locations visible as separate findings.
 */
export function groupVulnerabilities(findings: Vulnerability[]): Vulnerability[] {
  const groups = new Map<string, Vulnerability[]>();

  for (const finding of findings) {
    const file = normalize(finding.fileName);
    const code = normalize(finding.codeBefore);
    const key = code ? `${file}|${code}` : `${file}|${finding.lineNumber}|${normalize(finding.owaspCategory)}`;
    const group = groups.get(key) ?? [];
    group.push(finding);
    groups.set(key, group);
  }

  return [...groups.values()].map((group) => {
    const representative = group.reduce((best, finding) =>
      severityRank[finding.severity] > severityRank[best.severity] ? finding : best
    );

    return {
      ...representative,
      groupedFindingCount: group.length,
    };
  });
}

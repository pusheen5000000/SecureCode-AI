export type ScanDepth = "surface" | "deep";

export interface ScanTarget {
  fileName: string;
  language: string;
  source: string;
}

export interface ScanPlanEntry {
  fileName: string;
  depth: ScanDepth;
  score: number;
  reasons: string[];
}

export interface ScanPlan {
  defaultDepth: ScanDepth;
  entries: ScanPlanEntry[];
}

const DEEP_PATH_SIGNALS = [
  /(^|\/)(api|routes?|controllers?|handlers?|middleware|auth|identity|admin|account|user|payment|billing|webhook|upload|graphql)(\/|$)/i,
  /(server|handler|controller|middleware|auth|route|api|payment|upload|webhook)/i,
];
const CONFIG_PATH_SIGNAL = /(^|\/)(\.github\/workflows|config|configs|infra|deploy)(\/|$)|(^|\/)(package(?:-lock)?\.json|dockerfile|docker-compose|requirements\.txt|pom\.xml|go\.mod|cargo\.toml)$/i;
const TEST_PATH_SIGNAL = /(^|\/)(__tests__|test|tests|spec)(\/|$)|\.(test|spec)\.[^.]+$/i;
const INPUT_SIGNAL = /\b(req\.(?:body|params|query|headers|cookies)|request\.(?:args|form|json|data|headers)|ctx\.(?:request|params)|argv|process\.env|input\s*\()/i;
const SINK_SIGNAL = /\b(eval|exec|spawn|execFile|system|popen|child_process|query|execute|raw|deserialize|unserialize|pickle\.loads|yaml\.load|innerHTML|dangerouslySetInnerHTML|redirect|sendFile)\s*\(/i;
const AUTH_SIGNAL = /\b(authori[sz]e|authenticat|permission|role|isAdmin|owner(?:Id)?|tenant|session|jwt|token|csrf)\b/i;
const NETWORK_SIGNAL = /\b(fetch|axios|requests\.|http\.(?:get|request)|https?:\/\/|webhook)\b/i;
const NATIVE_SIGNAL = /\b(strcpy|strcat|sprintf|gets|memcpy|malloc|free|unsafe\b|transmute)\b/i;

/**
 * Pure, order-independent routing. Scores intentionally use fixed signals so
 * repeated scans of the same submitted code always choose the same depth.
 */
export function buildDeterministicScanPlan(targets: ScanTarget[]): ScanPlan {
  const entries = targets
    .map((target) => planTarget(target))
    .sort((a, b) => b.score - a.score || a.fileName.localeCompare(b.fileName));

  return {
    defaultDepth: entries.some((entry) => entry.depth === "deep") ? "deep" : "surface",
    entries,
  };
}

function planTarget(target: ScanTarget): ScanPlanEntry {
  const reasons: string[] = [];
  let score = 0;
  const text = target.source;

  if (DEEP_PATH_SIGNALS.some((signal) => signal.test(target.fileName))) {
    score += 3;
    reasons.push("security-sensitive entry-point or domain path");
  }
  if (INPUT_SIGNAL.test(text)) {
    score += 2;
    reasons.push("untrusted-input source");
  }
  if (SINK_SIGNAL.test(text)) {
    score += 3;
    reasons.push("security-sensitive sink");
  }
  if (AUTH_SIGNAL.test(text)) {
    score += 2;
    reasons.push("authorization or session logic");
  }
  if (NETWORK_SIGNAL.test(text)) {
    score += 1;
    reasons.push("outbound network or webhook behavior");
  }
  if (NATIVE_SIGNAL.test(text)) {
    score += 3;
    reasons.push("native memory-safety operation");
  }
  if (CONFIG_PATH_SIGNAL.test(target.fileName)) {
    score += 1;
    reasons.push("deployment or dependency configuration");
  }
  if (TEST_PATH_SIGNAL.test(target.fileName)) {
    score = Math.max(0, score - 2);
    reasons.push("test-only path lowers priority");
  }

  const depth: ScanDepth = score >= 4 || (INPUT_SIGNAL.test(text) && SINK_SIGNAL.test(text))
    ? "deep"
    : "surface";
  return { fileName: target.fileName, depth, score, reasons: reasons.length ? reasons : ["no high-risk deterministic signals"] };
}

export function formatScanPlanForPrompt(plan: ScanPlan): string {
  const entries = plan.entries
    .map((entry) => `- ${entry.fileName}: ${entry.depth.toUpperCase()} (score ${entry.score}; ${entry.reasons.join(", ")})`)
    .join("\n");

  return `\n\nDeterministic scan-routing plan (generated locally; follow it and do not reinterpret it):
${entries}

For every SURFACE target, act first as a deterministic parser: inspect syntax, dangerous APIs, insecure configuration, dependency, and local source-to-sink patterns. Report a cross-file concern only when the supplied code directly supports it; otherwise use needs_context.
For every DEEP target, retain its related supplied context and perform the existing cross-boundary, business-logic, exploitability-without-execution, and patch-safety analysis. Trace named sources, transformations, guards, and sinks across files when the evidence is present.
The routing level controls analysis effort, not reporting standards: apply the full mandatory checklist and return all four required analysis lenses for the complete submission. Never execute code, write a PoC, or treat a missing PoC as a pass.`;
}

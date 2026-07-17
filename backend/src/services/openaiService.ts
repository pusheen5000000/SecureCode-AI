import OpenAI from "openai";
import { buildSecurityPrompt } from "../prompts/securityPrompt";
import type { AnalysisLensId, AnalyzeResponseBody } from "../types";
import { SECURITY_CHECKS } from "../securityCatalog";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
const MODEL = process.env.OPENAI_MODEL || "llama-3.3-70b-versatile";

export async function analyzeCodeWithAI(
  language: string,
  code: string
): Promise<AnalyzeResponseBody> {
  const prompt = buildSecurityPrompt(language, code);

  const completion = await client.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You are a security analysis engine. Respond with JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from AI model");

  let parsed: AnalyzeResponseBody;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  validateCoverage(parsed);
  validateAnalysisLenses(parsed);

  return parsed;
}

function validateAnalysisLenses(result: AnalyzeResponseBody): void {
  if (!Array.isArray(result.analysisLenses)) {
    throw new Error("AI response did not include required analysis lenses");
  }

  const expected = new Set<AnalysisLensId>([
    "cross_boundary_flow",
    "business_logic_context",
    "exploitability_without_execution",
    "patch_safety",
  ]);
  const validStatuses = new Set(["identified", "assessed", "needs_context", "not_applicable"]);
  const received = new Set(result.analysisLenses.map((lens) => lens.lensId));
  const invalid = result.analysisLenses.some(
    (lens) =>
      !expected.has(lens.lensId) ||
      !validStatuses.has(lens.status) ||
      !lens.evidence?.trim() ||
      !lens.limitation?.trim() ||
      !lens.recommendedNextStep?.trim()
  );

  if (
    invalid ||
    result.analysisLenses.length !== expected.size ||
    received.size !== expected.size ||
    [...expected].some((id) => !received.has(id))
  ) {
    throw new Error("AI response did not account for every required analysis lens");
  }
}

function validateCoverage(result: AnalyzeResponseBody): void {
  if (!Array.isArray(result.coverage)) {
    throw new Error("AI response did not include mandatory scan coverage");
  }

  const expected = new Set(SECURITY_CHECKS.map((check) => check.id));
  const received = new Set(result.coverage.map((coverage) => coverage.checkId));
  const validStatuses = new Set(["affected", "not_affected", "not_applicable", "needs_context"]);
  const invalid = result.coverage.some(
    (coverage) => !expected.has(coverage.checkId) || !validStatuses.has(coverage.status) || !coverage.rationale?.trim()
  );

  if (
    invalid ||
    result.coverage.length !== expected.size ||
    received.size !== expected.size ||
    [...expected].some((id) => !received.has(id))
  ) {
    throw new Error("AI response did not account for every mandatory security check");
  }
}

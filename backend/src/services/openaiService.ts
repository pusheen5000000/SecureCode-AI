import OpenAI from "openai";
import { buildSecurityPrompt } from "../prompts/securityPrompt";
import type { AnalyzeResponseBody } from "../types";

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

  return parsed;
}
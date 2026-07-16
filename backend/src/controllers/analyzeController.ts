import type { Request, Response } from "express";
import { analyzeCodeWithAI } from "../services/openaiService";
import type { AnalyzeRequestBody } from "../types";

export async function analyzeController(req: Request, res: Response) {
  const { language, code } = req.body as AnalyzeRequestBody;

  if (!language || typeof language !== "string") {
    return res.status(400).json({ error: "language is required" });
  }
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return res.status(400).json({ error: "code is required" });
  }

  try {
    const result = await analyzeCodeWithAI(language, code);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(502).json({ error: "AI analysis failed" });
  }
}

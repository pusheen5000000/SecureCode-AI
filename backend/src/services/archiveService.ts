import AdmZip from "adm-zip";
import { analyzeCodeWithAI } from "./openaiService";
import type { AnalyzeResponseBody } from "../types";

const MAX_FILES = 25;
const MAX_FILE_BYTES = 100_000;
const MAX_TOTAL_BYTES = 1_000_000;

const languageForFile = (fileName: string): string | null => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "mjs":
    case "cjs":
      return "JavaScript";
    case "ts":
    case "tsx":
      return "TypeScript";
    case "py":
      return "Python";
    case "java":
      return "Java";
    case "cpp":
    case "cxx":
    case "cc":
    case "c":
      return "C++";
    default:
      return null;
  }
};

export interface ArchiveAnalysis extends AnalyzeResponseBody {
  scannedFiles: number;
  linesScanned: number;
}

export async function analyzeArchive(buffer: Buffer): Promise<ArchiveAnalysis> {
  const zip = new AdmZip(buffer);
  let totalBytes = 0;
  let linesScanned = 0;
  const files: string[] = [];

  for (const entry of zip.getEntries()) {
    const fileName = entry.entryName.replace(/\\/g, "/");
    const language = languageForFile(fileName);
    const isIgnored = /(^|\/)(node_modules|\.git|dist|build)(\/|$)/.test(fileName);

    if (entry.isDirectory || !language || isIgnored) continue;
    if (fileName.startsWith("/") || fileName.includes("../")) continue;
    if (entry.header.size > MAX_FILE_BYTES) continue;
    if (files.length >= MAX_FILES || totalBytes + entry.header.size > MAX_TOTAL_BYTES) break;

    const source = entry.getData().toString("utf8");
    totalBytes += Buffer.byteLength(source, "utf8");
    linesScanned += source.split("\n").length;
    files.push(`File: ${fileName}\nLanguage: ${language}\n\n${source}`);
  }

  if (files.length === 0) {
    throw new Error("No supported source files were found in this ZIP archive");
  }

  const result = await analyzeCodeWithAI(
    "source files from a ZIP archive",
    files.join("\n\n--- END FILE ---\n\n")
  );

  return { ...result, scannedFiles: files.length, linesScanned };
}

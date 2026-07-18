import AdmZip from "adm-zip";
import { analyzeCodeWithAI } from "./openaiService";
import type { AnalyzeResponseBody } from "../types";
import { buildDeterministicScanPlan, type ScanPlan, type ScanTarget } from "./scanPlanner";

const MAX_FILES = 100;
// Keep ZIP input comfortably below Llama's 12k-token request budget.
const MAX_CHUNK_BYTES = 6_000;
const MAX_TOTAL_BYTES = 24_000;
const MAX_EXPANDED_FILE_BYTES = 1_000_000;

const languageForFile = (fileName: string): string | null => {
  const baseName = fileName.split("/").pop()?.toLowerCase();
  if (
    baseName === "package.json" || baseName === "package-lock.json" ||
    baseName === "npm-shrinkwrap.json" || baseName === "dockerfile" ||
    baseName === "docker-compose.yml" || baseName === "docker-compose.yaml" ||
    baseName === ".npmrc" || baseName === ".yarnrc" || baseName === ".yarnrc.yml" ||
    baseName === "requirements.txt" || baseName === "pipfile" ||
    baseName === "pipfile.lock" || baseName === "poetry.lock" ||
    baseName === "pyproject.toml" || baseName === "pom.xml" ||
    baseName === "build.gradle" || baseName === "build.gradle.kts" ||
    baseName === "cargo.toml" || baseName === "cargo.lock" ||
    baseName === "go.mod" || baseName === "go.sum" ||
    baseName === "composer.json" || baseName === "composer.lock"
  ) return "project configuration or dependency manifest";

  if (/(^|\/)\.github\/workflows\//.test(fileName) && /\.ya?ml$/i.test(fileName)) {
    return "CI/CD workflow configuration";
  }

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
    case "php":
      return "PHP";
    case "rb":
      return "Ruby";
    case "go":
      return "Go";
    case "rs":
      return "Rust";
    case "cs":
      return "C#";
    case "kt":
    case "kts":
      return "Kotlin";
    case "swift":
      return "Swift";
    case "html":
    case "htm":
      return "HTML";
    case "sh":
    case "bash":
    case "zsh":
      return "Shell";
    case "java":
      return "Java";
    case "cpp":
    case "cxx":
    case "cc":
    case "c":
      return "C++";
    case "json":
    case "yml":
    case "yaml":
    case "xml":
    case "toml":
    case "properties":
    case "conf":
      return "application configuration";
    default:
      return null;
  }
};

export interface ArchiveAnalysis extends AnalyzeResponseBody {
  scannedFiles: number;
  linesScanned: number;
  scanPlan: ScanPlan;
}

export async function analyzeArchive(buffer: Buffer): Promise<ArchiveAnalysis> {
  const zip = new AdmZip(buffer);
  const candidates: ScanTarget[] = [];

  for (const entry of zip.getEntries()) {
    const fileName = entry.entryName.replace(/\\/g, "/");
    const language = languageForFile(fileName);
    const isIgnored = /(^|\/)(node_modules|\.git|dist|build)(\/|$)/.test(fileName);

    if (entry.isDirectory || !language || isIgnored) continue;
    if (fileName.startsWith("/") || fileName.includes("../")) continue;
    // Analyze bounded portions of large files instead of silently dropping
    // them; retain a decompression guard for hostile ZIPs.
    if (entry.header.size > MAX_EXPANDED_FILE_BYTES || candidates.length >= MAX_FILES) continue;

    const source = entry.getData().toString("utf8");
    candidates.push(...splitIntoScanTargets(fileName, language, source));
  }

  if (candidates.length === 0) {
    throw new Error("No supported source files were found in this ZIP archive");
  }

  const candidatePlan = buildDeterministicScanPlan(candidates);
  let totalBytes = 0;
  const files = [...candidates].sort((a, b) => {
    const aPlan = candidatePlan.entries.find((entry) => entry.fileName === a.fileName)!;
    const bPlan = candidatePlan.entries.find((entry) => entry.fileName === b.fileName)!;
    return bPlan.score - aPlan.score || a.fileName.localeCompare(b.fileName);
  }).filter((file) => {
    const bytes = Buffer.byteLength(file.source, "utf8");
    if (totalBytes + bytes > MAX_TOTAL_BYTES) return false;
    totalBytes += bytes;
    return true;
  });

  if (files.length === 0) {
    throw new Error("No supported source portions fit within the scan budget");
  }

  const scanPlan = buildDeterministicScanPlan(files);
  const linesScanned = files.reduce((total, file) => total + file.source.split("\n").length, 0);
  const result = await analyzeCodeWithAI(
    "source files from a ZIP archive",
    files.map((file) => `File: ${file.fileName}\nLanguage: ${file.language}\n\n${file.source}`).join("\n\n--- END FILE ---\n\n"),
    scanPlan
  );

  return { ...result, scannedFiles: new Set(files.map((file) => file.fileName.replace(/#L\d+-\d+$/, ""))).size, linesScanned, scanPlan };
}

function splitIntoScanTargets(fileName: string, language: string, source: string): ScanTarget[] {
  if (Buffer.byteLength(source, "utf8") <= MAX_CHUNK_BYTES) {
    return [{ fileName, language, source }];
  }

  const chunks: ScanTarget[] = [];
  const lines = source.split("\n");
  let chunk: string[] = [];
  let chunkBytes = 0;
  let startLine = 1;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lineBytes = Buffer.byteLength(`${line}\n`, "utf8");
    if (chunk.length > 0 && chunkBytes + lineBytes > MAX_CHUNK_BYTES) {
      chunks.push({ fileName: `${fileName}#L${startLine}-${index}`, language, source: chunk.join("\n") });
      chunk = [];
      chunkBytes = 0;
      startLine = index + 1;
    }
    chunk.push(line);
    chunkBytes += lineBytes;
  }
  if (chunk.length > 0) {
    chunks.push({ fileName: `${fileName}#L${startLine}-${lines.length}`, language, source: chunk.join("\n") });
  }
  return chunks;
}

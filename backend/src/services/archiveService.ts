import AdmZip from "adm-zip";
import { analyzeCodeWithAI } from "./openaiService";
import type { AnalyzeResponseBody } from "../types";

const MAX_FILES = 100;
const MAX_FILE_BYTES = 100_000;
const MAX_TOTAL_BYTES = 1_000_000;

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

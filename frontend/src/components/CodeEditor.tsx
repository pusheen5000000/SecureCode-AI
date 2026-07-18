import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, ScanLine, ChevronDown, FileArchive, Upload } from "lucide-react";
import type { SupportedLanguage } from "../types";

const LANGUAGES: SupportedLanguage[] = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
];

const SAMPLE_CODE = `app.get('/user/:id', (req, res) => {
  const query = "SELECT * FROM users WHERE id = " + req.params.id;
  db.query(query, (err, row) => {
    res.json(row);
  });
});`;

interface CodeEditorProps {
  onScan: (language: SupportedLanguage, code: string) => void;
  onUpload: (file: File) => void;
  isScanning: boolean;
  error?: string | null;
}

export default function CodeEditor({ onScan, onUpload, isScanning, error }: CodeEditorProps) {
  const [language, setLanguage] = useState<SupportedLanguage>("JavaScript");
  const [code, setCode] = useState(SAMPLE_CODE);
  const [langOpen, setLangOpen] = useState(false);
  const [archive, setArchive] = useState<File | null>(null);
  const uploadInput = useRef<HTMLInputElement>(null);

  const charCount = code.length;
  const lineCount = code.split("\n").length;

  return (
    <section id="scan" className="border-b border-border bg-bg py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-blue">
            Step 1
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
            Paste your code
          </h2>
          <p className="mt-3 text-text-secondary">
            Drop in a snippet or a whole file. SecureCode AI will scan it for
            real, explainable vulnerabilities.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/30"
        >
          {/* Editor title bar */}
          <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-critical/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-medium/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-low/70" />
            </div>

            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                className="focus-ring flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              >
                {language}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full z-10 mt-1.5 w-40 overflow-hidden rounded-md border border-border bg-surface-2 shadow-xl shadow-black/40">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setLangOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-xs transition-colors hover:bg-surface-3 ${
                        lang === language
                          ? "text-blue"
                          : "text-text-secondary"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Textarea "editor" */}
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder="// Paste your code here..."
              className="focus-ring h-72 w-full resize-none bg-surface px-5 py-4 font-mono text-[13px] leading-relaxed text-text-primary placeholder:text-text-muted"
            />
          </div>

          {/* Footer bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-2 px-4 py-3">
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span>{lineCount} lines</span>
              <span>{charCount} characters</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCode("")}
                className="focus-ring flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                onClick={() => onScan(language, code)}
                disabled={isScanning || code.trim().length === 0}
                className="focus-ring flex items-center gap-2 rounded-md bg-blue px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-dim/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <ScanLine className="h-3.5 w-3.5" />
                {isScanning ? "Scanning…" : "Scan Code"}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mt-5 rounded-xl border border-dashed border-border-hover bg-surface px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet/15 p-2 text-violet"><FileArchive className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-medium text-text-primary">Scan a project ZIP</p>
                <p className="text-xs text-text-muted">Upload a ZIP with JavaScript, TypeScript, Python, Java, or C++ files.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input ref={uploadInput} type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => setArchive(e.target.files?.[0] ?? null)} />
              <button onClick={() => uploadInput.current?.click()} className="focus-ring rounded-md border border-border px-3 py-2 text-xs font-medium text-text-secondary hover:border-border-hover hover:text-text-primary">
                {archive ? "Choose another" : "Choose ZIP"}
              </button>
              <button onClick={() => archive && onUpload(archive)} disabled={isScanning || !archive} className="focus-ring flex items-center gap-2 rounded-md bg-blue px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                <Upload className="h-3.5 w-3.5" />
                {isScanning ? "Scanning…" : "Upload & Scan"}
              </button>
            </div>
          </div>
          {archive && <p className="mt-3 text-xs text-blue">Selected: {archive.name} ({Math.ceil(archive.size / 1024)} KB)</p>}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-critical/30 bg-critical/10 px-4 py-3 text-center text-sm text-critical">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

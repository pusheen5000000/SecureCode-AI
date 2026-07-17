import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onStartScanning: () => void;
}

const previewLines = [
  { code: "app.get('/user/:id', (req, res) => {", flag: false },
  { code: "  const q = `SELECT * FROM users", flag: true },
  { code: "    WHERE id = ${req.params.id}`;", flag: true },
  { code: "  db.query(q, (err, row) => {", flag: false },
  { code: "    res.json(row);", flag: false },
  { code: "  });", flag: false },
  { code: "});", flag: false },
];

export default function Hero({ onStartScanning }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[480px] w-[780px] -translate-x-1/2 rounded-full bg-blue/10 blur-[120px]" />
        <div className="absolute right-[5%] top-[20%] h-[300px] w-[300px] rounded-full bg-violet/10 blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-20 md:py-28 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary">
            <Sparkles className="h-3.5 w-3.5 text-violet" />
            Built for the hackathon — AI security review, instantly
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
            Find the vulnerability
            <br />
            before it finds <span className="text-gradient">production.</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
            SecureCode AI reads your source code like a senior security
            engineer, flags real vulnerabilities, and explains exactly why
            they matter — in language beginners actually understand.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartScanning}
              className="focus-ring group flex items-center gap-2 rounded-lg bg-blue px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-dim/30 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Scanning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href="#scan"
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6 text-xs text-text-muted">
            <span>5 languages supported</span>
            <span className="h-1 w-1 rounded-full bg-text-muted" />
            <span>OWASP-aligned findings</span>
            <span className="h-1 w-1 rounded-full bg-text-muted" />
            <span>No code leaves this demo</span>
          </div>
        </motion.div>

        {/* Signature element: a live "scanning" code preview */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-critical/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-medium/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-low/70" />
              </div>
              <span className="font-mono text-xs text-text-muted">
                userController.js
              </span>
              <span className="flex items-center gap-1.5 text-xs text-blue">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue" />
                scanning
              </span>
            </div>

            <div className="relative px-5 py-6 font-mono text-[13px] leading-relaxed">
              {/* scan sweep line */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scan-sweep bg-gradient-to-b from-transparent via-blue/20 to-transparent" />

              {previewLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    line.flag ? "bg-critical/10" : ""
                  } -mx-5 px-5`}
                >
                  <span className="w-4 shrink-0 select-none text-text-muted">
                    {i + 1}
                  </span>
                  <span
                    className={
                      line.flag ? "text-critical/90" : "text-text-secondary"
                    }
                  >
                    {line.code}
                  </span>
                  {line.flag && i === 1 && (
                    <span className="ml-auto shrink-0 rounded-full bg-critical/20 px-2 py-0.5 text-[10px] font-medium text-critical">
                      SQL Injection
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* floating score badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-surface-2 px-4 py-3 shadow-xl shadow-black/40 sm:block"
          >
            <p className="text-[11px] text-text-muted">Security Score</p>
            <p className="font-display text-2xl font-semibold text-medium">
              78<span className="text-sm text-text-muted">/100</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

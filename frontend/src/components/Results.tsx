import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Info,
  FileCode2,
} from "lucide-react";
import type { ScanResult, Severity, SidebarFilters, SupportedLanguage } from "../types";
import Sidebar from "./Sidebar";
import VulnerabilityCard from "./VulnerabilityCard";
import ChatPanel from "./ChatPanel";
import { mockChatMessages } from "../data/mockResults";
import { getScoreColor } from "../utils/severity";

interface ResultsProps {
  result: ScanResult;
}

const RISK_BADGE: Record<
  ScanResult["summary"]["riskStatus"],
  { bg: string; text: string; border: string }
> = {
  "Low Risk": { bg: "bg-low/10", text: "text-low", border: "border-low/30" },
  "Moderate Risk": {
    bg: "bg-medium/10",
    text: "text-medium",
    border: "border-medium/30",
  },
  "High Risk": {
    bg: "bg-high/10",
    text: "text-high",
    border: "border-high/30",
  },
  "Critical Risk": {
    bg: "bg-critical/10",
    text: "text-critical",
    border: "border-critical/30",
  },
};

export default function Results({ result }: ResultsProps) {
  const { summary, vulnerabilities } = result;
  const scoreColor = getScoreColor(summary.securityScore);
  const riskStyle = RISK_BADGE[summary.riskStatus];

  const [filters, setFilters] = useState<SidebarFilters>({
    severities: [],
    languages: [],
    owaspCategories: [],
  });

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value];
  }

  const filtered = useMemo(() => {
    return vulnerabilities.filter((v) => {
      const sevOk =
        filters.severities.length === 0 ||
        filters.severities.includes(v.severity);
      const langOk =
        filters.languages.length === 0 ||
        filters.languages.includes(v.language);
      const owaspOk =
        filters.owaspCategories.length === 0 ||
        filters.owaspCategories.includes(v.owaspCategory);
      return sevOk && langOk && owaspOk;
    });
  }, [vulnerabilities, filters]);

  return (
    <section id="results" className="border-b border-border bg-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-medium uppercase tracking-widest text-blue">
            Step 2
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-text-primary">
            Security Report
          </h2>
          <p className="mt-3 text-text-secondary">
            {summary.linesScanned.toLocaleString()} lines scanned in{" "}
            {(summary.scanDurationMs / 1000).toFixed(1)}s across{" "}
            <span className="text-text-primary">{summary.scannedFileName}</span>
          </p>
        </div>

        {/* Score + summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-5"
        >
          {/* Score ring card */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-surface px-6 py-8 lg:col-span-1">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-blue/20" />
              <ScoreRing score={summary.securityScore} />
              <div className="absolute flex flex-col items-center">
                <span className={`font-display text-3xl font-bold ${scoreColor}`}>
                  {summary.securityScore}
                </span>
                <span className="text-[10px] text-text-muted">/ 100</span>
              </div>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}
            >
              {summary.riskStatus}
            </span>
          </div>

          <SummaryCard
            icon={ShieldAlert}
            label="Vulnerabilities Found"
            value={summary.vulnerabilitiesFound}
            accent="text-blue"
          />
          <SummaryCard
            icon={Flame}
            label="High Severity"
            value={summary.highSeverity}
            accent="text-critical"
          />
          <SummaryCard
            icon={AlertTriangle}
            label="Medium Severity"
            value={summary.mediumSeverity}
            accent="text-medium"
          />
          <SummaryCard
            icon={Info}
            label="Low Severity"
            value={summary.lowSeverity}
            accent="text-low"
          />
        </motion.div>

        {/* Main layout: sidebar / list / chat */}
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar
            filters={filters}
            onToggleSeverity={(sev: Severity) =>
              setFilters((f) => ({ ...f, severities: toggle(f.severities, sev) }))
            }
            onToggleLanguage={(lang: SupportedLanguage) =>
              setFilters((f) => ({ ...f, languages: toggle(f.languages, lang) }))
            }
            onToggleOwasp={(cat: string) =>
              setFilters((f) => ({
                ...f,
                owaspCategories: toggle(f.owaspCategories, cat),
              }))
            }
            onReset={() =>
              setFilters({ severities: [], languages: [], owaspCategories: [] })
            }
          />

          {/* Vulnerability list */}
          <div className="min-w-0 flex-1 space-y-3">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
                <FileCode2 className="h-6 w-6 text-text-muted" />
                <p className="text-sm text-text-secondary">
                  No vulnerabilities match your filters.
                </p>
              </div>
            ) : (
              filtered.map((v, i) => (
                <VulnerabilityCard
                  key={v.id}
                  vulnerability={v}
                  defaultExpanded={i === 0}
                />
              ))
            )}
          </div>

          {/* AI Assistant panel */}
          <div className="w-full shrink-0 lg:w-96">
            <div className="lg:sticky lg:top-24 lg:h-[640px]">
              <ChatPanel initialMessages={mockChatMessages} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-surface px-5 py-5 lg:col-span-1">
      <Icon className={`h-5 w-5 ${accent}`} />
      <div className="mt-4">
        <p className={`font-display text-2xl font-semibold ${accent}`}>{value}</p>
        <p className="mt-1 text-xs text-text-secondary">{label}</p>
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 85
      ? "var(--color-low)"
      : score >= 60
        ? "var(--color-medium)"
        : score >= 40
          ? "var(--color-high)"
          : "var(--color-critical)";

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="var(--color-surface-3)"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
}
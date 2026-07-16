import type { Severity } from "../types";

interface SeverityStyle {
  label: Severity;
  text: string;
  bg: string;
  border: string;
  dot: string;
  glow: string;
}

const styles: Record<Severity, SeverityStyle> = {
  "Very High": {
    label: "Very High",
    text: "text-critical",
    bg: "bg-critical/10",
    border: "border-critical/30",
    dot: "bg-critical",
    glow: "shadow-[0_0_0_1px_rgba(244,63,94,0.15)]",
  },
  High: {
    label: "High",
    text: "text-high",
    bg: "bg-high/10",
    border: "border-high/30",
    dot: "bg-high",
    glow: "shadow-[0_0_0_1px_rgba(249,115,22,0.15)]",
  },
  Medium: {
    label: "Medium",
    text: "text-medium",
    bg: "bg-medium/10",
    border: "border-medium/30",
    dot: "bg-medium",
    glow: "shadow-[0_0_0_1px_rgba(234,179,8,0.15)]",
  },
  Low: {
    label: "Low",
    text: "text-low",
    bg: "bg-low/10",
    border: "border-low/30",
    dot: "bg-low",
    glow: "shadow-[0_0_0_1px_rgba(34,197,94,0.15)]",
  },
};

export function getSeverityStyle(severity: Severity): SeverityStyle {
  return styles[severity];
}

export function getScoreColor(score: number): string {
  if (score >= 85) return "text-low";
  if (score >= 60) return "text-medium";
  if (score >= 40) return "text-high";
  return "text-critical";
}
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Severity, SupportedLanguage, SidebarFilters } from "../types";
import { getSeverityStyle } from "../utils/severity";

const SEVERITIES: Severity[] = ["Very High", "High", "Medium", "Low"];
const LANGUAGES: SupportedLanguage[] = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
];
const OWASP_CATEGORIES = [
  "A01: Broken Access Control",
  "A02: Cryptographic Failures",
  "A03: Injection",
  "A07: Identification and Authentication Failures",
];

interface SidebarProps {
  filters: SidebarFilters;
  onToggleSeverity: (severity: Severity) => void;
  onToggleLanguage: (language: SupportedLanguage) => void;
  onToggleOwasp: (category: string) => void;
  onReset: () => void;
}

export default function Sidebar({
  filters,
  onToggleSeverity,
  onToggleLanguage,
  onToggleOwasp,
  onReset,
}: SidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <SlidersHorizontal className="h-4 w-4 text-blue" />
            Filters
          </div>
          <button
            onClick={onReset}
            className="focus-ring flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <FilterGroup title="Severity">
          {SEVERITIES.map((sev) => {
            const style = getSeverityStyle(sev);
            const active = filters.severities.includes(sev);
            return (
              <FilterCheckbox
                key={sev}
                label={sev}
                checked={active}
                onChange={() => onToggleSeverity(sev)}
                dotClass={style.dot}
              />
            );
          })}
        </FilterGroup>

        <FilterGroup title="Language">
          {LANGUAGES.map((lang) => (
            <FilterCheckbox
              key={lang}
              label={lang}
              checked={filters.languages.includes(lang)}
              onChange={() => onToggleLanguage(lang)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="OWASP Category" last>
          {OWASP_CATEGORIES.map((cat) => (
            <FilterCheckbox
              key={cat}
              label={cat}
              checked={filters.owaspCategories.includes(cat)}
              onChange={() => onToggleOwasp(cat)}
            />
          ))}
        </FilterGroup>
      </div>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`${last ? "" : "mb-5 border-b border-border pb-5"}`}>
      <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-text-muted">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
  dotClass,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  dotClass?: string;
}) {
  return (
    <label className="focus-ring flex cursor-pointer items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-blue bg-blue"
            : "border-border-hover bg-transparent"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-white">
            <path d="M4.6 8.6 2 6l-.9.9L4.6 10.4 11 4l-.9-.9z" />
          </svg>
        )}
      </span>
      {dotClass && <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />}
      <span className="text-text-secondary transition-colors peer-checked:text-text-primary">
        {label}
      </span>
    </label>
  );
}
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

@theme {
  --font-display: "Space Grotesk", "Inter", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --color-bg: #0a0e17;
  --color-surface: #10151f;
  --color-surface-2: #161c2a;
  --color-surface-3: #1c2434;
  --color-border: #232b3d;
  --color-border-hover: #2f3a52;

  --color-text-primary: #e7eaf2;
  --color-text-secondary: #8b93a7;
  --color-text-muted: #5c6478;

  --color-blue: #4f7cff;
  --color-violet: #8b5cf6;
  --color-blue-dim: #2f4faf;

  --color-critical: #f43f5e;
  --color-high: #f97316;
  --color-medium: #eab308;
  --color-low: #22c55e;

  --animate-scan-sweep: scan-sweep 2.4s ease-in-out infinite;
  --animate-pulse-ring: pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scan-sweep {
  0% { transform: translateY(-10%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(110%); opacity: 0; }
}

@keyframes pulse-ring {
  0% { transform: scale(0.9); opacity: 0.6; }
  70% { transform: scale(1.35); opacity: 0; }
  100% { transform: scale(1.35); opacity: 0; }
}

html { scroll-behavior: smooth; }
body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

::selection { background-color: var(--color-blue-dim); color: white; }
::-webkit-scrollbar { width: 10px; height: 10px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background-color: var(--color-surface-3);
  border-radius: 999px;
  border: 2px solid var(--color-bg);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.text-gradient {
  background-image: linear-gradient(90deg, var(--color-blue), var(--color-violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.focus-ring { outline: none; }
.focus-ring:focus-visible { outline: 2px solid var(--color-blue); outline-offset: 2px; }
import { motion } from "framer-motion";

interface HeaderProps {
  onStartScanning: () => void;
}

export default function Header({ onStartScanning }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src="../../assets/images/logo.png" alt="SecureCode AI logo" className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-text-primary">
            SecureCode <span className="text-gradient">AI</span>
          </span>
        </motion.div>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#scan"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Scan
          </a>
          <a
            href="#results"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            Results
          </a>
          <a
            href="#footer"
            className="text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            About
          </a>
        </nav>

        <button
          onClick={onStartScanning}
          className="focus-ring rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-dim/20 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          Start Scanning
        </button>
      </div>
    </header>
  );
}
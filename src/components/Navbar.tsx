import React, { useState } from 'react';
import { Menu, X, SlidersHorizontal, Terminal } from 'lucide-react';

interface NavbarProps {
  compareCount: number;
  onOpenCompare: () => void;
  onOpenSandbox: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  compareCount,
  onOpenCompare,
  onOpenSandbox,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Tanya AI', href: '#advisor' },
    { label: 'Kalkulator', href: '#calc' },
    { label: 'Stack', href: '#stack' },
    { label: 'Pipeline', href: '#pipe' },
    { label: 'Rencana', href: '#plan' },
    { label: 'Workflow', href: '#flow' },
    { label: 'Database', href: '#db' },
    { label: 'Top 10', href: '#top' },
    { label: 'Cuan Rp0', href: '#money' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#090D16]/90 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-mono">RADAR<span className="text-amber-400">.AI</span></span>
          </a>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400 border-l border-slate-700 pl-3">
            Budget Rp0
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-xs tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSandbox}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sandbox</span>
          </button>

          <button
            onClick={onOpenCompare}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-amber-500/10"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Bandingkan</span>
            {compareCount > 0 && (
              <span className="ml-1 w-4 h-4 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono flex items-center justify-center font-bold">
                {compareCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSandbox();
              }}
              className="flex-1 inline-flex justify-center items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 rounded-lg"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Buka Sandbox API</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

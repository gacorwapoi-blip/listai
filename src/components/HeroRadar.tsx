import React from 'react';
import { CATEGORIES } from '../data/tools';
import { CategoryKey } from '../types';
import { Search, Sparkles, Shield, Cpu, ArrowDown } from 'lucide-react';

interface HeroRadarProps {
  totalTools: number;
  freeAndOssRatio: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: CategoryKey) => void;
}

export const HeroRadar: React.FC<HeroRadarProps> = ({
  totalTools,
  freeAndOssRatio,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  // Category coordinates on radar circle
  const radarCategories: { key: CategoryKey; angle: number; radius: number }[] = [
    { key: 'coding', angle: 45, radius: 68 },
    { key: 'research', angle: 100, radius: 78 },
    { key: 'automation', angle: 160, radius: 62 },
    { key: 'content', angle: 215, radius: 82 },
    { key: 'data', angle: 260, radius: 55 },
    { key: 'productivity', angle: 310, radius: 72 },
    { key: 'builder', angle: 355, radius: 60 },
  ];

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 border-b border-slate-800 bg-[#090D16]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading, Stats & Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{totalTools} Sinyal Terverifikasi · Budget Rp0</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              AI gratis yang jarang di-radar orang, tapi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">leverage-nya nyata</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Koleksi terkurasi tools AI gratis, open source mandiri, dan free tier yang tervalidasi. Hemat jutaan rupiah langganan bulanan tanpa mengorbankan kapabilitas kerja.
            </p>

            {/* Quick search input */}
            <div className="relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari tool, fungsi (e.g. transkrip, coding, RAG)..."
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Key quantitative metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                  {totalTools}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Tools Tervalidasi</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                  7
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Kategori Utama</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                  {freeAndOssRatio}%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">100% Free & OSS</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">
                  Rp 0
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Investasi Software</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Radar Scanner */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-slate-800 bg-radial from-emerald-950/20 via-slate-950 to-slate-950 shadow-2xl flex items-center justify-center">
              {/* Concentric rings */}
              <div className="absolute inset-6 rounded-full border border-slate-800/80 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-slate-800/60 pointer-events-none" />
              <div className="absolute inset-28 rounded-full border border-slate-800/40 pointer-events-none" />

              {/* Crosshair lines */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/80 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-slate-800/80 pointer-events-none" />

              {/* Rotating sweeping beam */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(74, 222, 128, 0.25) 0deg, transparent 40deg, transparent 360deg)',
                  animation: 'spin 5s linear infinite',
                }}
              />

              {/* Center emitter */}
              <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 z-10" />

              {/* Category Blips */}
              {radarCategories.map(({ key, angle, radius }) => {
                const rad = (angle * Math.PI) / 180;
                // Calculate position relative to center (radius percentage)
                const x = 50 + (radius / 2) * Math.cos(rad);
                const y = 50 + (radius / 2) * Math.sin(rad);
                const cat = CATEGORIES[key];

                return (
                  <button
                    key={key}
                    onClick={() => onSelectCategory(key)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 p-1.5 focus:outline-none z-20 cursor-pointer"
                    title={`Lompat ke filter ${cat.label}`}
                    aria-label={`Filter ${cat.label}`}
                  >
                    <span
                      className="relative block w-3.5 h-3.5 rounded-full border-2 border-slate-950 shadow-md group-hover:scale-125 transition-transform"
                      style={{ backgroundColor: cat.color }}
                    >
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: cat.color }}
                      />
                    </span>

                    {/* Tooltip on hover */}
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 text-[10px] font-mono text-white bg-slate-900 border border-slate-700 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Klik titik radar di atas untuk langsung menyaring tools per kategori
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

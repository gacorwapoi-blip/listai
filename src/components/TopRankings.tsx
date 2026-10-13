import React, { useState } from 'react';
import { Tool } from '../types';
import { Trophy, Target, ArrowRight, Star } from 'lucide-react';

interface TopRankingsProps {
  tools: Tool[];
  onSelectTool: (id: string) => void;
}

const GOALS = [
  { id: 'coding', label: 'Coding & Dev', filter: (t: Tool) => t.category === 'coding' },
  { id: 'cuan', label: 'Cari Uang (Monetisasi)', filter: (t: Tool) => t.money === 'High' },
  { id: 'content', label: 'Bikin Konten Media', filter: (t: Tool) => t.category === 'content' },
  { id: 'automation', label: 'Otomatisasi Bisnis', filter: (t: Tool) => t.category === 'automation' },
  { id: 'research', label: 'Riset & Risalah', filter: (t: Tool) => t.category === 'research' },
  { id: 'data', label: 'Data & Trading', filter: (t: Tool) => t.category === 'data' },
];

export const TopRankings: React.FC<TopRankingsProps> = ({ tools, onSelectTool }) => {
  const [activeGoalId, setActiveGoalId] = useState('cuan');

  // Top 10 ranked tools by score
  const top10Tools = [...tools].sort((a, b) => b.score - a.score).slice(0, 10);

  // Goal recommendations
  const activeGoal = GOALS.find((g) => g.id === activeGoalId) || GOALS[0];
  const recommendedTools = [...tools]
    .filter(activeGoal.filter)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <section id="top" className="py-12 sm:py-16 border-b border-slate-800 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span>Peringkat Utility & Skor Nyata</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Top 10 Underrated Tools Berdasarkan Skor Efisiensi
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Diurutkan berdasarkan kemudahan setup, kebebasan lisensi tanpa kartu kredit, serta rasio output terhadap waktu belajar.
          </p>
        </div>

        {/* 2-Column: Top 10 Table vs Goal Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Top 10 Table */}
          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Peringkat 10 Besar Utility
              </span>
              <span className="text-xs font-mono text-slate-400">Skor Max 10.0</span>
            </div>

            <div className="divide-y divide-slate-800/80 text-xs">
              {top10Tools.map((t, idx) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTool(t.id)}
                  className="p-3 hover:bg-slate-800/40 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <span className={`w-6 h-6 rounded-md font-mono font-bold flex items-center justify-center shrink-0 text-xs ${
                    idx === 0
                      ? 'bg-amber-400 text-slate-950'
                      : idx === 1
                      ? 'bg-slate-300 text-slate-950'
                      : idx === 2
                      ? 'bg-amber-700/80 text-white'
                      : 'bg-slate-950 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-white truncate text-sm hover:underline">{t.name}</span>
                      <span className="font-mono font-bold text-amber-400 shrink-0">{t.score.toFixed(1)}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                          style={{ width: `${t.score * 10}%` }}
                        />
                      </div>
                      <span className="shrink-0">{t.category}</span>
                      <span className="shrink-0 font-medium text-slate-300">Cuan: {t.money}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Goal-based Recommendations */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Target className="w-4 h-4" />
                <span>Rekomendasi Berdasarkan Tujuan</span>
              </div>
              <h3 className="text-base font-bold text-white">Kamu sedang ingin fokus ke mana?</h3>
            </div>

            {/* Goal chips */}
            <div className="flex items-center gap-2 flex-wrap">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setActiveGoalId(goal.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    activeGoalId === goal.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>

            {/* Recommended Tools Cards */}
            <div className="space-y-3 pt-2">
              {recommendedTools.map((tool, idx) => (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-sm text-white hover:underline">{tool.name}</span>
                    <span className="text-xs font-mono font-bold text-amber-400">★ {tool.score.toFixed(1)}</span>
                  </div>
                  <div className="text-xs text-slate-400 mb-2">
                    Level: {tool.difficulty} · Potensi: {tool.money}
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/80 leading-relaxed">
                    💡 <strong className="text-amber-300">Kenapa cocok:</strong> {tool.usecase}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

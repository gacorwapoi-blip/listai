import React, { useState, useEffect } from 'react';
import { TOOLS } from './data/tools';
import { Tool, CategoryKey } from './types';
import { Navbar } from './components/Navbar';
import { HeroRadar } from './components/HeroRadar';
import { SavingsCalculator } from './components/SavingsCalculator';
import { StackBuilder } from './components/StackBuilder';
import { PipelineEngine } from './components/PipelineEngine';
import { PlanCanvas } from './components/PlanCanvas';
import { WorkflowBlueprints } from './components/WorkflowBlueprints';
import { ToolDatabase } from './components/ToolDatabase';
import { TopRankings } from './components/TopRankings';
import { MonetizationRoadmap } from './components/MonetizationRoadmap';
import { CompareModal } from './components/CompareModal';
import { SandboxModal } from './components/SandboxModal';
import { AIAdvisor } from './components/AIAdvisor';
import { Download, Heart, ArrowUp } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('radar_favorites');
      return saved ? JSON.parse(saved) : ['opencode', 'geminicli', 'notebooklm', 'n8n'];
    } catch {
      return ['opencode', 'geminicli', 'notebooklm', 'n8n'];
    }
  });

  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [sandboxModalOpen, setSandboxModalOpen] = useState(false);
  const [highlightedToolId, setHighlightedToolId] = useState<string | null>(null);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('radar_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleCompare = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        showToast('Maksimal 3 tools yang dapat dibandingkan sekaligus.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSelectTool = (id: string) => {
    setHighlightedToolId(id);
    const dbElem = document.getElementById('db');
    if (dbElem) {
      dbElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategoryFromHero = (cat: CategoryKey) => {
    setSelectedCategory(cat);
    const dbElem = document.getElementById('db');
    if (dbElem) {
      dbElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const freeAndOssCount = TOOLS.filter((t) => t.status === 'FREE' || t.status === 'OSS').length;
  const freeRatio = Math.round((freeAndOssCount / TOOLS.length) * 100);

  const comparedTools = TOOLS.filter((t) => compareList.includes(t.id));

  const downloadFullDataJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(TOOLS, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'radar-ai-tools-database.json');
    dlAnchor.click();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#E2E8F0] font-sans selection:bg-amber-500/20 selection:text-amber-300">
      {/* 3-Zone Navigation Header */}
      <Navbar
        compareCount={compareList.length}
        onOpenCompare={() => setCompareModalOpen(true)}
        onOpenSandbox={() => setSandboxModalOpen(true)}
      />

      <main>
        {/* Hero with Interactive Radar Scanner */}
        <HeroRadar
          totalTools={TOOLS.length}
          freeAndOssRatio={freeRatio}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={handleSelectCategoryFromHero}
        />

        {/* AI Advisor: Solusi Cepat Kebutuhan AI Pengguna */}
        <AIAdvisor onSelectTool={handleSelectTool} />

        {/* Savings Subscription Calculator */}
        <SavingsCalculator onSelectTool={handleSelectTool} />

        {/* Stack Builder: Curated Recipes */}
        <StackBuilder onSelectTool={handleSelectTool} />

        {/* Pipeline & Flow Engine */}
        <PipelineEngine onSelectTool={handleSelectTool} />

        {/* Ruang Rencana: Obsidian-style Workflow Graph */}
        <PlanCanvas />

        {/* Workflow Blueprints: Step-by-Step Execution */}
        <WorkflowBlueprints onSelectTool={handleSelectTool} />

        {/* Central Searchable & Filterable Tool Database */}
        <ToolDatabase
          tools={TOOLS}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          compareList={compareList}
          onToggleCompare={handleToggleCompare}
          selectedToolId={highlightedToolId}
        />

        {/* Top 10 Rankings & Goal Recommendations */}
        <TopRankings tools={TOOLS} onSelectTool={handleSelectTool} />

        {/* Monetization Roadmap Rp0 */}
        <MonetizationRoadmap />
      </main>

      {/* Floating Compare Drawer Trigger (if tools selected) */}
      {compareList.length > 0 && !compareModalOpen && (
        <div className="fixed bottom-6 right-6 z-30 animate-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setCompareModalOpen(true)}
            className="px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl shadow-xl flex items-center gap-2 border border-amber-300"
          >
            <span>Buka Perbandingan ({compareList.length}/3 Tool)</span>
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      <CompareModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        compareTools={comparedTools}
        onRemoveTool={handleToggleCompare}
        onClearAll={() => setCompareList([])}
      />

      {/* Sandbox Modal */}
      <SandboxModal
        isOpen={sandboxModalOpen}
        onClose={() => setSandboxModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-white font-bold font-mono text-sm flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>RADAR.AI // Sinyal AI Gratis</span>
            </div>
            <p className="text-slate-400 mt-1">
              Direktori & Navigator 100% Gratis dan Open-Source. Data dikurasi manual dan tervalidasi.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={downloadFullDataJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Unduh Database JSON</span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-xl shadow-2xl font-medium text-xs flex items-center gap-2 border border-amber-300 animate-bounce">
          <span>⚠️ {toastMessage}</span>
        </div>
      )}
    </div>
  );
}

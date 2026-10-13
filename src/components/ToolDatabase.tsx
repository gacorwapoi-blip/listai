import React, { useState, useMemo } from 'react';
import { Tool, CategoryKey, StatusKey, DifficultyLevel, HardwareFilter } from '../types';
import { CATEGORIES } from '../data/tools';
import { Search, Star, ExternalLink, SlidersHorizontal, Check, Info, Filter, Cpu, Laptop, Monitor, Globe } from 'lucide-react';

interface ToolDatabaseProps {
  tools: Tool[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryKey | 'all';
  onCategoryChange: (cat: CategoryKey | 'all') => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  compareList: string[];
  onToggleCompare: (id: string) => void;
  selectedToolId?: string | null;
}

export const ToolDatabase: React.FC<ToolDatabaseProps> = ({
  tools,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  favorites,
  onToggleFavorite,
  compareList,
  onToggleCompare,
  selectedToolId,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusKey | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [hardwareFilter, setHardwareFilter] = useState<HardwareFilter>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [localOnly, setLocalOnly] = useState<boolean>(false);
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(selectedToolId || null);
  const [displayLimit, setDisplayLimit] = useState<number>(36);

  // Filter logic
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Query filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q) ||
          tool.func.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q) ||
          tool.usecase.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && tool.status !== statusFilter) {
        return false;
      }

      // Difficulty filter
      if (difficultyFilter !== 'all' && tool.difficulty !== difficultyFilter) {
        return false;
      }

      // Hardware filter
      if (hardwareFilter === 'w') {
        // Warnet: must be in browser and warnet supported
        if (!tool.browser || tool.warnet !== true) return false;
      } else if (hardwareFilter === 'k') {
        // Laptop kentang / low-end
        if (!tool.lowend) return false;
      } else if (hardwareFilter === 'd') {
        // High spec / GPU required
        if (tool.lowend) return false;
      }

      // Local only filter
      if (localOnly) {
        if (tool.browser || tool.apikey) return false;
      }

      // Favorites filter
      if (showFavoritesOnly && !favorites.includes(tool.id)) {
        return false;
      }

      return true;
    });
  }, [
    tools,
    searchQuery,
    selectedCategory,
    statusFilter,
    difficultyFilter,
    hardwareFilter,
    localOnly,
    showFavoritesOnly,
    favorites,
  ]);

  const visibleTools = filteredTools.slice(0, displayLimit);

  return (
    <section id="db" className="py-12 sm:py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Filter className="w-4 h-4" />
            <span>Database Tools Terkurasi</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Katalog Lengkap AI Gratis & Open Source
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Filter multi-dimensi berdasarkan kategori, lisensi biaya, perangkat komputasi, dan tingkat kemahiran.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Menampilkan <strong className="text-amber-400">{filteredTools.length}</strong> dari {tools.length} tools
              </span>
            </div>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 mb-6">
          {/* Row 1: Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium mr-1 shrink-0">Kategori:</span>
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-amber-400 text-slate-950 font-semibold'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              Semua Kategori
            </button>
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
              <button
                key={key}
                onClick={() => onCategoryChange(key)}
                className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === key
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                    : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                {CATEGORIES[key].label}
              </button>
            ))}
          </div>

          {/* Row 2: Status & Difficulty */}
          <div className="flex items-center gap-4 flex-wrap pt-2 border-t border-slate-800/80 text-xs">
            {/* Status */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium">Biaya:</span>
              {(['all', 'FREE', 'OSS', 'TIER'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-700 text-white font-medium'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {st === 'all' ? 'Semua Biaya' : st === 'FREE' ? '🟢 100% Free' : st === 'OSS' ? '🔵 Open Source' : '🟡 Free Tier'}
                </button>
              ))}
            </div>

            {/* Hardware Mode */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 font-medium">Perangkat:</span>
              <button
                onClick={() => setHardwareFilter('all')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  hardwareFilter === 'all'
                    ? 'bg-slate-700 text-white font-medium'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Semua Device
              </button>
              <button
                onClick={() => setHardwareFilter('w')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  hardwareFilter === 'w'
                    ? 'bg-emerald-900/60 text-emerald-200 font-medium border border-emerald-700/60'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                🟢 Mode Warnet (Web Browser)
              </button>
              <button
                onClick={() => setHardwareFilter('k')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  hardwareFilter === 'k'
                    ? 'bg-amber-900/60 text-amber-200 font-medium border border-amber-700/60'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                🟡 Laptop Kentang (RAM 8GB)
              </button>
              <button
                onClick={() => setHardwareFilter('d')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  hardwareFilter === 'd'
                    ? 'bg-purple-900/60 text-purple-200 font-medium border border-purple-700/60'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                🟣 PC Spek Dewa (GPU VRAM)
              </button>
            </div>

            {/* Checkbox filters */}
            <div className="flex items-center gap-3 ml-auto">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={localOnly}
                  onChange={(e) => setLocalOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-400"
                />
                <span>Hanya Full Lokal (Offline Rp0)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={showFavoritesOnly}
                  onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-400"
                />
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Favorit ({favorites.length})
                </span>
              </label>
            </div>
          </div>

          {/* Row 3: Quick Smart Preset Filters */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-amber-400 font-medium mr-1 flex items-center gap-1">
              <span>⚡ Shortcut:</span>
            </span>
            <button
              onClick={() => {
                setStatusFilter('OSS');
                setHardwareFilter('all');
                setLocalOnly(false);
              }}
              className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              🔵 Hanya Open Source (Bisa Self-Host)
            </button>
            <button
              onClick={() => {
                setStatusFilter('FREE');
                setHardwareFilter('all');
                setLocalOnly(false);
              }}
              className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              🟢 100% Free Permanen
            </button>
            <button
              onClick={() => {
                setHardwareFilter('w');
                setStatusFilter('all');
                setLocalOnly(false);
              }}
              className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              🌐 Jalan di Web Browser (No Install)
            </button>
            <button
              onClick={() => {
                setHardwareFilter('k');
                setLocalOnly(false);
              }}
              className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              💻 Ringan (Laptop Kentang 8GB)
            </button>
            <button
              onClick={() => {
                setLocalOnly(true);
                setStatusFilter('OSS');
              }}
              className="px-2.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              🔒 100% Offline Lokal (Tanpa Cloud)
            </button>
          </div>
        </div>

        {/* Tools Cards Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-xl p-8">
            <p className="text-slate-300 font-semibold text-base mb-1">Tidak ada tool yang cocok dengan filter saat ini</p>
            <p className="text-xs text-slate-400">Coba reset filter kategori atau longgarkan kata kunci pencarian.</p>
            <button
              onClick={() => {
                onCategoryChange('all');
                setStatusFilter('all');
                setHardwareFilter('all');
                onSearchChange('');
                setLocalOnly(false);
                setShowFavoritesOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleTools.map((tool) => {
              const isFav = favorites.includes(tool.id);
              const isCompared = compareList.includes(tool.id);
              const isExpanded = expandedDetailsId === tool.id;

              return (
                <div
                  key={tool.id}
                  className="bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all group"
                >
                  <div>
                    {/* Header: Status, Favorite & Score */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                            tool.status === 'FREE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                              : tool.status === 'OSS'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800/50'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          }`}
                        >
                          {tool.status === 'FREE' ? 'Free' : tool.status === 'OSS' ? 'Open Source' : 'Free Tier'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {CATEGORIES[tool.category].label.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {tool.score.toFixed(1)}
                        </span>
                        <button
                          onClick={() => onToggleFavorite(tool.id)}
                          className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                          title={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Tool Name & Desc */}
                    <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                      {tool.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2.5 text-[11px] text-slate-400">
                      {tool.browser && (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                          Browser
                        </span>
                      )}
                      {tool.warnet === true && (
                        <span className="bg-emerald-950/40 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40">
                          Warnet OK
                        </span>
                      )}
                      {tool.apikey && (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          API Key
                        </span>
                      )}
                      {tool.lowend && (
                        <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          Ringan
                        </span>
                      )}
                      <span className="text-slate-400">· {tool.difficulty}</span>
                    </div>

                    {/* Expandable Details Accordion */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300 animate-in fade-in duration-150">
                        <div>
                          <strong className="text-slate-400 block text-[11px]">Fungsi Utama:</strong>
                          <p>{tool.func}</p>
                        </div>
                        <div>
                          <strong className="text-emerald-400 block text-[11px]">Kelebihan:</strong>
                          <p>{tool.pros}</p>
                        </div>
                        <div>
                          <strong className="text-rose-400 block text-[11px]">Kekurangan:</strong>
                          <p>{tool.cons}</p>
                        </div>
                        <div>
                          <strong className="text-amber-300 block text-[11px]">Best Usecase:</strong>
                          <p>{tool.usecase}</p>
                        </div>

                        {/* Verified Links - DEAD LINK FIX IMPLEMENTATION */}
                        <div className="pt-2 flex items-center gap-3 border-t border-slate-800 text-xs">
                          {tool.site ? (
                            <a
                              href={tool.site}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">No Web Link</span>
                          )}

                          {tool.github && tool.github.trim() !== '' ? (
                            <a
                              href={tool.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-300 hover:text-white hover:underline flex items-center gap-1 font-medium"
                            >
                              <span>GitHub Repo</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Closed/No Public Git</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
                    <button
                      onClick={() => setExpandedDetailsId(isExpanded ? null : tool.id)}
                      className="text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {isExpanded ? 'Tutup Detail' : 'Lihat Detail...'}
                    </button>

                    <button
                      onClick={() => onToggleCompare(tool.id)}
                      className={`px-3 py-1 rounded-lg font-medium transition-colors border ${
                        isCompared
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {isCompared ? '✓ Terpilih' : 'Bandingkan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load more button */}
        {filteredTools.length > displayLimit && (
          <div className="text-center mt-8">
            <button
              onClick={() => setDisplayLimit((prev) => prev + 36)}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Tampilkan Lebih Banyak ({filteredTools.length - displayLimit} tools tersisa)
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

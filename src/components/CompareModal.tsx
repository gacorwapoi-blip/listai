import React from 'react';
import { Tool } from '../types';
import { CATEGORIES } from '../data/tools';
import { X, SlidersHorizontal, ExternalLink, Check, AlertCircle } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareTools: Tool[];
  onRemoveTool: (id: string) => void;
  onClearAll: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  compareTools,
  onRemoveTool,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const booleanBadge = (val: boolean | string) => {
    if (val === true) return <span className="text-emerald-400 font-semibold">Ya</span>;
    if (val === 'partial') return <span className="text-amber-400 font-semibold">Sebagian</span>;
    return <span className="text-slate-400">Tidak</span>;
  };

  const rows = [
    { label: 'Kategori', render: (t: Tool) => CATEGORIES[t.category].label },
    { label: 'Status Biaya', render: (t: Tool) => (t.status === 'FREE' ? '🟢 100% Free' : t.status === 'OSS' ? '🔵 Open Source' : '🟡 Free Tier') },
    { label: 'Open Source', render: (t: Tool) => booleanBadge(t.oss) },
    { label: 'Jalan di Browser', render: (t: Tool) => booleanBadge(t.browser) },
    { label: 'Mode Warnet', render: (t: Tool) => booleanBadge(t.warnet) },
    { label: 'Bisa di Laptop Kentang', render: (t: Tool) => booleanBadge(t.lowend) },
    { label: 'Butuh VPS / Server', render: (t: Tool) => booleanBadge(t.vps) },
    { label: 'Butuh API Key Eksternal', render: (t: Tool) => booleanBadge(t.apikey) },
    { label: 'Tingkat Kesulitan', render: (t: Tool) => t.difficulty },
    { label: 'Potensi Monetisasi', render: (t: Tool) => (
      <span className={t.money === 'High' ? 'text-emerald-400 font-bold' : t.money === 'Medium' ? 'text-amber-400' : 'text-slate-400'}>
        {t.money}
      </span>
    )},
    { label: 'Skor Utility', render: (t: Tool) => <span className="font-mono font-bold text-amber-400">{t.score.toFixed(1)} / 10</span> },
    { label: 'Best Use Case', render: (t: Tool) => <p className="text-xs text-slate-300 leading-snug">{t.usecase}</p> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Perbandingan Fitur ({compareTools.length}/3 Tool)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {compareTools.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1"
              >
                Kosongkan Slot
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {compareTools.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-medium text-slate-300">Belum ada tool yang dipilih</p>
              <p className="text-xs max-w-md mx-auto">
                Pilih hingga 3 tool di tabel katalog dengan menekan tombol <strong>"Bandingkan"</strong> pada masing-masing kartu untuk melihat matriks perbandingan di sini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="p-3 font-semibold text-slate-400 w-44">Parameter</th>
                    {compareTools.map((t) => (
                      <th key={t.id} className="p-3 font-bold text-white text-sm">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{t.name}</span>
                          <button
                            onClick={() => onRemoveTool(t.id)}
                            className="text-slate-400 hover:text-rose-400 p-0.5"
                            title="Hapus dari perbandingan"
                          >
                            ✕
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="p-3 font-medium text-slate-400">{row.label}</td>
                      {compareTools.map((t) => (
                        <td key={t.id} className="p-3 text-slate-200">
                          {row.render(t)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="p-3 font-medium text-slate-400">Tautan Resmi</td>
                    {compareTools.map((t) => (
                      <td key={t.id} className="p-3 space-x-2">
                        {t.site && (
                          <a
                            href={t.site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-semibold"
                          >
                            <span>Web</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {t.github && t.github.trim() !== '' && (
                          <a
                            href={t.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-300 hover:underline inline-flex items-center gap-1"
                          >
                            <span>GitHub</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Tips: Bandingkan spesifikasi sebelum memilih tool untuk proyek production.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

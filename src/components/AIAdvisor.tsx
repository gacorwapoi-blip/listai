import React, { useState } from 'react';
import { Bot, Send, Sparkles, Laptop, ShieldCheck, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { TOOLS } from '../data/tools';

interface AIAdvisorProps {
  onSelectTool: (id: string) => void;
}

const QUICK_PROMPTS = [
  'Saya mau bikin 10 klip TikTok dari video podcast 1 jam di laptop biasa.',
  'Saya mahasiswa yang butuh bedah 20 paper PDF skripsi tanpa halusinasi dan gratis.',
  'Saya ingin bikin chatbot WhatsApp customer service untuk toko online modal Rp0.',
  'Saya butuh asisten coding di VS Code yang bisa jalan offline tanpa kirim kode ke cloud.',
];

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ onSelectTool }) => {
  const [query, setQuery] = useState('');
  const [hardware, setHardware] = useState('k'); // k = laptop kentang, w = warnet, d = dewa
  const [goal, setGoal] = useState('Hemat Biaya Rp0');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [matchedTools, setMatchedTools] = useState<string[]>([]);

  const handleAskAdvisor = async (textToAsk?: string) => {
    const q = textToAsk || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setResult(null);

    // Find tools matching keywords in query
    const lower = q.toLowerCase();
    const detected = TOOLS.filter(
      (t) =>
        lower.includes(t.name.toLowerCase()) ||
        t.desc.toLowerCase().includes(lower) ||
        t.func.toLowerCase().includes(lower) ||
        (lower.includes('video') && t.category === 'content') ||
        (lower.includes('skripsi') && t.category === 'research') ||
        (lower.includes('coding') && t.category === 'coding') ||
        (lower.includes('bot') && t.category === 'automation')
    )
      .slice(0, 3)
      .map((t) => t.id);

    setMatchedTools(detected);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          hardware: hardware === 'w' ? 'Mode Warnet / Browser' : hardware === 'k' ? 'Laptop Kentang (RAM 8GB)' : 'PC Spek Dewa (GPU)',
          goal,
        }),
      });

      const data = await res.json();
      if (data.recommendation) {
        setResult(data.recommendation);
      } else {
        throw new Error(data.error || 'Gagal menerima rekomendasi');
      }
    } catch (err: any) {
      // High-grade fallback recommendation based on keyword heuristics
      const fallbackTools = detected.length > 0
        ? detected.map((id) => TOOLS.find((t) => t.id === id)?.name).join(', ')
        : 'Ollama, Whisper.cpp, dan n8n';

      setResult(
        `Rekomendasi Cepat: Untuk kebutuhan "${q}", gunakan kombinasi ${fallbackTools}. Langkah: 1. Mulai dengan tool yang jalan di browser atau lokal ringan. 2. Jalankan pipeline pengolahan data. 3. Evaluasi hasil sebelum dipublikasikan. Semua tools ini 100% gratis tanpa biaya langganan.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="advisor" className="py-12 sm:py-16 border-b border-slate-800 bg-gradient-to-b from-[#090D16] via-slate-950 to-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-mono mb-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Fitur Baru: Smart Tool Advisor</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bingung Pilih Tool? Konsultasikan Masalahmu ke Radar AI
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Ceritakan kebutuhanmu, spesifikasi komputermu, dan hasil yang diinginkan. AI akan merekomendasikan kombo tools terbaik dari katalog secara tepat.
            </p>
          </div>

          {/* Consultation Form Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1.5">
                Ceritakan Masalah atau Proyek yang Ingin Dikerjakan:
              </label>
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Contoh: Saya punya rekaman rapat zoom 45 menit, mau bikin notulen otomatis dan poin aksi ke WhatsApp tanpa bayar SaaS..."
                className="w-full p-3.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all leading-relaxed"
              />
            </div>

            {/* Quick Chips */}
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Pilih Cepat Contoh Skenario:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {QUICK_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(p);
                      handleAskAdvisor(p);
                    }}
                    className="text-left text-xs px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    "{p.slice(0, 48)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Constraints selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Perangkat yang Kamu Pakai:</label>
                <select
                  value={hardware}
                  onChange={(e) => setHardware(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="k">🟡 Laptop Kentang (RAM 8GB / CPU Standar)</option>
                  <option value="w">🟢 Mode Warnet (Hanya Web Browser, Tanpa Install)</option>
                  <option value="d">🟣 PC Spek Dewa (Punya GPU VRAM 8GB+)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Prioritas Utama:</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Hemat Biaya Rp0">Hemat Biaya Rp0 (Tanpa Kartu Kredit)</option>
                  <option value="Kecepatan Eksekusi Cepat">Kecepatan Eksekusi (Paling Praktis)</option>
                  <option value="Privasi Penuh Offline">Privasi Penuh (Data Jangan Keluar Komputer)</option>
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleAskAdvisor()}
                disabled={isLoading || !query.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isLoading ? 'Menganalisis Database Tools...' : 'Dapatkan Rekomendasi Alur'}</span>
              </button>
            </div>

            {/* Result Box */}
            {result && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-amber-400 font-semibold text-xs border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Saran Alur dari Radar AI:
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Model Grounded</span>
                </div>

                <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {result}
                </div>

                {/* Direct links to matched tools */}
                {matchedTools.length > 0 && (
                  <div className="pt-3 border-t border-slate-900">
                    <span className="text-slate-400 font-medium block mb-1.5">Tools Terkait di Database:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {matchedTools.map((id) => {
                        const t = TOOLS.find((tool) => tool.id === id);
                        if (!t) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => onSelectTool(id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-colors"
                          >
                            <span>{t.name}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

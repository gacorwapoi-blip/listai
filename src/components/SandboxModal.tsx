import React, { useState } from 'react';
import { X, Terminal, Send, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

interface SandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SandboxModal: React.FC<SandboxModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'cloud' | 'local-cli'>('cloud');
  const [model, setModel] = useState('gemini-3.8-flash');
  const [prompt, setPrompt] = useState('Jelaskan 3 keuntungan utama menggunakan open-source AI dibandingkan closed-source SaaS.');
  const [output, setOutput] = useState<string>('Hasil evaluasi respons AI akan muncul di sini.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  if (!isOpen) return null;

  const handleRun = async () => {
    if (!prompt.trim()) {
      setErrorMsg('Tuliskan prompt terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setOutput('Sedang memproses permintaan melalui gateway aman...');

    try {
      const res = await fetch('/api/sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pengujian sandbox.');
      }

      setOutput(data.output || 'Respons kosong.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi gangguan koneksi.');
      setOutput(`Gagal: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const ollamaCliCommand = `ollama run llama3.2 "${prompt.replace(/"/g, '\\"')}"`;

  const copyCli = () => {
    navigator.clipboard.writeText(ollamaCliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base sm:text-lg">
              Sandbox Pengujian Prompt AI
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Mode Selector */}
          <div>
            <label className="text-slate-400 font-medium block mb-1.5">Metode Eksekusi:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('cloud')}
                className={`p-2.5 rounded-lg border font-medium text-center transition-colors ${
                  mode === 'cloud'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Server Gateway (Aman & Instan)
              </button>
              <button
                type="button"
                onClick={() => setMode('local-cli')}
                className={`p-2.5 rounded-lg border font-medium text-center transition-colors ${
                  mode === 'local-cli'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Ollama Lokal (100% Offline Rp0)
              </button>
            </div>
          </div>

          {mode === 'cloud' ? (
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Model Inferensi</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="gemini-3.8-flash">Radar Engine · Gemini Frontier (Default Cloud)</option>
                  <option value="qwen-2.5-coder">Qwen 2.5 Coder (Simulasi Coding)</option>
                  <option value="llama-3.3-70b">Llama 3.3 70B (Simulasi Reasoning)</option>
                </select>
              </div>

              {/* Prompt Textarea */}
              <div>
                <label className="text-slate-400 block mb-1">Prompt Uji Coba</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Ketik instruksi prompt yang ingin diuji..."
                />
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Koneksi terproteksi proxy server
                </span>

                <button
                  type="button"
                  onClick={handleRun}
                  disabled={isLoading}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {isLoading ? (
                    <span>Sedang Berjalan...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Uji Respons</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Jalankan di Terminal Lokal Anda (Offline Rp0)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Jalankan model open-source langsung di laptop atau PC Anda tanpa mengirim data ke internet dan tanpa biaya API:
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-slate-200 text-[11px] flex items-center justify-between gap-2 overflow-x-auto">
                <code>{ollamaCliCommand}</code>
                <button
                  onClick={copyCli}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 shrink-0 transition-colors"
                >
                  {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCli ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400">
                Belum punya Ollama? Unduh gratis di{' '}
                <a
                  href="https://ollama.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline font-mono"
                >
                  ollama.com
                </a>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Response Box */}
          <div>
            <label className="text-slate-400 block mb-1 font-mono">Hasil Output:</label>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed select-text text-[11px]">
              {output}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-6">
          <span>Gunakan untuk uji cepat ide prompt sebelum dimasukkan ke pipeline</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

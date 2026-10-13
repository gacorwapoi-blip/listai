import React, { useState } from 'react';
import { Layers, Copy, Check, ArrowRight, ExternalLink } from 'lucide-react';

interface StackRecipe {
  id: string;
  title: string;
  objective: string;
  tools: {
    name: string;
    role: string;
    toolId?: string;
  }[];
  flow: string;
  output: string;
}

const STACKS: StackRecipe[] = [
  {
    id: 'shorts',
    title: 'TikTok & Shorts Video Machine',
    objective: 'Mengubah 1 rekaman video panjang (podcast/webinar) menjadi 10 klip pendek viral ber-subtitle',
    tools: [
      { name: 'Whisper.cpp / WhisperX', role: 'Transkripsi audio lokal offline dengan timestamp per kata', toolId: 'whisperx' },
      { name: 'FunClip', role: 'Deteksi otomatis momen terbaik dan potong video per segmen', toolId: 'funclip' },
      { name: 'CapCut (Free)', role: 'Finishing transisi, efek teks dinamis, dan subtitle', toolId: 'davinci-resolve' },
      { name: 'FLUX.1 [schnell]', role: 'Generate thumbnail fotorealistik rasio 9:16', toolId: 'flux-github' },
    ],
    flow: 'Ekstrak audio video panjang ➜ Transkrip via WhisperX ➜ Pilih 10 momen terbaik via FunClip ➜ Rapikan subtitle di CapCut ➜ Buat thumbnail dengan prompt FLUX.1.',
    output: '10 video Shorts/Reels siap upload setiap hari tanpa keluar modal lisensi software.'
  },
  {
    id: 'scholar',
    title: 'Scholar & Thesis Accelerator',
    objective: 'Menyusun literature review dan membedah 30+ paper akademik secara akurat tanpa halusinasi',
    tools: [
      { name: 'Consensus', role: 'Mencari paper akademik dan melihat konsensus klaim ilmiah', toolId: 'consensus' },
      { name: 'SciSpace', role: 'Menyederhanakan formula teknis dan istilah metodologi rumit', toolId: 'scispace' },
      { name: 'NotebookLM', role: 'Mengunggah 30 PDF untuk Q&A bersitasi kutipan dokumen asli', toolId: 'notebooklm' },
      { name: 'Obsidian / Zotero', role: 'Pengelolaan sitasi kutipan otomatis dan second brain catatan', toolId: 'obsidian-ai' },
    ],
    flow: 'Kumpulkan paper via Consensus ➜ Pahami bagian rumit dengan SciSpace ➜ Ingest seluruh PDF ke NotebookLM untuk Q&A ➜ Format sitasi di Zotero/Obsidian.',
    output: 'Draft bab tinjauan pustaka terstruktur dengan referensi DOI yang 100% valid.'
  },
  {
    id: 'mvp',
    title: 'Solo Founder MVP Engine',
    objective: 'Membangun aplikasi web fungsional dari ide nol hingga online production dalam 24 jam',
    tools: [
      { name: 'Bolt.new / v0', role: 'Generate kerangka frontend React & UI Tailwind dalam 1 prompt', toolId: 'boltnew' },
      { name: 'OpenCode / Cline', role: 'Refactor kode, perbaiki bug, dan tambahkan skrip backend', toolId: 'opencode' },
      { name: 'DuckDB / Supabase', role: 'Database lokal kencang & vector store untuk RAG', toolId: 'duckdb' },
      { name: 'Cloudflare Pages', role: 'Hosting gratis, SSL instan, dan edge computing global', toolId: 'groq-free' },
    ],
    flow: 'Generate struktur dasar di Bolt.new ➜ Buka di terminal dengan OpenCode untuk tambah logika ➜ Sambungkan database Supabase/DuckDB ➜ Deploy ke Cloudflare.',
    output: 'Web app interaktif yang sudah memiliki URL publik siap divalidasi ke calon pelanggan.'
  },
  {
    id: 'cs-leadgen',
    title: 'CS & Lead Gen untuk UMKM',
    objective: 'Otomatisasi penjawab pesan pelanggan dan penangkap prospek penjualan 24/7',
    tools: [
      { name: 'Typebot', role: 'Formulir obrolan interaktif untuk menanyakan kebutuhan prospek', toolId: 'typebot' },
      { name: 'Activepieces / n8n', role: 'Otomatisasi mengirim notifikasi WhatsApp & input database', toolId: 'activepieces' },
      { name: 'Chatwoot', role: 'Kotak masuk bersama untuk live chat & WhatsApp multi-admin', toolId: 'chatwoot' },
      { name: 'Ollama (Llama 3)', role: 'Model lokal gratis untuk menyusun draft balasan cerdas', toolId: 'ollama' },
    ],
    flow: 'Pengunjung isi Typebot ➜ Activepieces kirim notifikasi ke nomor admin ➜ Chatwoot buka tiket ➜ AI bantu rekomendasikan produk.',
    output: 'Sistem customer service otomatis hemat jutaan rupiah per bulan tanpa sewa platform mahal.'
  }
];

interface StackBuilderProps {
  onSelectTool: (toolId: string) => void;
}

export const StackBuilder: React.FC<StackBuilderProps> = ({ onSelectTool }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentStack = STACKS[activeTab];

  const handleCopyRecipe = () => {
    const text = `RESEP STACK: ${currentStack.title}\nTujuan: ${currentStack.objective}\n\nTools:\n${currentStack.tools
      .map((t) => `- ${t.name}: ${t.role}`)
      .join('\n')}\n\nAlur Eksekusi:\n${currentStack.flow}\n\nHasil Akhir:\n${currentStack.output}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="stack" className="py-12 sm:py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Layers className="w-4 h-4" />
            <span>Kombinasi Teruji</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Stack Builder: Kombo Tools AI Siap Pakai
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Satu tool jarang bisa menyelesaikan seluruh pekerjaan. Berikut sinergi kombinasi tools gratis yang sudah diuji alur integrasinya untuk satu tujuan konkret.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {STACKS.map((stack, idx) => (
            <button
              key={stack.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                activeTab === idx
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {stack.title}
            </button>
          ))}
        </div>

        {/* Stack Content Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">{currentStack.title}</h3>
              <p className="text-xs text-amber-300/90 mt-0.5">{currentStack.objective}</p>
            </div>
            <button
              onClick={handleCopyRecipe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Resep Stack'}</span>
            </button>
          </div>

          {/* Tools in the stack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentStack.tools.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-sm text-white">{t.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 pl-7">{t.role}</p>
                </div>
                {t.toolId && (
                  <button
                    onClick={() => onSelectTool(t.toolId!)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 shrink-0 pt-1 hover:underline"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Flow execution & Outcome */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-slate-300 block mb-1">Alur Eksekusi Berantai:</span>
              <p className="text-slate-400 leading-relaxed font-mono text-[11px]">{currentStack.flow}</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-emerald-400 block mb-1">Hasil Nyata yang Didapat:</span>
              <p className="text-slate-300 leading-relaxed">{currentStack.output}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

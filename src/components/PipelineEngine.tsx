import React, { useState } from 'react';
import { TOOLS } from '../data/tools';
import { PipelinePreset } from '../types';
import {
  GitBranch, Copy, Check, Download, ArrowUp, ArrowDown, Trash2,
  Plus, Play, RotateCcw, Sparkles, CheckCircle2, Clock
} from 'lucide-react';

const PRESET_PIPELINES: PipelinePreset[] = [
  {
    id: 'shorts',
    name: 'Shorts Video Automation',
    description: 'Pipeline mengubah rekaman video mentah menjadi klip vertikal siap posting',
    steps: [
      {
        toolId: 'whisperx',
        label: 'Transkrip audio video panjang',
        prompt: 'Ekstrak audio dari video ini, transkripsikan ke bahasa Indonesia dengan stempel waktu per kata secara presisi.',
      },
      {
        toolId: 'funclip',
        label: 'Pilih 10 momen terbaik',
        prompt: 'Dari transkrip yang ada, identifikasi 10 segmen paling bernas dengan hook kuat di 3 detik pertama berdurasi 30-60 detik.',
      },
      {
        toolId: 'davinci-resolve',
        label: 'Finishing subtitle & klip',
        prompt: 'Terapkan rasio 9:16 vertikal, buat subtitle otomatis dengan font tebal kontras tinggi di bagian tengah-bawah layar.',
      },
      {
        toolId: 'flux-github',
        label: 'Buat thumbnail fotorealistik',
        prompt: 'Generate thumbnail poster 9:16 dengan pencahayaan sinematik dramatis, ekspresi wajah kuat, dan ruang kosong untuk teks judul.',
      },
    ],
  },
  {
    id: 'research',
    name: 'Deep Academic Research',
    description: 'Pipeline mengolah paper ilmiah dan sintesis literatur tanpa halusinasi',
    steps: [
      {
        toolId: 'gpt-researcher',
        label: 'Kumpulkan sumber & survei web',
        prompt: 'Kumpulkan 15 sumber literatur akademik kredibel tentang [topik] beserta ringkasan metodologi dan temuannya.',
      },
      {
        toolId: 'notebooklm',
        label: 'Tanya dokumen sendiri (RAG)',
        prompt: 'Berdasarkan dokumen yang saya unggah saja, petakan persamaan dan kontradiksi utama antar-peneliti.',
      },
      {
        toolId: 'scispace',
        label: 'Urai persamaan matematis',
        prompt: 'Jelaskan arti variabel dan implikasi dari rumus pada halaman 4 dengan analogi sehari-hari.',
      },
      {
        toolId: 'obsidian-ai',
        label: 'Susun sintesis berjejaring',
        prompt: 'Format ringkasan catatan ke dalam format Markdown dengan sitasi gaya APA 7th edition dan tag konseptual.',
      },
    ],
  },
  {
    id: 'mvp',
    name: 'Solo Founder MVP Build',
    description: 'Pipeline membuat prototipe web app dan deploy ke internet',
    steps: [
      {
        toolId: 'boltnew',
        label: 'Generate arsitektur UI/UX',
        prompt: 'Buat aplikasi web React dengan dashboard monitoring, tabel filter data, dan form input dengan gaya modern dark mode.',
      },
      {
        toolId: 'opencode',
        label: 'Refactor kode & routing backend',
        prompt: 'Jalankan refactor pada modul data fetching agar memiliki penanganan error yang andal dan struktur modular.',
      },
      {
        toolId: 'supabase',
        label: 'Setup database & Auth',
        prompt: 'Buatkan skema SQL PostgreSQL untuk tabel users, items, dan aktivitas log lengkap dengan Row Level Security.',
      },
      {
        toolId: 'groq-free',
        label: 'Integrasi LLM real-time',
        prompt: 'Hubungkan endpoint Groq API untuk memproses pertanyaan user dengan latensi di bawah 200 milidetik.',
      },
    ],
  },
];

interface PipelineEngineProps {
  onSelectTool: (toolId: string) => void;
}

export const PipelineEngine: React.FC<PipelineEngineProps> = ({ onSelectTool }) => {
  const [activePipelineId, setActivePipelineId] = useState<string>('shorts');
  const [customSteps, setCustomSteps] = useState(PRESET_PIPELINES[0].steps);
  const [copied, setCopied] = useState(false);

  // New step creation
  const [newToolId, setNewToolId] = useState<string>('geminicli');
  const [newLabel, setNewLabel] = useState<string>('');
  const [newPrompt, setNewPrompt] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimIndex, setActiveSimIndex] = useState<number | null>(null);
  const [sampleInput, setSampleInput] = useState('https://youtube.com/watch?v=podcast-tech-ep12');

  const activePipeline = PRESET_PIPELINES.find((p) => p.id === activePipelineId);
  const currentSteps = activePipelineId === 'custom' ? customSteps : (activePipeline ? activePipeline.steps : customSteps);

  const switchPipeline = (id: string) => {
    setActivePipelineId(id);
    setIsSimulating(false);
    setActiveSimIndex(null);
    if (id !== 'custom') {
      const p = PRESET_PIPELINES.find((item) => item.id === id);
      if (p) setCustomSteps([...p.steps]);
    }
  };

  const copyToCustom = () => {
    if (activePipeline) {
      setCustomSteps([...activePipeline.steps]);
    }
    setActivePipelineId('custom');
  };

  const moveStep = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= customSteps.length) return;
    const updated = [...customSteps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCustomSteps(updated);
    setActivePipelineId('custom');
  };

  const removeStep = (idx: number) => {
    setCustomSteps((prev) => prev.filter((_, i) => i !== idx));
    setActivePipelineId('custom');
  };

  const addCustomStep = (e: React.FormEvent) => {
    e.preventDefault();
    const tool = TOOLS.find((t) => t.id === newToolId);
    const step = {
      toolId: newToolId,
      label: newLabel || (tool ? tool.func.slice(0, 40) : 'Langkah Tambahan'),
      prompt: newPrompt || (tool ? `Gunakan ${tool.name} untuk: ${tool.func}` : 'Jalankan task ini.'),
    };
    setCustomSteps((prev) => [...prev, step]);
    setNewLabel('');
    setNewPrompt('');
    setIsAdding(false);
    setActivePipelineId('custom');
  };

  // Execution simulator handler
  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimIndex(0);

    for (let i = 0; i < currentSteps.length; i++) {
      setActiveSimIndex(i);
      await new Promise((res) => setTimeout(res, 1200));
    }

    setActiveSimIndex(currentSteps.length);
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setActiveSimIndex(null);
  };

  const copyPromptChain = () => {
    const text = currentSteps
      .map((s, idx) => {
        const t = TOOLS.find((tool) => tool.id === s.toolId);
        return `=== STEP ${idx + 1}: ${t?.name || s.toolId} ===\nFungsi: ${s.label}\nPrompt:\n${s.prompt}\n`;
      })
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadJSON = () => {
    const data = {
      pipelineName: activePipelineId === 'custom' ? 'Pipeline Kustom' : activePipeline?.name,
      stepsCount: currentSteps.length,
      createdAt: new Date().toISOString(),
      steps: currentSteps.map((s, i) => {
        const t = TOOLS.find((tool) => tool.id === s.toolId);
        return {
          order: i + 1,
          toolName: t?.name || s.toolId,
          toolSite: t?.site || '',
          label: s.label,
          prompt: s.prompt,
        };
      }),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-${activePipelineId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadN8N = () => {
    const nodes = [
      {
        name: 'Mulai Otomasi (Trigger)',
        type: 'n8n-nodes-base.manualTrigger',
        typeVersion: 1,
        position: [240, 300],
        parameters: {},
      },
      ...currentSteps.map((s, idx) => {
        const t = TOOLS.find((tool) => tool.id === s.toolId);
        return {
          name: `Step ${idx + 1} - ${t?.name || 'AI Tool'}`,
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.1,
          position: [240 + (idx + 1) * 220, 300],
          notesInFlow: true,
          notes: `${s.label}\nPrompt: ${s.prompt}`,
          parameters: {
            method: 'POST',
            url: t?.site || 'https://api.example.com',
          },
        };
      }),
    ];

    const connections: Record<string, any> = {};
    for (let i = 0; i < nodes.length - 1; i++) {
      connections[nodes[i].name] = {
        main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]],
      };
    }

    const n8nData = {
      name: `RadarAI - ${activePipelineId === 'custom' ? 'Custom Pipeline' : activePipeline?.name}`,
      nodes,
      connections,
    };

    const blob = new Blob([JSON.stringify(n8nData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n-workflow-${activePipelineId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const estimatedSavingsMonthly = currentSteps.length * 450000;
  const estimatedHoursSaved = currentSteps.length * 8;

  return (
    <section id="pipe" className="py-12 sm:py-16 border-b border-slate-800 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <GitBranch className="w-4 h-4" />
              <span>Pipeline & Flow Engine Interaktif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Susun dan Simulasikan Alur Estafet Antar-Tool AI
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Salin prompt berantai (Prompt Chaining), uji alur dengan Simulator Eksekusi, dan ekspor ke n8n Workflow secara langsung.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={copyPromptChain}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Prompt Tersalin!' : 'Salin Prompt Chain'}</span>
            </button>
            <button
              onClick={downloadJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={downloadN8N}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export n8n</span>
            </button>
          </div>
        </div>

        {/* Pipeline Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {PRESET_PIPELINES.map((p) => (
            <button
              key={p.id}
              onClick={() => switchPipeline(p.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
                activePipelineId === p.id
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => setActivePipelineId('custom')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors border ${
              activePipelineId === 'custom'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            Pipeline Kustom Saya ({customSteps.length})
          </button>
        </div>

        {/* Simulator Control Bar */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-slate-300 flex items-center gap-1 shrink-0">
              <Play className="w-3.5 h-3.5 text-emerald-400" /> Input Data Uji:
            </span>
            <input
              type="text"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              className="flex-1 sm:w-80 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-white font-mono text-xs"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {activeSimIndex !== null && (
              <button
                onClick={resetSimulation}
                className="px-2.5 py-1.5 text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isSimulating ? 'Simulasi Berjalan...' : 'Jalankan Simulasi Alur'}</span>
            </button>
          </div>
        </div>

        {/* Chain Visualization with Simulator Status */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 overflow-x-auto mb-6">
          <div className="flex items-center gap-3 min-w-max">
            {currentSteps.map((step, idx) => {
              const tool = TOOLS.find((t) => t.id === step.toolId);
              const isCurrentSim = activeSimIndex === idx;
              const isCompletedSim = activeSimIndex !== null && activeSimIndex > idx;

              return (
                <React.Fragment key={idx}>
                  <div
                    className={`w-64 p-3.5 rounded-xl border relative group flex flex-col justify-between transition-all ${
                      isCurrentSim
                        ? 'border-amber-400 ring-2 ring-amber-400/40 bg-amber-950/20 shadow-lg'
                        : isCompletedSim
                        ? 'border-emerald-500/80 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span className="flex items-center gap-1 font-bold">
                          {isCompletedSim ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : isCurrentSim ? (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          ) : (
                            <Clock className="w-3 h-3 text-slate-400" />
                          )}
                          Step {idx + 1}
                        </span>

                        {activePipelineId === 'custom' && (
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            {idx > 0 && (
                              <button
                                onClick={() => moveStep(idx, 'up')}
                                className="hover:text-white p-0.5"
                                title="Geser ke kiri"
                              >
                                <ArrowUp className="w-3 h-3 rotate-[-90deg]" />
                              </button>
                            )}
                            {idx < currentSteps.length - 1 && (
                              <button
                                onClick={() => moveStep(idx, 'down')}
                                className="hover:text-white p-0.5"
                              >
                                <ArrowDown className="w-3 h-3 rotate-[-90deg]" />
                              </button>
                            )}
                            <button
                              onClick={() => removeStep(idx)}
                              className="text-rose-400 hover:text-rose-300 p-0.5"
                              title="Hapus langkah"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => tool && onSelectTool(tool.id)}
                        className="font-bold text-sm text-cyan-300 hover:underline text-left block truncate"
                      >
                        {tool?.name || step.toolId}
                      </button>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{step.label}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400 truncate">
                      {isCurrentSim ? (
                        <span className="text-amber-300 animate-pulse font-sans font-medium">⚡ Sedang mengeksekusi...</span>
                      ) : isCompletedSim ? (
                        <span className="text-emerald-300 font-sans font-medium">✓ Hasil siap diteruskan</span>
                      ) : (
                        step.prompt
                      )}
                    </div>
                  </div>

                  {idx < currentSteps.length - 1 && (
                    <span
                      className={`text-lg font-bold select-none transition-colors ${
                        isCompletedSim ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      ➜
                    </span>
                  )}
                </React.Fragment>
              );
            })}

            {activePipelineId === 'custom' && (
              <button
                onClick={() => setIsAdding(!isAdding)}
                className="w-48 h-32 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 hover:text-white gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>+ Tambah Langkah</span>
              </button>
            )}
          </div>
        </div>

        {/* Add Step Drawer in Custom Mode */}
        {isAdding && activePipelineId === 'custom' && (
          <form onSubmit={addCustomStep} className="p-4 bg-slate-900 border border-slate-800 rounded-xl mb-6 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Tambah Langkah ke Pipeline</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pilih Tool</label>
                <select
                  value={newToolId}
                  onChange={(e) => setNewToolId(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                >
                  {TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Label Tindakan</label>
                <input
                  type="text"
                  placeholder="e.g. Generate visual aset produk"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Prompt Instruksi</label>
              <textarea
                rows={2}
                placeholder="Tuliskan prompt yang akan dikirim ke tool ini..."
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium bg-amber-400 text-slate-950 rounded hover:bg-amber-300 transition-colors"
              >
                Simpan Langkah
              </button>
            </div>
          </form>
        )}

        {/* Estimator Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-mono">Estimasi Penghematan SaaS</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">
              Rp {estimatedSavingsMonthly.toLocaleString('id-ID')}/bln
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-mono">Waktu Kerja Terpangkas</span>
            <span className="text-lg font-bold text-cyan-400 font-mono">
              ≈ {estimatedHoursSaved} Jam / bulan
            </span>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            {activePipelineId !== 'custom' ? (
              <button
                onClick={copyToCustom}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
              >
                Salin ke Pipeline Kustom untuk Diedit
              </button>
            ) : (
              <span className="text-amber-400 font-mono text-xs">Mode Kustom Aktif</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

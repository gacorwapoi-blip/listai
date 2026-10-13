import React, { useState, useRef, useEffect } from 'react';
import { PlanNode, PlanEdge, EdgeAnalysisResult } from '../types';
import { TOOLS } from '../data/tools';
import {
  Compass, Plus, Copy, Download, Trash2, Check, RefreshCw,
  ZoomIn, ZoomOut, Maximize2, Link as LinkIcon, ArrowRight,
  AlertTriangle, Sparkles, HelpCircle, Eye
} from 'lucide-react';

const NODE_TYPES = {
  ide: { label: 'Ide', color: '#FFB454', emoji: '💡', bg: 'bg-amber-500/10 border-amber-500/40 text-amber-300' },
  langkah: { label: 'Langkah', color: '#38BDF8', emoji: '🪜', bg: 'bg-sky-500/10 border-sky-500/40 text-sky-300' },
  tool: { label: 'Tool', color: '#4ADE80', emoji: '🧰', bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' },
  hasil: { label: 'Hasil', color: '#A78BFA', emoji: '🎯', bg: 'bg-purple-500/10 border-purple-500/40 text-purple-300' },
  risiko: { label: 'Risiko', color: '#FB7185', emoji: '⚠️', bg: 'bg-rose-500/10 border-rose-500/40 text-rose-300' },
};

const SAMPLE_PRESETS: { name: string; nodes: PlanNode[]; edges: PlanEdge[] }[] = [
  {
    name: 'Klip Shorts dari Podcast (Viral Machine)',
    nodes: [
      { id: 'n1', type: 'ide', t: 'Klip Shorts dari Podcast 1 Jam', note: 'Mengubah 1 video panjang jadi 10 klip Reels/Shorts siap posting', x: 40, y: 50 },
      { id: 'n2', type: 'langkah', t: 'Ekstraksi Audio & Transkrip Cepat', note: 'Butuh stempel waktu presisi per kata', x: 280, y: 50 },
      { id: 'n3', type: 'tool', t: 'WhisperX', note: 'Transkripsi kata per kata offline', tid: 'whisperx', x: 520, y: 50 },
      { id: 'n4', type: 'tool', t: 'FunClip', note: 'Pilih segmen kutipan terbaik', tid: 'funclip', x: 520, y: 190 },
      { id: 'n5', type: 'hasil', t: '10 Klip Video Siap Upload', note: 'Format 9:16 dengan hook kuat', x: 760, y: 190 },
      { id: 'n6', type: 'risiko', t: 'Transkripsi Salah Nama Tokoh', note: 'Koreksi cepat manual sebelum rendering final', x: 760, y: 50 },
    ],
    edges: [
      { f: 'n1', t: 'n2', r: 'Ide dipecah menjadi langkah operasional' },
      { f: 'n2', t: 'n3', r: 'Langkah transkrip menggunakan WhisperX' },
      { f: 'n3', t: 'n4', r: 'Output teks diteruskan ke FunClip' },
      { f: 'n4', t: 'n5', r: 'FunClip menghasilkan 10 video final' },
      { f: 'n3', t: 'n6', r: 'Potensi salah eja nama tokoh lokal' },
    ],
  },
  {
    name: 'Literature Review Skripsi 30 Paper',
    nodes: [
      { id: 'n1', type: 'ide', t: 'Tinjauan Pustaka Skripsi Bab 2', note: 'Sintesis 30 paper bereputasi tanpa halusinasi', x: 40, y: 70 },
      { id: 'n2', type: 'langkah', t: 'Pencarian Literatur Terverifikasi', note: 'Cari paper ber-DOI dan berindeks Scopus', x: 270, y: 70 },
      { id: 'n3', type: 'tool', t: 'Consensus', note: 'Cek konsensus ilmiah paper', tid: 'consensus', x: 500, y: 70 },
      { id: 'n4', type: 'tool', t: 'NotebookLM', note: 'Ingest 30 PDF untuk grounded RAG', tid: 'notebooklm', x: 500, y: 200 },
      { id: 'n5', type: 'hasil', t: 'Draft Sintesis Bab 2 Rapi', note: 'Matriks perbandingan dengan sitasi APA', x: 740, y: 200 },
      { id: 'n6', type: 'risiko', t: 'Paper Predatori / Tidak Kredibel', note: 'Validasi reputasi jurnal di Scimago/SJR', x: 740, y: 70 },
    ],
    edges: [
      { f: 'n1', t: 'n2', r: 'Ide diterjemahkan ke langkah pencarian' },
      { f: 'n2', t: 'n3', r: 'Cari konsensus awal via Consensus' },
      { f: 'n3', t: 'n4', r: 'Paper diunggah ke NotebookLM' },
      { f: 'n4', t: 'n5', r: 'Q&A menghasilkan draf sintesis berdasar bukti' },
      { f: 'n2', t: 'n6', r: 'Filter paper abal-abal sejak awal' },
    ],
  },
];

const TRANSITION_RULES: Record<string, [0 | 1 | 2, string]> = {
  'ide>ide': [0, 'Ide dikembangkan dari ide lain. Batasi 2 tingkat agar tidak melebar.'],
  'ide>langkah': [0, 'Ide dipecah jadi langkah dulu sebelum memilih tool. Ini urutan terbaik.'],
  'ide>tool': [1, 'Ide langsung ke tool tanpa memetakan langkah. Sisipkan node Langkah agar pilihan tool beralasan.'],
  'ide>hasil': [2, 'Ide langsung ke hasil melewati proses kerja. Tidak ada jaminan hasil tercapai.'],
  'ide>risiko': [0, 'Menandai risiko sejak awal ide sangat murah dan efektif.'],
  'langkah>langkah': [0, 'Langkah berurutan membuat rencana bisa dieksekusi terstruktur.'],
  'langkah>tool': [0, 'Tool dipilih untuk mengeksekusi langkah tertentu.'],
  'langkah>hasil': [0, 'Langkah menghasilkan keluaran yang dapat diverifikasi.'],
  'langkah>ide': [2, 'Langkah teknis sebaiknya tidak memicu ide baru di tengah jalan. Catat di ide terpisah.'],
  'langkah>risiko': [0, 'Risiko dipetakan pada langkah rentan, ini tepat.'],
  'tool>langkah': [1, 'Output tool menjadi input bagi langkah berikutnya.'],
  'tool>hasil': [0, 'Keluaran dari tool menjadi hasil nyata.'],
  'tool>ide': [2, 'Tool tidak melahirkan ide. Alirkan ke Hasil terlebih dahulu.'],
  'tool>risiko': [0, 'Mencatat batasan kuota atau kelemahan tool adalah antisipasi tepat.'],
  'hasil>ide': [1, 'Hasil dievaluasi untuk iterasi ide berikutnya.'],
  'hasil>langkah': [0, 'Hasil memicu tindak lanjut berikutnya.'],
  'risiko>langkah': [0, 'Risiko memicu langkah mitigasi.'],
  'risiko>tool': [0, 'Memilih tool khusus untuk meredam risiko.'],
};

export const PlanCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<PlanNode[]>(() => {
    try {
      const saved = localStorage.getItem('radar_plan_nodes');
      return saved ? JSON.parse(saved) : SAMPLE_PRESETS[0].nodes;
    } catch {
      return SAMPLE_PRESETS[0].nodes;
    }
  });

  const [edges, setEdges] = useState<PlanEdge[]>(() => {
    try {
      const saved = localStorage.getItem('radar_plan_edges');
      return saved ? JSON.parse(saved) : SAMPLE_PRESETS[0].edges;
    } catch {
      return SAMPLE_PRESETS[0].edges;
    }
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [copiedMd, setCopiedMd] = useState(false);
  const [viewMode, setViewMode] = useState<'canvas' | 'cards'>('canvas');

  // Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('radar_plan_nodes', JSON.stringify(nodes));
      localStorage.setItem('radar_plan_edges', JSON.stringify(edges));
    } catch {}
  }, [nodes, edges]);

  const addNode = (type: PlanNode['type']) => {
    const id = `node-${Date.now()}`;
    const newNode: PlanNode = {
      id,
      type,
      t: `${NODE_TYPES[type].label} Baru`,
      note: '',
      x: 60 + (nodes.length % 5) * 180,
      y: 60 + Math.floor(nodes.length / 5) * 120,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeIndex(null);
  };

  const deleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.f !== id && e.t !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const handleStartConnect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnectingSourceId(id);
    setSelectedNodeId(id);
  };

  const handleNodeClick = (id: string) => {
    if (connectingSourceId) {
      if (connectingSourceId !== id) {
        const exists = edges.some((e) => e.f === connectingSourceId && e.t === id);
        if (!exists) {
          setEdges((prev) => [...prev, { f: connectingSourceId, t: id, r: '' }]);
        }
      }
      setConnectingSourceId(null);
    } else {
      setSelectedNodeId(id);
      setSelectedEdgeIndex(null);
    }
  };

  // Drag handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (connectingSourceId) return;
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    setDraggingNodeId(id);
    setSelectedNodeId(id);
    setSelectedEdgeIndex(null);

    const rect = canvasRef.current?.getBoundingClientRect();
    const canvasLeft = rect?.left || 0;
    const canvasTop = rect?.top || 0;

    dragOffsetRef.current = {
      x: (e.clientX - canvasLeft) / zoom - node.x,
      y: (e.clientY - canvasTop) / zoom - node.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.round((e.clientX - rect.left) / zoom - dragOffsetRef.current.x));
    const newY = Math.max(10, Math.round((e.clientY - rect.top) / zoom - dragOffsetRef.current.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
  };

  // Rule engine evaluation
  const analyzeEdge = (edge: PlanEdge): EdgeAnalysisResult => {
    const fromNode = nodes.find((n) => n.id === edge.f);
    const toNode = nodes.find((n) => n.id === edge.t);

    if (!fromNode || !toNode) {
      return { v: 1, yes: [], no: ['Node tidak ditemukan'], tip: [] };
    }

    const key = `${fromNode.type}>${toNode.type}`;
    const rule = TRANSITION_RULES[key];

    const result: EdgeAnalysisResult = {
      v: rule ? rule[0] : 0,
      yes: rule && rule[0] === 0 ? [rule[1]] : [],
      no: rule && rule[0] > 0 ? [rule[1]] : [],
      tip: [],
    };

    if (fromNode.type === 'tool' && toNode.type === 'tool') {
      const toolA = TOOLS.find((t) => t.id === fromNode.tid);
      const toolB = TOOLS.find((t) => t.id === toNode.tid);
      if (toolA && toolB) {
        if (toolA.category === toolB.category) {
          result.v = Math.max(result.v, 1) as 0 | 1 | 2;
          result.no.push(`Kategori sama (${toolA.category}). Pastikan ini adalah sambungan estafet, bukan redundansi fungsi.`);
        } else {
          result.yes.push(`${toolA.name} mengalirkan output ke ${toolB.name}.`);
        }
      }
    }

    return result;
  };

  const exportObsidianMarkdown = () => {
    let md = '# 🗺️ Ruang Rencana Radar AI\n\n';
    nodes.forEach((n) => {
      md += `## ${n.t}\n`;
      md += `- **Tipe**: ${NODE_TYPES[n.type].label}\n`;
      if (n.note) md += `- **Catatan**: ${n.note}\n`;
      const targets = edges
        .filter((e) => e.f === n.id)
        .map((e) => {
          const targetNode = nodes.find((node) => node.id === e.t);
          return targetNode ? `[[${targetNode.t}]]` + (e.r ? ` _(${e.r})_` : '') : '';
        })
        .filter(Boolean);

      if (targets.length > 0) {
        md += `- **Lanjut ke**: ${targets.join(', ')}\n`;
      }
      md += '\n';
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 1500);
  };

  const loadPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSelectedNodeId(null);
    setSelectedEdgeIndex(null);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = selectedEdgeIndex !== null ? edges[selectedEdgeIndex] : null;

  return (
    <section id="plan" className="py-12 sm:py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
              <Compass className="w-4 h-4" />
              <span>Ruang Rencana & Visual Node Graph</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ruang Rencana: Kanvas Graf Kerja Obsidian-Style
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Susun alur berpikir secara visual: geser node, hubungkan relasi panah, dan baca analisis kecocokan sistem secara *real-time*.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
            <button
              onClick={exportObsidianMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Markdown Tersalin!' : 'Salin Markdown Obsidian'}</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'canvas' ? 'cards' : 'canvas')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{viewMode === 'canvas' ? 'Mode Kartu List' : 'Mode Kanvas Visual'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Add node buttons & Presets */}
        <div className="flex items-center justify-between gap-3 flex-wrap p-3 bg-slate-900 border border-slate-800 rounded-xl mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1 shrink-0">Tambah Node:</span>
            {(Object.keys(NODE_TYPES) as Array<keyof typeof NODE_TYPES>).map((type) => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-700/80 transition-colors text-white"
              >
                <span>{NODE_TYPES[type].emoji}</span>
                <span>+ {NODE_TYPES[type].label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap ml-auto text-xs">
            <span className="text-slate-400">Preset:</span>
            {SAMPLE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-lg transition-colors"
              >
                {p.name.split(' ')[0]}...
              </button>
            ))}
            <button
              onClick={() => {
                if (confirm('Kosongkan semua node dan sambungan?')) {
                  setNodes([]);
                  setEdges([]);
                  setSelectedNodeId(null);
                  setSelectedEdgeIndex(null);
                }
              }}
              className="text-rose-400 hover:underline p-1"
            >
              Kosongkan
            </button>
          </div>
        </div>

        {connectingSourceId && (
          <div className="p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs flex items-center justify-between mb-3 animate-pulse">
            <span>Mode Sambung Aktif: Klik node target untuk membuat panah relasi...</span>
            <button onClick={() => setConnectingSourceId(null)} className="underline hover:text-white">
              Batal Sambung
            </button>
          </div>
        )}

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Canvas Viewport Column */}
          <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl relative overflow-hidden shadow-2xl">
            {/* Canvas Controls Header */}
            <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                className="p-1 text-slate-300 hover:text-white"
                title="Zoom in"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                className="p-1 text-slate-300 hover:text-white"
                title="Zoom out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 text-slate-300 hover:text-white text-[11px] font-mono px-1"
                title="Reset zoom"
              >
                100%
              </button>
            </div>

            {/* Visual Canvas Area */}
            {viewMode === 'canvas' ? (
              <div
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="w-full h-[520px] overflow-auto relative bg-slate-950 cursor-grab active:cursor-grabbing select-none"
                style={{
                  backgroundImage: 'radial-gradient(#1E293B 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              >
                <div
                  className="w-[1200px] h-[700px] relative transform-origin-top-left"
                  style={{ transform: `scale(${zoom})` }}
                >
                  {/* SVG Connecting Lines Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                    <defs>
                      <marker id="arrow-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#4ADE80" />
                      </marker>
                      <marker id="arrow-yellow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#FACC15" />
                      </marker>
                      <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#FB7185" />
                      </marker>
                    </defs>

                    {edges.map((edge, idx) => {
                      const fromNode = nodes.find((n) => n.id === edge.f);
                      const toNode = nodes.find((n) => n.id === edge.t);
                      if (!fromNode || !toNode) return null;

                      // Calculate connection points
                      const x1 = fromNode.x + 100;
                      const y1 = fromNode.y + 40;
                      const x2 = toNode.x + 100;
                      const y2 = toNode.y + 40;

                      // Smooth cubic curve
                      const dx = Math.abs(x2 - x1) * 0.5;
                      const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                      const analysis = analyzeEdge(edge);
                      const color = analysis.v === 0 ? '#4ADE80' : analysis.v === 1 ? '#FACC15' : '#FB7185';
                      const marker = analysis.v === 0 ? 'url(#arrow-green)' : analysis.v === 1 ? 'url(#arrow-yellow)' : 'url(#arrow-red)';
                      const isSelected = selectedEdgeIndex === idx;

                      return (
                        <g key={idx} className="pointer-events-auto cursor-pointer" onClick={() => setSelectedEdgeIndex(idx)}>
                          {/* Hit area */}
                          <path d={path} fill="none" stroke="transparent" strokeWidth="18" />
                          {/* Visible line */}
                          <path
                            d={path}
                            fill="none"
                            stroke={color}
                            strokeWidth={isSelected ? 3.5 : 2}
                            markerEnd={marker}
                            className="transition-all"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Render Visual Draggable Nodes */}
                  {nodes.map((node) => {
                    const conf = NODE_TYPES[node.type];
                    const isSelected = selectedNodeId === node.id;
                    const isConnecting = connectingSourceId === node.id;

                    return (
                      <div
                        key={node.id}
                        onPointerDown={(e) => handlePointerDown(node.id, e)}
                        onClick={() => handleNodeClick(node.id)}
                        style={{ left: `${node.x}px`, top: `${node.y}px` }}
                        className={`absolute w-48 p-3 rounded-xl border bg-slate-900/90 backdrop-blur-md shadow-xl transition-shadow cursor-grab active:cursor-grabbing z-20 ${
                          isConnecting
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50'
                            : isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold mb-1" style={{ color: conf.color }}>
                          <span className="flex items-center gap-1">
                            <span>{conf.emoji}</span>
                            <span>{conf.label}</span>
                          </span>
                          <button
                            onClick={(e) => handleStartConnect(node.id, e)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                            title="Tarik panah relasi dari node ini"
                          >
                            <LinkIcon className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="font-bold text-xs text-white truncate">{node.t}</div>
                        {node.note && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{node.note}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* List Mode for smaller screens */
              <div className="p-4 space-y-2 max-h-[520px] overflow-y-auto">
                {nodes.map((node) => {
                  const conf = NODE_TYPES[node.type];
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleNodeClick(node.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                        selectedNodeId === node.id
                          ? 'border-amber-400 bg-slate-900'
                          : 'border-slate-800 bg-slate-950'
                      }`}
                    >
                      <div>
                        <span className="font-semibold" style={{ color: conf.color }}>
                          {conf.emoji} {conf.label}:
                        </span>{' '}
                        <strong className="text-white">{node.t}</strong>
                        {node.note && <p className="text-slate-400 text-[11px] mt-0.5">{node.note}</p>}
                      </div>
                      <button
                        onClick={(e) => handleStartConnect(node.id, e)}
                        className="px-2 py-1 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono shrink-0"
                      >
                        Sambung ➜
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Inspector Column */}
          <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{NODE_TYPES[selectedNode.type].emoji}</span>
                    <span className="font-bold text-white text-sm">
                      Detail {NODE_TYPES[selectedNode.type].label}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Judul Node</label>
                  <input
                    type="text"
                    value={selectedNode.t}
                    onChange={(e) =>
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, t: e.target.value } : n))
                      )
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Catatan / Detail Rencana</label>
                  <textarea
                    rows={3}
                    value={selectedNode.note}
                    onChange={(e) =>
                      setNodes((prev) =>
                        prev.map((n) => (n.id === selectedNode.id ? { ...n, note: e.target.value } : n))
                      )
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                {selectedNode.type === 'tool' && (
                  <div>
                    <label className="text-slate-400 block mb-1 font-medium">Sambungkan ke Tool Database</label>
                    <select
                      value={selectedNode.tid || ''}
                      onChange={(e) => {
                        const t = TOOLS.find((tool) => tool.id === e.target.value);
                        setNodes((prev) =>
                          prev.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, tid: e.target.value, t: t ? t.name : n.t }
                              : n
                          )
                        );
                      }}
                      className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                    >
                      <option value="">Pilih Tool...</option>
                      {TOOLS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.category})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={(e) => handleStartConnect(selectedNode.id, e)}
                  className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Sambungkan Node Ini ke Node Lain</span>
                </button>
              </div>
            ) : selectedEdge ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-white text-sm">Analisis Panah Relasi</h4>
                  <button
                    onClick={() => {
                      if (selectedEdgeIndex !== null) {
                        setEdges((prev) => prev.filter((_, idx) => idx !== selectedEdgeIndex));
                        setSelectedEdgeIndex(null);
                      }
                    }}
                    className="text-rose-400 hover:underline"
                  >
                    Hapus Panah
                  </button>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Alasan Relasi Ini Dibuat:</label>
                  <textarea
                    rows={2}
                    value={selectedEdge.r || ''}
                    onChange={(e) => {
                      if (selectedEdgeIndex !== null) {
                        const updated = [...edges];
                        updated[selectedEdgeIndex].r = e.target.value;
                        setEdges(updated);
                      }
                    }}
                    placeholder="Tulis alasan mengapa langkah A mengalir ke langkah B..."
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                  />
                </div>

                {(() => {
                  const insight = analyzeEdge(selectedEdge);
                  return (
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <div className="font-bold text-slate-200">Diagnosa Logika Alur:</div>
                      {insight.yes.map((y, i) => (
                        <div key={i} className="text-emerald-300">✅ {y}</div>
                      ))}
                      {insight.no.map((n, i) => (
                        <div key={i} className="text-rose-300">⚠️ {n}</div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2 text-xs">
                <Compass className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">Kanvas Siap Diedit</p>
                <p className="max-w-xs mx-auto">
                  Geser node dengan mouse/layar sentuh untuk mengatur posisi. Klik icon rantai pada node untuk menghubungkan panah antar-langkah.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

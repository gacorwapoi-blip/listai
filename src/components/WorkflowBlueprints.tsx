import React, { useState } from 'react';
import { WorkflowTrack } from '../types';
import { Workflow, Copy, Check, ArrowRight, Lightbulb, Terminal, Edit3, Sparkles } from 'lucide-react';

const WORKFLOW_TRACKS: WorkflowTrack[] = [
  {
    id: 'student',
    label: '🎓 Pelajar & Mahasiswa',
    title: 'Akselerator Skripsi, Makalah, dan Review Jurnal',
    steps: [
      {
        title: 'Cari Jurnal & Fakta Asli',
        tool: 'Consensus / Semantic Scholar',
        input: 'Topik permasalahan atau pertanyaan riset',
        output: 'Daftar paper ilmiah bereputasi dengan DOI',
        execution: 'Ketik pertanyaan riset secara spesifik dalam bahasa Inggris, ambil 5 paper teratas dengan sitasi terbanyak, catat judul dan DOI-nya.',
        proTip: 'Gunakan kata kunci bahasa Inggris untuk hasil 10x lebih banyak dan kredibel.',
        prompt: 'Cari bukti ilmiah dan konsensus riset untuk: [Topik]. Ringkas temuan utama masing-masing paper beserta metodologinya.',
      },
      {
        title: 'Bedah Istilah & Rumus Rumit',
        tool: 'SciSpace',
        input: 'File PDF jurnal hasil unduhan',
        output: 'Penjelasan konsep ilmiah dalam bahasa sederhana',
        execution: 'Unggah file PDF ke SciSpace, blok paragraf atau rumus yang sulit dimengerti, lalu minta penjelasan dengan analogi sehari-hari.',
        proTip: 'Minta perbandingan langsung dengan kasus nyata di Indonesia.',
        prompt: 'Jelaskan metodologi dan persamaan matematika pada [Bagian/Rumus] dengan analogi sederhana untuk mahasiswa tahun pertama.',
      },
      {
        title: 'Kumpulkan ke Otak AI Pribadi (Grounded RAG)',
        tool: 'NotebookLM',
        input: 'Semua kumpulan paper PDF dan catatan kuliah',
        output: 'Jawaban yang 100% bersumber dari dokumen pribadi',
        execution: 'Buat notebook baru, unggah 20 paper terkait, lalu ajukan pertanyaan spesifik. AI akan menjawab dengan tanda kutip sitasi dokumen asli.',
        proTip: 'Gunakan fitur Audio Overview untuk mendengarkan diskusi 2 pakar saat di perjalanan.',
        prompt: 'Berdasarkan sumber dokumen saya saja, susun outline tinjauan pustaka tentang [Topik] dengan menyertakan rujukan sitasi di setiap poin.',
      },
      {
        title: 'Poles Tata Bahasa & Koherensi',
        tool: 'QuillBot / Grammarly / Hemingway',
        input: 'Draft tulisan paragraf skripsi',
        output: 'Tulisan akademik yang padat dan jelas',
        execution: 'Tempel per paragraf, perbaiki kalimat pasif yang berbelit-belit, dan hilangkan kata-kata klise.',
        proTip: 'Baca tulisan secara bersuara setelah diedit untuk merasakan ritme kalimat.',
        prompt: 'Tingkatkan keterbacaan paragraf ini agar bernada akademik formal tanpa menghilangkan data dan argumen aslinya: [Draft Tulisan].',
      },
      {
        title: 'Ubah Jadi Slide Sidang',
        tool: 'Gamma / SlideSpeak',
        input: 'Ringkasan bab skripsi final',
        output: '10 slide presentasi siap tayang',
        execution: 'Tempel ringkasan, pilih template modern, lalu rapikan hirarki visual satu gagasan per slide.',
        proTip: 'Maksimal 5 baris teks per slide untuk menjaga atensi dosen penguji.',
        prompt: 'Ubah ringkasan tentang [Topik] ini menjadi 10 slide presentasi sidang dengan judul tegas dan bullet point ringkas.',
      },
    ],
  },
  {
    id: 'mvp-dev',
    label: '🧑‍💻 Fullstack MVP',
    title: 'Bangun dan Deploy Aplikasi Web dari Nol dalam 1 Hari',
    steps: [
      {
        title: 'Generate UI & Kerangka Frontend',
        tool: 'Bolt.new / v0.dev',
        input: 'Spesifikasi fitur utama dan target pengguna',
        output: 'Halaman web React fungsional siap preview',
        execution: 'Tuliskan deskripsi komponen lengkap dengan tombol interaktif, tabel data, dan state manajemen dasar.',
        proTip: 'Mulai dari 1 halaman utama (core value) dulu sebelum menambah halaman pendukung.',
        prompt: 'Buat komponen dashboard React dengan Tailwind CSS untuk [Jenis Aplikasi]: sidebar navigasi, grafik penjualan mingguan, dan tabel data filterable.',
      },
      {
        title: 'Refactor Kode & Penanganan Error',
        tool: 'OpenCode / Cline / Aider',
        input: 'Repository hasil generate',
        output: 'Kode bersih, modular, dan teruji',
        execution: 'Jalankan agent di folder proyek, minta refactor modular per modul, dan tambahkan unit test.',
        proTip: 'Gunakan git commit sebelum meminta agen melakukan perubahan skala besar.',
        prompt: 'Refactor modul [Nama Modul] agar mematuhi Clean Code, pisahkan business logic dari komponen presentasional, dan tambahkan try-catch terstruktur.',
      },
      {
        title: 'Deploy Publik Global',
        tool: 'Cloudflare Pages / Vercel',
        input: 'Folder repository git',
        output: 'URL HTTPS aktif dengan CDN global',
        execution: 'Hubungkan repo ke Cloudflare Pages atau Vercel, atur build command npm run build, dan pasang domain gratis.',
        proTip: 'Aktifkan edge caching untuk memangkas latensi pengguna di Asia.',
        prompt: 'Buatkan konfigurasi build otomatis dan environment variable untuk deploy project [Nama Proyek] ke Cloudflare Pages.',
      },
    ],
  },
  {
    id: 'video-viral',
    label: '🎬 Video Klip Shorts',
    title: 'Mesin Repurpose Video Panjang Menjadi Konten Pendek',
    steps: [
      {
        title: 'Transkripsi Presisi Kata',
        tool: 'Whisper.cpp / WhisperX',
        input: 'File audio/video podcast',
        output: 'Teks transkrip lengkap dengan timecode',
        execution: 'Jalankan transkripsi offline, ekspor file subtitle format .srt atau .vtt.',
        proTip: 'Gunakan model medium atau large-v3 untuk akurasi bahasa Indonesia slang.',
        prompt: 'whisper-cli -m models/ggml-medium.bin -l [Bahasa] -f [File Audio] -osrt',
      },
      {
        title: 'Seleksi Momen Bernilai Tinggi',
        tool: 'FunClip / LLM',
        input: 'File transkrip',
        output: '10 timestamp segmen terbaik',
        execution: 'Minta AI mencari bagian diskusi paling kontroversial, mengejutkan, atau solutif.',
        proTip: 'Pastikan 3 detik pertama memiliki hook verbal yang membuat penonton berhenti scrolling.',
        prompt: 'Dari transkrip [Judul Podcast] ini, pilih 10 momen 30-60 detik dengan hook pembuka paling kuat dan sertakan timecode-nya.',
      },
      {
        title: 'Finishing & Subtitle Visual',
        tool: 'CapCut / DaVinci Resolve',
        input: 'Klip video mentah',
        output: 'Video 9:16 siap posting di TikTok/Reels',
        execution: 'Terapkan animasi subtitle per kata, musik latar bebas royalti, dan crop ke rasio 9:16.',
        proTip: 'Letakkan subtitle di area tengah-bawah agar tidak tertutup ikon aplikasi TikTok.',
        prompt: 'Tuliskan 3 alternatif caption dan 5 hashtag relevan untuk video tentang [Topik].',
      },
    ],
  },
  {
    id: 'deep-research',
    label: '🔎 Riset Bersitasi',
    title: 'Riset Pasar, Kompetitor, dan Laporan Industri Otomatis',
    steps: [
      {
        title: 'Crawl Multi-Sumber Otomatis',
        tool: 'GPT Researcher / Firecrawl',
        input: 'Pertanyaan riset mendalam',
        output: 'Kumpulan artikel dan dokumen tervalidasi',
        execution: 'Jalankan agen riset untuk menjelajahi 20+ web, menguji silang data angka, dan menyusun laporan terpadu.',
        proTip: 'Sertakan batasan rentang tahun agar data tidak usang.',
        prompt: 'Lakukan riset mendalam mengenai ukuran pasar dan kompetitor utama industri [Sektor Industri] di Asia Tenggara tahun 2025-2026.',
      },
      {
        title: 'Sintesis dan Perbandingan',
        tool: 'NotebookLM / Open WebUI',
        input: 'Kumpulan artikel hasil crawl',
        output: 'Matriks perbandingan SWOT',
        execution: 'Masukkan ke NotebookLM dan minta tabel perbandingan komparatif fitur, harga, dan kelemahan.',
        proTip: 'Tanyakan: Apa yang TIDAK dibahas oleh kompetitor?',
        prompt: 'Buat tabel matriks perbandingan fitur, kelebihan, dan kelemahan utama dari para pemain [Kompetitor] di atas berdasarkan dokumen sumber.',
      },
    ],
  },
  {
    id: 'no-code-biz',
    label: '⚙️ Automasi Bisnis',
    title: 'Sistem Operasional dan Penjualan Mandiri Rp0',
    steps: [
      {
        title: 'Tangkap Prospek Pelanggan',
        tool: 'Typebot',
        input: 'Pengunjung website / WhatsApp',
        output: 'Data kontak prospek terkualifikasi',
        execution: 'Bangun formulir interaktif dengan pertanyaan bersyarat maksimal 4 langkah.',
        proTip: 'Beri opsi pilihan cepat (chips) agar pengguna tidak lelah mengetik panjang.',
        prompt: 'Rancang alur pertanyaan chatbot kualifikasi prospek jasa [Jenis Layanan] dengan 4 pertanyaan penentu anggaran dan kebutuhan.',
      },
      {
        title: 'Otomatisasi Kirim Notifikasi',
        tool: 'Activepieces / n8n',
        input: 'Data masuk dari Typebot',
        output: 'Notifikasi admin & update database spreadsheet',
        execution: 'Pasang webhook trigger yang mengirim pesan Telegram/WhatsApp seketika prospek mengisi form.',
        proTip: 'Selalu lakukan test run dengan dummy data sebelum live.',
        prompt: 'Buat alur otomasi: ketika webhook formulir [Form Name] menerima data, simpan ke NocoDB dan kirim peringatan ke Telegram.',
      },
    ],
  },
  {
    id: 'branding-visual',
    label: '🎨 Aset Visual & Branding',
    title: 'Produksi Identitas Visual dan Desain Konten Mandiri',
    steps: [
      {
        title: 'Generate Visual Kualitas Tinggi',
        tool: 'FLUX.1 [schnell] / Fooocus',
        input: 'Deskripsi prompt visual',
        output: 'Gambar mentah resolusi tinggi',
        execution: 'Tulis subjek, gaya pencahayaan (studio/rim lighting), tekstur material, dan rasio aspek.',
        proTip: 'Simpan prompt seed yang bagus untuk menjaga konsistensi karakter brand.',
        prompt: 'Studio product photo of [Nama Produk], natural morning lighting, clean concrete surface, 8k resolution, minimalist commercial aesthetic.',
      },
      {
        title: 'Bersihkan Latar & Pertajam Resolusi',
        tool: 'RemBG / Upscayl',
        input: 'Gambar mentah hasil AI',
        output: 'PNG transparan tajam 4K',
        execution: 'Hapus background otomatis secara lokal, lalu perbesar resolusi 4x lipat dengan Upscayl.',
        proTip: 'Upscale dilakukan di tahap paling akhir setelah warna disesuaikan.',
        prompt: 'Jalankan upscaler model Real-ESRGAN dengan scaling factor 4x untuk gambar [Nama File].',
      },
    ],
  },
];

interface WorkflowBlueprintsProps {
  onSelectTool: (toolName: string) => void;
}

export const WorkflowBlueprints: React.FC<WorkflowBlueprintsProps> = ({ onSelectTool }) => {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [customVariable, setCustomVariable] = useState('Dampak AI terhadap Pasar Tenaga Kerja');

  const currentTrack = WORKFLOW_TRACKS[activeTrackIndex];
  const currentStep = currentTrack.steps[activeStepIndex] || currentTrack.steps[0];

  // Replace bracketed placeholders with custom variable
  const computedPrompt = currentStep.prompt.replace(/\[(.*?)\]/g, customVariable || '[$1]');

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 1500);
  };

  return (
    <section id="flow" className="py-12 sm:py-16 border-b border-slate-800 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Workflow className="w-4 h-4" />
            <span>Workflow Blueprint & Customizer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Alur Kerja Langkah Demi Langkah dengan Prompt Siap Pakai
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Isi variabel proyekmu, periksa alur eksekusi dari input ke output, dan salin prompt yang sudah terpersonalisasi secara instan.
          </p>
        </div>

        {/* Track selector chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {WORKFLOW_TRACKS.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setActiveTrackIndex(idx);
                setActiveStepIndex(0);
              }}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors border ${
                activeTrackIndex === idx
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        {/* Steps Breadcrumb / Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {currentTrack.steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                activeStepIndex === idx
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Step {idx + 1}: {step.title.split(' ')[0]}...
            </button>
          ))}
        </div>

        {/* Active Step Detail Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-1">
                Langkah {activeStepIndex + 1} dari {currentTrack.steps.length}
              </div>
              <h3 className="text-xl font-bold text-white">{currentStep.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                <span className="text-slate-400">Rekomendasi Tool:</span>
                <span className="font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  {currentStep.tool}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopyPrompt(computedPrompt)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shrink-0 self-start sm:self-auto shadow-sm"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Prompt Tersalin!' : 'Salin Prompt Terisi'}</span>
            </button>
          </div>

          {/* Interactive Variable Customizer */}
          <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-lg flex flex-col sm:flex-row items-center gap-3 text-xs">
            <span className="font-semibold text-amber-300 flex items-center gap-1.5 shrink-0">
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              Kustomisasi Variabel Topik:
            </span>
            <input
              type="text"
              value={customVariable}
              onChange={(e) => setCustomVariable(e.target.value)}
              placeholder="Ketik topik atau nama proyekmu di sini..."
              className="flex-1 w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-white text-xs focus:outline-none focus:border-amber-400"
            />
            <span className="text-[11px] text-slate-400 shrink-0 hidden sm:inline">
              Prompt otomatis terisi seketika
            </span>
          </div>

          {/* Input & Output comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-slate-400 block mb-1">Bahan Awal (Input):</span>
              <p className="text-white font-medium">{currentStep.input}</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="font-semibold text-emerald-400 block mb-1">Hasil Jadi (Output):</span>
              <p className="text-white font-medium">{currentStep.output}</p>
            </div>
          </div>

          {/* Execution details */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <div>
              <span className="font-semibold text-amber-400 block mb-1">Cara Eksekusi:</span>
              <p className="text-slate-300 leading-relaxed">{currentStep.execution}</p>
            </div>
            <div className="pt-2 border-t border-slate-900 flex items-start gap-2 text-slate-400">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-slate-300">Pro-Tip:</strong> {currentStep.proTip}</span>
            </div>
          </div>

          {/* Prompt block with real-time variable replacement */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="flex items-center gap-1 text-slate-300 font-medium">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                Prompt / Perintah Siap Pakai (Sudah Disesuaikan):
              </span>
            </div>
            <pre className="p-3.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed select-all">
              {computedPrompt}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Coins, Calendar, Clock, CheckCircle2, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';

const SERVICE_IDEAS = [
  { title: 'Jasa Potong Video Podcast jadi 10 Klip Reels/Shorts', tools: 'FunClip + WhisperX + CapCut', tariff: 'Rp 50.000 – Rp 150.000 / klip' },
  { title: 'Jasa Transkripsi & Subtitle Video Multibahasa', tools: 'Whisper.cpp + WhisperX', tariff: 'Rp 10.000 / menit rekaman' },
  { title: 'Jasa Sintesis Laporan Riset Pasar & Kompetitor', tools: 'GPT Researcher + NotebookLM', tariff: 'Rp 500.000 – Rp 1.500.000 / laporan' },
  { title: 'Setup Chatbot FAQ & WhatsApp Lead Gen UMKM', tools: 'Typebot + Chatwoot + Activepieces', tariff: 'Rp 1.000.000 – Rp 2.500.000 / sistem' },
  { title: 'Otomatisasi Database & Notifikasi Sales Toko Online', tools: 'n8n (Self-Host) + NocoDB', tariff: 'Rp 750.000 – Rp 2.000.000 setup' },
  { title: 'Paket Desain 30 Konten Media Sosial Bulanan', tools: 'FLUX.1 + Penpot + RemBG', tariff: 'Rp 1.000.000 / bulan' },
  { title: 'Jasa Voice Over & Dubbing AI Natural', tools: 'WhisperX + Coqui TTS / Bark', tariff: 'Rp 100.000 / audio 2 menit' },
  { title: 'Pembersihan & Visualisasi Dashboard Data Penjualan', tools: 'DuckDB + Metabase / Streamlit', tariff: 'Rp 1.500.000 / dashboard' },
  { title: 'Pembuatan Second Brain & Template Obsidian Kustom', tools: 'Obsidian + Smart Connections', tariff: 'Rp 300.000 – Rp 700.000' },
  { title: 'Newsletter / Kurasi Mingguan AI Berbayar', tools: 'Open Notebook + Firecrawl', tariff: 'Rp 50.000 / pelanggan / bulan' },
];

const SEVEN_DAY_SPRINT = [
  { day: 'Hari 1', title: 'Pilih 1 Niche Jasa & Kuasai 1 Stack', desc: 'Fokus pada satu masalah spesifik (misal: klip video podcaster atau bot order online shop).' },
  { day: 'Hari 2', title: 'Bikin 3 Contoh Portofolio Nyata', desc: 'Gunakan video YouTube publik atau data dummy untuk membuat hasil sebelum-dan-sesudah yang memukau.' },
  { day: 'Hari 3', title: 'Susun Penawaran 1 Halaman yang Tajam', desc: 'Jelaskan apa yang didapat klien, estimasi waktu pengerjaan 24 jam, dan jaminan revisi.' },
  { day: 'Hari 4', title: 'Outreach Dingin ke 10 Calon Klien Ideal', desc: 'Kirimkan sampel gratis 1 klip atau 1 template langsung ke DM kreator/pemilik usaha.' },
  { day: 'Hari 5', title: 'Follow-Up & Iterasi Penawaran', desc: 'Tanya feedback mereka, tawarkan uji coba gratis untuk meyakinkan mereka.' },
  { day: 'Hari 6', title: 'Kerjakan Proyek Klien Pertama', desc: 'Eksekusi menggunakan pipeline otomatisasi yang sudah kamu latih sebelumnya.' },
  { day: 'Hari 7', title: 'Minta Testimoni & Tawarkan Paket Retainer', desc: 'Jadikan studi kasus, pasang di medsos, lalu tawarkan langganan per bulan.' },
];

const TWO_HOUR_NIGHT = [
  { time: '00:00 - 00:30', task: 'Pilih 1 Stack di Tab Stack Builder', detail: 'Tentukan apakah kamu mau fokus di video shorts, riset dokumen, atau chatbot UMKM.' },
  { time: '00:30 - 01:15', task: 'Uji Coba dengan Data Riil Milikmu', detail: 'Unduh 1 podcast pendek, transkripsikan dengan WhisperX, dan potong klip terbaiknya.' },
  { time: '01:15 - 01:45', task: 'Simpan Hasil Jadi Sebagai Bahan Portofolio', detail: 'Kemas hasil jadinya ke dalam format Google Drive atau link preview siap bagi.' },
  { time: '01:45 - 02:00', task: 'Posting Portofolio ke Twitter/X atau LinkedIn', detail: 'Tuliskan thread singkat: "Cara saya memotong video 1 jam jadi 5 klip dalam 10 menit dengan budget Rp0".' },
];

export const MonetizationRoadmap: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyRoadmap = () => {
    const text = `ROADMAP CUAN RP0 DENGAN AI GRATIS\n\n10 IDE JASA:\n${SERVICE_IDEAS.map((s, i) => `${i + 1}. ${s.title} (${s.tariff}) via ${s.tools}`).join('\n')}\n\nRENCANA 7 HARI:\n${SEVEN_DAY_SPRINT.map((d) => `${d.day}: ${d.title} - ${d.desc}`).join('\n')}\n\nSPRINT 2 JAM MALAM INI:\n${TWO_HOUR_NIGHT.map((t) => `${t.time}: ${t.task} (${t.detail})`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="money" className="py-12 sm:py-16 bg-[#090D16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Coins className="w-4 h-4" />
              <span>Monetisasi Modal Rp0</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Aksi Nyata Menghasilkan Cuan dari Tools AI Gratis
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Software-nya gratis, tapi nilai waktu dan hasil akhirnya sangat berharga bagi klien yang tidak sempat belajar teknis.
            </p>
          </div>

          <button
            onClick={copyRoadmap}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors self-start sm:self-auto shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Roadmap Tersalin!' : 'Salin Seluruh Roadmap'}</span>
          </button>
        </div>

        {/* 2-Column: 10 Service Ideas vs 7-Day & 2-Hour Action Sprint */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 10 Service Ideas with Pricing Targets */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>10 Layanan Jasa Bernilai Tinggi dengan Tools Rp0</span>
            </h3>

            <div className="space-y-2.5">
              {SERVICE_IDEAS.map((idea, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5 flex-1 pr-2">
                    <span className="font-semibold text-white block">{idea.title}</span>
                    <span className="text-slate-400 font-mono text-[11px] block">Tools: {idea.tools}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 shrink-0 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40 self-start sm:self-auto">
                    {idea.tariff}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 7-Day Plan + 2-Hour Tonight Sprint */}
          <div className="lg:col-span-5 space-y-6">
            {/* 7-Day Sprint */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Rencana Sprint 7 Hari: Nol ke Klien Pertama</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                {SEVEN_DAY_SPRINT.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-950/60 transition-colors">
                    <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/50 shrink-0">
                      {s.day}
                    </span>
                    <div>
                      <strong className="text-white block font-medium">{s.title}</strong>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2-Hour Tonight Sprint */}
            <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-bold text-amber-300 flex items-center gap-2 pb-2 border-b border-amber-900/40">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Sprint 2 Jam Malam Ini (00:00 – 02:00)</span>
              </h3>

              <div className="space-y-2 text-xs">
                {TWO_HOUR_NIGHT.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-amber-400 font-mono text-[11px] font-bold">
                      <span>{item.time}</span>
                    </div>
                    <strong className="text-white block font-medium">{item.task}</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

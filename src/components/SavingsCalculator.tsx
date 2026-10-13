import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data/tools';
import { SubscriptionItem } from '../types';
import { Calculator, Plus, Trash2, ArrowRight, RefreshCw, CheckCircle2, Copy, Check } from 'lucide-react';

const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  { id: 'chatgpt', name: 'ChatGPT Plus', monthlyUSD: 20, alternativeToolId: 'huggingchat', defaultChecked: true },
  { id: 'midjourney', name: 'Midjourney', monthlyUSD: 30, alternativeToolId: 'flux-github', defaultChecked: true },
  { id: 'copilot', name: 'GitHub Copilot', monthlyUSD: 10, alternativeToolId: 'continue', defaultChecked: true },
  { id: 'cursor', name: 'Cursor Pro', monthlyUSD: 20, alternativeToolId: 'opencode', defaultChecked: false },
  { id: 'zapier', name: 'Zapier Pro', monthlyUSD: 20, alternativeToolId: 'n8n', defaultChecked: true },
  { id: 'opusclip', name: 'OpusClip Pro', monthlyUSD: 29, alternativeToolId: 'funclip', defaultChecked: false },
  { id: 'notionai', name: 'Notion AI', monthlyUSD: 10, alternativeToolId: 'affine', defaultChecked: false },
  { id: 'otter', name: 'Otter.ai Pro', monthlyUSD: 17, alternativeToolId: 'whispercpp', defaultChecked: false },
  { id: 'elevenlabs', name: 'ElevenLabs', monthlyUSD: 5, alternativeToolId: 'whisperx', defaultChecked: false },
];

const PRESETS = [
  { name: 'Content Creator', ids: ['midjourney', 'opusclip', 'elevenlabs'] },
  { name: 'Software Engineer', ids: ['chatgpt', 'copilot', 'cursor'] },
  { name: 'Mahasiswa & Riset', ids: ['chatgpt', 'notionai', 'otter'] },
  { name: 'Solo Founder', ids: ['chatgpt', 'copilot', 'zapier', 'midjourney'] },
];

interface SavingsCalculatorProps {
  onSelectTool: (toolId: string) => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({ onSelectTool }) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('radar_subscriptions');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
    } catch {
      return INITIAL_SUBSCRIPTIONS;
    }
  });

  const [checkedIds, setCheckedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('radar_checked_subs');
      return saved ? JSON.parse(saved) : ['chatgpt', 'midjourney', 'copilot', 'zapier'];
    } catch {
      return ['chatgpt', 'midjourney', 'copilot', 'zapier'];
    }
  });

  const [rate, setRate] = useState<number>(15800);
  const [showRateEdit, setShowRateEdit] = useState<boolean>(false);
  const [copiedProposal, setCopiedProposal] = useState(false);

  // Custom new subscription state
  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('radar_subscriptions', JSON.stringify(subscriptions));
      localStorage.setItem('radar_checked_subs', JSON.stringify(checkedIds));
    } catch {}
  }, [subscriptions, checkedIds]);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const applyPreset = (ids: string[]) => {
    setCheckedIds(ids);
  };

  const selectAll = () => {
    setCheckedIds(subscriptions.map((s) => s.id));
  };

  const clearAll = () => {
    setCheckedIds([]);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customPrice) return;
    const price = parseFloat(customPrice);
    if (isNaN(price) || price <= 0) return;

    const newSub: SubscriptionItem = {
      id: `custom-${Date.now()}`,
      name: customName,
      monthlyUSD: price,
      alternativeToolId: 'geminicli',
    };

    setSubscriptions((prev) => [...prev, newSub]);
    setCheckedIds((prev) => [...prev, newSub.id]);
    setCustomName('');
    setCustomPrice('');
    setIsAdding(false);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setCheckedIds((prev) => prev.filter((i) => i !== id));
  };

  // Calculations
  const checkedSubs = subscriptions.filter((s) => checkedIds.includes(s.id));
  const totalMonthlyUSD = checkedSubs.reduce((acc, curr) => acc + curr.monthlyUSD, 0);
  const totalMonthlyIDR = totalMonthlyUSD * rate;
  const totalYearlyIDR = totalMonthlyIDR * 12;

  const formatIDR = (val: number) => {
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
  };

  const handleCopyProposal = () => {
    const lines = checkedSubs.map((s) => {
      const alt = TOOLS.find((t) => t.id === s.alternativeToolId);
      return `- ${s.name} ($${s.monthlyUSD}/bln) ➜ Ganti ke: ${alt?.name || 'Open Tools'} (${alt?.status || 'OSS'})`;
    });

    const report = `📊 PROPOSAL EFISIENSI SOFTWARE AI (RADAR AI)
Kurs: 1 USD = Rp ${rate.toLocaleString('id-ID')}

Layanan yang Dialihkan ke Solusi Gratis:
${lines.join('\n')}

💰 Total Penghematan per Bulan: ${formatIDR(totalMonthlyIDR)} ($${totalMonthlyUSD})
🚀 Total Penghematan per Tahun: ${formatIDR(totalYearlyIDR)}
Investasi Lisensi Pengganti: Rp 0 (100% Free / Self-Hosted / Open-Source)`;

    navigator.clipboard.writeText(report);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 1500);
  };

  return (
    <section id="calc" className="py-12 sm:py-16 border-b border-slate-800 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <Calculator className="w-4 h-4" />
              <span>Kalkulator Efisiensi Budget & State Tersimpan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Hemat Berapa Duit dengan Beralih ke AI Gratis?
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Centang langganan AI bulanan berbayar yang kamu bayar sekarang. Kalkulator langsung menghitung penghematan bersih dan menyusun proposal penghematan.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-lg p-2 self-start md:self-auto">
            <span>Kurs:</span>
            {showRateEdit ? (
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 15800)}
                onBlur={() => setShowRateEdit(false)}
                autoFocus
                className="w-24 px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-amber-300 font-mono text-xs"
              />
            ) : (
              <button
                onClick={() => setShowRateEdit(true)}
                className="text-amber-400 hover:underline font-mono font-medium flex items-center gap-1"
                title="Klik untuk ubah kurs"
              >
                1 USD = Rp {rate.toLocaleString('id-ID')}
                <RefreshCw className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs text-slate-400 font-medium">Preset Cepat:</span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.ids)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={selectAll}
            className="px-3 py-1 text-xs font-medium rounded-full bg-slate-800 text-amber-300 border border-slate-700 transition-colors"
          >
            Pilih Semua
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1 text-xs font-medium rounded-full bg-slate-900 text-slate-400 border border-slate-800 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Subscriptions List */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-medium text-slate-400 mb-3">
              <span>Layanan Berbayar ({checkedIds.length} dicentang)</span>
              <span>Biaya Bulanan</span>
            </div>

            <div className="space-y-2">
              {subscriptions.map((sub) => {
                const isChecked = checkedIds.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      isChecked
                        ? 'bg-slate-800/60 border-slate-700/80 text-white'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheck(sub.id)}
                        className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 focus:ring-offset-slate-900 bg-slate-800"
                      />
                      <span className="text-sm font-medium">{sub.name}</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-medium text-slate-300">
                          {formatIDR(sub.monthlyUSD * rate)}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 block">
                          ${sub.monthlyUSD}/bln
                        </span>
                      </div>

                      {sub.id.startsWith('custom-') && (
                        <button
                          onClick={() => removeSubscription(sub.id)}
                          className="text-slate-400 hover:text-rose-400 p-1"
                          title="Hapus langganan kustom"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Subscription Form */}
            {isAdding ? (
              <form onSubmit={handleAddCustom} className="mt-4 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nama SaaS (e.g. Claude Pro)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="20"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-20 px-2 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-amber-400 text-slate-950 rounded hover:bg-amber-300 transition-colors"
                >
                  Tambah
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="mt-4 w-full py-2 border border-dashed border-slate-800 hover:border-slate-700 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Langganan Sendiri
              </button>
            )}
          </div>

          {/* Right Column: Savings Summary & Recommended Replacements */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Total Estimasi Penghematan
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight tabular-nums">
                {formatIDR(totalMonthlyIDR)}
                <span className="text-sm font-normal text-slate-400 font-sans ml-1">/ bulan</span>
              </div>
              <div className="text-sm font-mono text-slate-300 mt-1 flex items-center gap-2">
                <span>≈ {formatIDR(totalYearlyIDR)} per tahun</span>
                <span className="text-xs text-slate-400 font-sans">(${totalMonthlyUSD}/bln)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Pengganti Gratis
                </h3>

                {checkedSubs.length > 0 && (
                  <button
                    onClick={handleCopyProposal}
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    title="Salin rincian laporan penghematan"
                  >
                    {copiedProposal ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedProposal ? 'Tersalin!' : 'Salin Laporan'}</span>
                  </button>
                )}
              </div>

              {checkedSubs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Belum ada langganan yang dicentang. Centang minimal satu untuk melihat pengganti Rp0.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {checkedSubs.map((sub) => {
                    const altTool = TOOLS.find((t) => t.id === sub.alternativeToolId);
                    return (
                      <div
                        key={sub.id}
                        className="text-xs p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2"
                      >
                        <span className="text-slate-400 font-medium truncate">
                          {sub.name}
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                        <button
                          onClick={() => altTool && onSelectTool(altTool.id)}
                          className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1 truncate text-right"
                        >
                          <span>{altTool?.name || 'Open Tools'}</span>
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800/60">
                            {altTool?.status || 'OSS'}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              💡 <span className="text-slate-300 font-medium">Tips:</span> Checklist ini tersimpan otomatis di browser Anda, sehingga saat Anda membuka kembali halaman ini, perhitungan penghematan Anda tetap terjaga.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

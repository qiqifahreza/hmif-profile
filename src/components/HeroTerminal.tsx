import React, { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';
import { useData } from '../context/DataContext';

export const HeroTerminal: React.FC = () => {
  const { settings } = useData();
  const [copied, setCopied] = useState(false);

  const command = 'npx uisi-hmif --cabinet samvaya --status active';

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-none mx-auto rounded-2xl overflow-hidden liquid-glass border border-slate-300 dark:border-[#3c3c44] shadow-2xl font-mono text-xs text-left animate-fade-down">
      {/* Title Bar Terminal macOS Style */}
      <div className="px-4 py-3 bg-slate-200/80 dark:bg-[#16161b] border-b border-slate-300 dark:border-[#3c3c44] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="ml-2 text-[11px] opacity-60 text-slate-700 dark:text-[#bebeca] flex items-center gap-1 font-semibold">
            <Terminal size={12} /> bash ~ samvaya-core
          </span>
        </div>
        <button
          type="button"
          onClick={copyCommand}
          className="p-1 hover:bg-slate-300 dark:hover:bg-white/10 rounded text-slate-500 dark:text-[#bebeca] cursor-pointer"
          title="Salin Command"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
        </button>
      </div>

      {/* Konten Output Terminal */}
      <div className="p-5 space-y-3 bg-white/60 dark:bg-[#0f0f13]/90 text-slate-800 dark:text-[#bebeca]">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="text-emerald-500 font-extrabold">&gt;</span>
          <span>{command}</span>
        </div>

        <div className="space-y-1.5 text-[11px] opacity-85 leading-relaxed pt-1">
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold">[✓] System Initialized: {settings.cabinet_name || 'KABINET SAMVAYA'}</p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">[✓] Organization: {settings.org_name || 'Himpunan Mahasiswa Informatika'}</p>
          <p className="text-slate-600 dark:text-[#bebeca]/80">[i] Campus: {settings.univ_name || 'UISI'}</p>
          <p className="text-slate-600 dark:text-[#bebeca]/80">[i] Active Nodes: 8 Departemen &amp; BPH Terintegrasi</p>
          <p className="text-amber-600 dark:text-amber-400 font-semibold">[★] Mission: Akselerasi Potensi &amp; Sinergi Karya IT</p>
        </div>

        <div className="pt-2 flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#bebeca]/50">
          <span className="text-emerald-500">&gt;</span>
          <span>awaiting next input</span>
          <span className="w-2 h-3.5 bg-slate-800 dark:bg-[#bebeca] animate-pulse inline-block ml-1" />
        </div>
      </div>
    </div>
  );
};
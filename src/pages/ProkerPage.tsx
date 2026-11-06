import React, { useState } from 'react';
import { Calendar, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import type { ProkerStatus } from '../types';

export const ProkerPage: React.FC = () => {
  const { divisions } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const statuses: ('Semua' | ProkerStatus)[] = ['Semua', 'Direncanakan', 'Akan Datang', 'Berlangsung', 'Selesai'];

  const allPrograms = divisions.flatMap((d) =>
    d.programs.map((p, idx) => ({
      ...p,
      divName: d.name,
      divShort: d.shortName,
      divSlug: d.slug,
      idx,
    }))
  );

  const filtered = selectedStatus === 'Semua'
    ? allPrograms
    : allPrograms.filter((p) => p.status === selectedStatus);
const getStatusBadge = (status?: ProkerStatus) => {
  switch (status) {
    case 'Selesai':
      return <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><CheckCircle2 size={12}/> Selesai</span>;
    case 'Berlangsung':
      return <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><Clock size={12}/> Berlangsung</span>;
    case 'Akan Datang':
      return <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><Clock size={12}/> Akan Datang</span>;
    default:
      return <span className="bg-slate-500/15 text-slate-300 border border-slate-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><AlertCircle size={12}/> Direncanakan</span>;
  }
};

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-[#bebeca] bg-primary/20 px-3.5 py-1.5 rounded-full border border-secondary/25">
          Agenda &amp; Pelaksanaan
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-white dark:text-white light:text-[#121215]">
          Program Kerja Organisasi
        </h1>
        <p className="text-sm opacity-80">Seluruh program kerja yang diusung oleh setiap departemen Kabinet Samvaya.</p>
      </div>

      {/* Filter Status */}
      <div className="flex flex-wrap justify-center gap-2">
        {statuses.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedStatus === st ? 'bg-[#bebeca] text-[#121215] shadow-md' : 'liquid-glass border border-secondary/20 opacity-80 hover:opacity-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* List Program Kerja dengan Spotlight */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <SpotlightCard
            key={i}
            to={`/proker/${p.divSlug}/${p.idx}`}
            className="p-6 h-full"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <span className="text-[11px] font-mono uppercase text-secondary font-bold">{p.divShort}</span>
                {getStatusBadge(p.status)}
              </div>
              <h3 className="font-bold text-lg mb-2 text-white dark:text-white light:text-[#121215] group-hover:text-secondary transition-colors leading-snug">{p.title}</h3>
              <p className="text-xs opacity-80 line-clamp-3 leading-relaxed mb-6">{p.description}</p>
            </div>

            <div className="pt-4 border-t border-secondary/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 opacity-80 font-mono">
                <Calendar size={14} />
                <span>{p.period || 'Coming Soon'}</span>
              </div>
              <span className="text-secondary font-semibold flex items-center gap-1">
                Detail <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};
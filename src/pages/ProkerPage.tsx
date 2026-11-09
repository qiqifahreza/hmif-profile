import React, { useState, useMemo } from 'react';
import { Calendar, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import type { ProkerStatus } from '../types';
import { CardSkeleton } from '../components/Skeleton';

export const ProkerPage: React.FC = () => {
const { divisions, isLoading } = useData();
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statuses: ('Semua' | ProkerStatus)[] = ['Semua', 'Direncanakan', 'Akan Datang', 'Berlangsung', 'Selesai'];

  const allPrograms = useMemo(() => {
    return divisions.flatMap((d) =>
      d.programs.map((p, idx) => ({
        ...p,
        divName: d.name,
        divShort: d.shortName,
        divSlug: d.slug,
        idx,
      }))
    );
  }, [divisions]);

  // Filter pencarian & status
  const filtered = useMemo(() => {
    return allPrograms.filter((p) => {
      const matchStatus = selectedStatus === 'Semua' || (p.status || 'Direncanakan') === selectedStatus;
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.divShort.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [allPrograms, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (st: string) => {
    setSelectedStatus(st);
    setCurrentPage(1);
  };

  const getStatusBadge = (status?: ProkerStatus) => {
    switch (status) {
      case 'Selesai':
        return <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><CheckCircle2 size={12}/> Selesai</span>;
      case 'Berlangsung':
        return <span className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><Clock size={12}/> Berlangsung</span>;
      case 'Akan Datang':
        return <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><Clock size={12}/> Akan Datang</span>;
      default:
        return <span className="bg-slate-200 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"><AlertCircle size={12}/> Direncanakan</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Agenda &amp; Pelaksanaan
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Program Kerja Organisasi
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Seluruh program kerja yang diusung oleh setiap departemen Kabinet Samvaya.
        </p>
      </div>

      {/* Searchbar & Filter Status */}
      <div className="flex flex-col items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Cari nama proker, divisi, atau deskripsi..."
        />
        <div className="flex flex-wrap justify-center gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleStatusChange(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md'
                  : 'bg-white dark:bg-[#1e1e24] border border-slate-300 dark:border-secondary/20 text-slate-700 dark:text-[#bebeca] hover:border-slate-500'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* GRID PROKER DENGAN SKELETON */}
   {isLoading ? (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       {Array.from({ length: 6 }).map((_, i) => (
         <CardSkeleton key={i} />
       ))}
     </div>
   ) : paginated.length === 0 ? (
     <div className="p-16 text-center liquid-glass rounded-3xl border border-slate-300 dark:border-secondary/20 text-slate-600 dark:text-[#bebeca]/70 text-sm">
       Tidak ada program kerja yang sesuai dengan pencarian &quot;{searchQuery}&quot;.
     </div>
   ) : (
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       {paginated.map((p, i) => (
         <SpotlightCard key={i} to={`/proker/${p.divSlug}/${p.idx}`} className="p-6 h-full border border-slate-300/80 dark:border-secondary/20">
              <div>
                <div className="flex justify-between items-start gap-2 mb-3">
                  <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-secondary font-bold">{p.divShort}</span>
                  {getStatusBadge(p.status)}
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-secondary transition-colors leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-3 leading-relaxed mb-6 font-normal">
                  {p.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#bebeca]/80 font-mono">
                  <Calendar size={14} />
                  <span>{p.period || 'Coming Soon'}</span>
                </div>
                <span className="text-slate-900 dark:text-secondary font-semibold flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-white">
                  Detail <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
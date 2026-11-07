import React, { useState, useMemo } from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';

export const CompetitionPage: React.FC = () => {
  const { competitions } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    return competitions.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
      );
    });
  }, [competitions, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Perlombaan &amp; Sayembara
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Informasi Kompetisi IT
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Daftar lomba programming, UI/UX, data science, dan karya inovasi teknologi.
        </p>
      </div>

      <div className="flex justify-center">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari lomba atau penyelenggara..."
        />
      </div>

      {paginated.length === 0 ? (
        <div className="p-12 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-secondary/20 text-slate-600 dark:text-[#bebeca]/70 text-sm">
          {searchQuery ? `Tidak ada kompetisi dengan kata kunci "${searchQuery}".` : 'Belum ada info kompetisi saat ini.'}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((c) => (
            <SpotlightCard key={c.id} className="p-6 border border-slate-300/80 dark:border-secondary/20 flex flex-col justify-between">
              <div>
                {c.poster_url && (
                  <img src={c.poster_url} alt={c.title} className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-300 dark:border-[#3c3c44]" />
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-[#bebeca]">{c.organizer}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Dibuka' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/15 text-red-600 dark:text-red-400'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-4 text-slate-950 dark:text-white leading-snug">{c.title}</h3>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-[#bebeca]/80">
                  <Calendar size={14} />
                  <span>Batas: {c.deadline}</span>
                </div>
                <a
                  href={c.registration_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shadow-md"
                >
                  Daftar Sekarang <ExternalLink size={14} />
                </a>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
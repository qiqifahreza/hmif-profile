import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { CardSkeleton } from '../components/Skeleton';

export const AnnouncementPage: React.FC = () => {
  const { announcements, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const published = useMemo(() => announcements.filter((a) => a.is_published), [announcements]);

  const filtered = useMemo(() => {
    return published.filter((a) => {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    });
  }, [published, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-10 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Kanal Informasi Resmi
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Pengumuman HMIF
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Informasi rilis, pendaftaran kegiatan, dan surat edaran resmi himpunan.
        </p>
      </div>

      {/* Searchbar */}
      <div className="flex justify-center">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari judul atau isi pengumuman..."
        />
      </div>

      {/* Konten Daftar Pengumuman (1 Kolom HP/Tab, 2 Kolom Laptop/Desktop) */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="p-16 text-center liquid-glass rounded-3xl border border-slate-300 dark:border-secondary/20 text-slate-600 dark:text-[#bebeca]/70 text-sm space-y-3">
          <p>
            {searchQuery
              ? `Tidak ada pengumuman dengan kata kunci "${searchQuery}".`
              : 'Belum ada pengumuman resmi yang dipublikasikan.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold cursor-pointer hover:opacity-90 transition-all"
            >
              Reset Pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginated.map((a) => (
            <SpotlightCard key={a.id} className="p-6 sm:p-8 border border-slate-300/80 dark:border-secondary/20 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#bebeca]/70 mb-2">
                  <Calendar size={14} />
                  <span>{a.published_date}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-snug">{a.title}</h2>
                {a.poster_url && (
                  <img src={a.poster_url} alt={a.title} className="max-h-72 w-full object-contain rounded-xl bg-black/10 my-4" />
                )}
                <p className="text-sm text-slate-700 dark:text-[#bebeca]/90 leading-relaxed whitespace-pre-line font-normal mt-3">
                  {a.content}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
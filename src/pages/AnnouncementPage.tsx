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
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center">
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

      <div className="flex justify-center">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari judul atau isi pengumuman..."
        />
      </div>

      <div className="space-y-6">
        {isLoading ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
        ) : (
          paginated.map((a) => (
            <SpotlightCard key={a.id} className="p-6 sm:p-8 border border-slate-300/80 dark:border-secondary/20 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#bebeca]/70">
                <Calendar size={14} />
                <span>{a.published_date}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">{a.title}</h2>
              {a.poster_url && (
                <img src={a.poster_url} alt={a.title} className="max-h-96 w-full object-contain rounded-xl bg-black/10 my-4" />
              )}
              <p className="text-sm text-slate-700 dark:text-[#bebeca]/90 leading-relaxed whitespace-pre-line font-normal">{a.content}</p>
            </SpotlightCard>
          ))
        )}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { User } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { CardSkeleton } from '../components/Skeleton';

export const BlogPage: React.FC = () => {
  const { blogs, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const published = useMemo(() => blogs.filter((b) => b.is_published), [blogs]);

  const filtered = useMemo(() => {
    return published.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchTag = b.tags && b.tags.some((t) => t.toLowerCase().includes(q));
      return (
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        matchTag
      );
    });
  }, [published, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Karya Tulis &amp; Insight
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Blog &amp; Edukasi
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Artikel teknologi, tutorial coding, dan catatan pengalaman mahasiswa Informatika.
        </p>
      </div>

      <div className="flex justify-center">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari artikel, topik (#tag), atau penulis..."
        />
      </div>
{isLoading ? (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((b) => (
            <SpotlightCard key={b.id} className="p-6 border border-slate-300/80 dark:border-secondary/20 flex flex-col justify-between">
              <div>
                {b.cover_url && (
                  <img src={b.cover_url} alt={b.title} className="w-full h-44 object-cover rounded-xl mb-4 border border-slate-300 dark:border-[#3c3c44]" />
                )}
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {b.tags && b.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono bg-slate-200 dark:bg-primary/20 text-slate-800 dark:text-secondary px-2 py-0.5 rounded-full font-semibold border border-slate-300 dark:border-secondary/20">
                      #{t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-950 dark:text-white leading-snug">{b.title}</h3>
                <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-3 leading-relaxed mb-6 font-normal">{b.excerpt}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex items-center justify-between text-xs text-slate-500 dark:text-[#bebeca]/70 font-mono">
                <span className="flex items-center gap-1"><User size={13}/> {b.author}</span>
                <span>{b.published_date}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};
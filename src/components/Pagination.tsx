import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  // 1. Kumpulkan nomor halaman unik sesuai struktur:
  // [1 (Awal)], [Current - 1], [Current], [Current + 1], [TotalPages (Akhir)]
  const pageNumbers = new Set<number>();
  
  // Halaman paling awal (1)
  pageNumbers.add(1);

  // Halaman -1 dari yang sedang digunakan
  if (currentPage - 1 >= 1) {
    pageNumbers.add(currentPage - 1);
  }

  // Halaman yang sedang digunakan
  pageNumbers.add(currentPage);

  // Halaman +1 dari yang sedang digunakan
  if (currentPage + 1 <= totalPages) {
    pageNumbers.add(currentPage + 1);
  }

  // Halaman paling akhir
  pageNumbers.add(totalPages);

  // Urutkan nomor halaman dari kecil ke besar tanpa ada nomor duplikat
  const sortedPages = Array.from(pageNumbers).sort((a, b) => a - b);

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6">
      
      {/* Tombol '<' (Mundur 1 Halaman) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] text-slate-700 dark:text-[#bebeca] disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#232329] transition-all cursor-pointer shadow-sm flex items-center justify-center"
        title="Halaman Sebelumnya"
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {/* Daftar Nomor Halaman (Awal, Current-1, Current, Current+1, Akhir) */}
      <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-xs font-semibold">
        {sortedPages.map((page, index) => {
          const prevPage = sortedPages[index - 1];
          // Tampilkan titik-titik (...) jika ada lompatan halaman
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-1 text-slate-400 dark:text-[#bebeca]/50 select-none font-bold">
                  ...
                </span>
              )}
              
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold scale-105 border border-transparent'
                    : 'border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] text-slate-700 dark:text-[#bebeca] hover:bg-slate-100 dark:hover:bg-[#232329]'
                }`}
                title={
                  page === 1
                    ? 'Halaman Paling Awal (1)'
                    : page === totalPages
                    ? `Halaman Paling Akhir (${totalPages})`
                    : page === currentPage
                    ? `Halaman Aktif (${page})`
                    : `Halaman ${page}`
                }
              >
                {page}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Tombol '>' (Maju 1 Halaman) */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] text-slate-700 dark:text-[#bebeca] disabled:opacity-25 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-[#232329] transition-all cursor-pointer shadow-sm flex items-center justify-center"
        title="Halaman Berikutnya"
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>

    </div>
  );
};
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, AlertCircle, X, ExternalLink, ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { SearchBar } from '../components/SearchBar';
import { Pagination } from '../components/Pagination';
import { DocSkeleton } from '../components/Skeleton';
import type { ProkerStatus } from '../types';

export const DocumentationPage: React.FC = () => {
  const { divisions, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  
  // 5 isi per halaman sesuai aturan kita
  const itemsPerPage = 5;

  const statuses: ('Semua' | ProkerStatus)[] = ['Semua', 'Selesai', 'Akan Datang', 'Berlangsung', 'Direncanakan'];

  // 1. Kumpulkan SELURUH proker dari seluruh divisi (Selesai maupun Akan Datang)
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

  // 2. Filter gabungan Search & Status
  const filtered = useMemo(() => {
    return allPrograms.filter((p) => {
      const currentStatus = p.status || 'Direncanakan';
      const matchStatus = selectedStatus === 'Semua' || currentStatus === selectedStatus;
      
      const q = searchQuery.toLowerCase();
      const matchSearch =
        p.title.toLowerCase().includes(q) ||
        p.divName.toLowerCase().includes(q) ||
        p.divShort.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.documentation?.summary && p.documentation.summary.toLowerCase().includes(q));

      return matchStatus && matchSearch;
    });
  }, [allPrograms, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearch = (val: string) => {
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
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-10 sm:py-12 space-y-10">
      
      {/* Header Halaman */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Galeri &amp; Rekap
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Dokumentasi Kegiatan
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Kompilasi rekam jejak program kerja HMIF yang telah terlaksana maupun agenda yang akan segera digelar.
        </p>
      </div>

      {/* Kontrol Searchbar & Filter Status */}
      <div className="flex flex-col items-center gap-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Cari dokumentasi kegiatan atau divisi..."
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

      {/* Grid Dokumentasi (2 Kolom Responsif) */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          <DocSkeleton />
          <DocSkeleton />
        </div>
      ) : paginated.length === 0 ? (
        <div className="p-16 text-center liquid-glass rounded-3xl border border-slate-300 dark:border-secondary/20 text-slate-600 dark:text-[#bebeca]/70 text-sm space-y-3">
          <p>Tidak ada program kerja yang sesuai dengan pencarian &quot;{searchQuery}&quot;.</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {paginated.map((p, idx) => {
            const isFinished = p.status === 'Selesai';
            const hasPhotos = Boolean(p.documentation?.photoUrls && p.documentation.photoUrls.length > 0);

            return (
              <SpotlightCard
                key={idx}
                className="p-6 sm:p-8 space-y-5 border border-slate-300/80 dark:border-secondary/20 flex flex-col justify-between"
              >
                <div>
                  {/* Status & Nama Divisi */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-xs font-mono uppercase text-slate-500 dark:text-secondary font-bold">
                      {p.divShort}
                    </span>
                    {getStatusBadge(p.status)}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-snug">
                    {p.title}
                  </h2>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-[#bebeca]/80 mt-1 mb-4">
                    <Calendar size={13} />
                    <span>{p.documentation?.date || p.period || 'Jadwal belum ditentukan'}</span>
                  </div>

                  {/* Ringkasan Deskripsi */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-[#bebeca]/90 leading-relaxed font-normal line-clamp-3 mb-5">
                    {p.documentation?.summary || p.description}
                  </p>

                  {/* KONDISIONAL AREA FOTO: SESUAI STATUS PROKER */}
                  {isFinished && hasPhotos ? (
                    <div>
                      <span className="text-[11px] font-mono opacity-60 block mb-2 font-semibold">
                        Galeri Foto (Klik untuk memperbesar):
                      </span>
                      <div className="grid grid-cols-3 gap-2.5">
                        {p.documentation!.photoUrls.map((url, i) => (
                          <div
                            key={i}
                            onClick={() => setLightboxImg(url)}
                            className="relative h-24 rounded-xl overflow-hidden border border-slate-300 dark:border-secondary/20 cursor-pointer group/img"
                            title="Klik untuk memperbesar"
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <ExternalLink size={14} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : isFinished && !hasPhotos ? (
                    /* Selesai tapi belum ada foto */
                    <div className="p-5 text-center border border-dashed border-slate-300 dark:border-secondary/30 rounded-2xl text-slate-500 dark:text-[#bebeca]/60 text-xs flex flex-col items-center justify-center gap-1.5 bg-black/5 dark:bg-white/[0.02]">
                      <ImageIcon size={20} className="opacity-50" />
                      <span className="font-semibold text-slate-700 dark:text-white">Dokumentasi Segera Hadir</span>
                      <span className="text-[11px] opacity-75">Kegiatan telah selesai, dokumentasi foto sedang dipersiapkan panitia.</span>
                    </div>
                  ) : (
                    /* Akan Datang / Berlangsung / Direncanakan */
                    <div className="p-5 text-center border border-dashed border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400/90 text-xs flex flex-col items-center justify-center gap-1.5 bg-amber-500/5">
                      <Clock size={18} className="opacity-70" />
                      <span className="font-semibold">Kegiatan Belum Dilaksanakan</span>
                      <span className="text-[11px] opacity-80">Dokumentasi foto akan diunggah setelah agenda ini berlangsung.</span>
                    </div>
                  )}
                </div>

                {/* Tautan ke Detail Proker */}
                <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex justify-between items-center text-xs">
                  <span className="opacity-60 font-mono text-[11px]">HMIF UISI • {p.divShort}</span>
                  <Link
                    to={`/proker/${p.divSlug}/${p.idx}`}
                    className="text-slate-900 dark:text-secondary hover:underline font-bold flex items-center gap-1"
                  >
                    Detail Proker <ExternalLink size={12} />
                  </Link>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* MODAL LIGHTBOX FULLSCREEN UNTUK ZOOM FOTO */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 cursor-pointer animate-fade-down"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl">
            <img src={lightboxImg} alt="Preview Dokumentasi" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={() => setLightboxImg(null)}
              className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full transition-transform hover:scale-110"
              title="Tutup"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
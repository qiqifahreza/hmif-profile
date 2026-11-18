import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Camera, Clock, CheckCircle2, AlertCircle, ImageIcon, ExternalLink, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import type { ProkerStatus } from '../types';

export const ProkerDetailPage: React.FC = () => {
  const { divSlug, prokerIdx } = useParams<{ divSlug: string; prokerIdx: string }>();
  const { divisions } = useData();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const division = divisions.find((d) => d.slug === divSlug);
  const proker = division?.programs[Number(prokerIdx)];

  if (!division || !proker) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-950 dark:text-white">Program Kerja Tidak Ditemukan</h2>
        <Link to="/proker" className="text-blue-600 dark:text-[#bebeca] hover:underline flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft size={16} /> Kembali ke Daftar Proker
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status?: ProkerStatus) => {
    switch (status) {
      case 'Selesai':
        return <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 size={14}/> Selesai</span>;
      case 'Berlangsung':
        return <span className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock size={14}/> Berlangsung</span>;
      case 'Akan Datang':
        return <span className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock size={14}/> Akan Datang</span>;
      default:
        return <span className="bg-slate-200 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-500/30 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><AlertCircle size={14}/> Direncanakan</span>;
    }
  };

  const isFinished = proker.status === 'Selesai';
  const hasPhotos = Boolean(proker.documentation?.photoUrls && proker.documentation.photoUrls.length > 0);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-10 sm:py-12 space-y-8">
      
      {/* Tombol Kembali */}
      <Link
        to="/proker"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white transition-colors px-4 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/20 w-fit"
      >
        <ArrowLeft size={16} /> Kembali ke Semua Program Kerja
      </Link>

      {/* Grid Utama Full Kiri-Kanan (7 Kolom Detail Info, 5 Kolom Dokumentasi di Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* KOLOM KIRI: INFORMASI UTAMA PROKER */}
        <SpotlightCard className="lg:col-span-7 p-6 sm:p-10 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <Link
                to={`/divisi/${division.slug}`}
                className="text-xs font-mono uppercase bg-slate-200 dark:bg-primary/30 text-slate-800 dark:text-secondary px-3 py-1 rounded-full font-bold border border-slate-300 dark:border-secondary/25 hover:opacity-80 transition-opacity"
              >
                {division.name}
              </Link>
              {getStatusBadge(proker.status)}
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black mb-5 leading-tight text-slate-950 dark:text-white tracking-tight">
              {proker.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-[#bebeca]/80 font-mono mb-8 pb-6 border-b border-slate-200 dark:border-secondary/15">
              <Calendar size={16} className="shrink-0" />
              <span>Pelaksanaan: {proker.period || 'Coming Soon'}</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white">Deskripsi Program Kerja</h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#bebeca]/90 whitespace-pre-line font-normal">
                {proker.description}
              </p>
            </div>
          </div>
        </SpotlightCard>

        {/* KOLOM KANAN: REKAP & DOKUMENTASI KEGIATAN */}
        <SpotlightCard className="lg:col-span-5 p-6 sm:p-8 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <div className="space-y-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Camera size={20} className="text-slate-700 dark:text-secondary shrink-0" /> Rekap &amp; Dokumentasi
            </h3>

            {!isFinished ? (
              <div className="p-6 text-center border border-dashed border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400/90 text-xs flex flex-col items-center justify-center gap-2 bg-amber-500/5">
                <Clock size={22} className="opacity-70" />
                <span className="font-semibold">Kegiatan Belum Terlaksana</span>
                <p className="opacity-80 leading-relaxed">
                  Dokumentasi foto dan rekap akan tersedia setelah agenda ini selesai diselenggarakan.
                </p>
              </div>
            ) : hasPhotos ? (
              <div className="space-y-5">
                {proker.documentation?.summary && (
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-[#bebeca]/90 font-normal">
                    {proker.documentation.summary}
                  </p>
                )}
                <div>
                  <span className="text-[11px] font-mono opacity-60 block mb-2.5 font-semibold">
                    Klik foto untuk memperbesar:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                    {proker.documentation!.photoUrls.map((url, i) => (
                      <div
                        key={i}
                        onClick={() => setLightboxImg(url)}
                        className="relative h-32 rounded-xl overflow-hidden border border-slate-300 dark:border-secondary/20 cursor-pointer group/img shadow-sm"
                        title="Klik untuk memperbesar"
                      >
                        <img
                          src={url}
                          alt={`Dokumentasi ${i + 1}`}
                          className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ExternalLink size={16} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-300 dark:border-secondary/30 rounded-2xl text-slate-500 dark:text-[#bebeca]/60 text-xs flex flex-col items-center justify-center gap-2 bg-black/5 dark:bg-white/[0.02]">
                <ImageIcon size={24} className="opacity-50" />
                <span className="font-semibold text-slate-700 dark:text-white">Dokumentasi Segera Hadir</span>
                <p className="opacity-75">Kegiatan telah selesai, foto dokumentasi sedang dipersiapkan oleh panitia.</p>
              </div>
            )}
          </div>
        </SpotlightCard>

      </div>

      {/* Modal Lightbox Zoom Foto */}
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
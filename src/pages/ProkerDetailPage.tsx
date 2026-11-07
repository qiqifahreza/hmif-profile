import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Camera } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ProkerDetailPage: React.FC = () => {
  const { divSlug, prokerIdx } = useParams<{ divSlug: string; prokerIdx: string }>();
  const { divisions } = useData();

  const division = divisions.find((d) => d.slug === divSlug);
  const proker = division?.programs[Number(prokerIdx)];

  if (!division || !proker) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-slate-950 dark:text-white">Program Kerja Tidak Ditemukan</h2>
        <Link to="/proker" className="text-blue-600 dark:text-[#bebeca] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Daftar Proker
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <Link to="/proker" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white">
        <ArrowLeft size={16} /> Kembali ke Semua Program Kerja
      </Link>

      <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-slate-300/80 dark:border-secondary/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono uppercase bg-slate-200 dark:bg-primary/20 text-slate-800 dark:text-secondary px-3 py-1 rounded-full font-bold border border-slate-300 dark:border-secondary/25">
            {division.name}
          </span>
          <span className="text-xs font-mono uppercase bg-slate-100 dark:bg-secondary/10 text-slate-700 dark:text-[#bebeca] px-3 py-1 rounded-full border border-slate-300 dark:border-secondary/20">
            Status: {proker.status || 'Direncanakan'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight text-slate-950 dark:text-white">
          {proker.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#bebeca]/80 font-mono mb-8 pb-6 border-b border-slate-200 dark:border-secondary/15">
          <Calendar size={16} />
          <span>Pelaksanaan: {proker.period || 'Coming Soon'}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">Deskripsi Program Kerja</h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-[#bebeca]/90 whitespace-pre-line font-normal">
            {proker.description}
          </p>
        </div>
      </div>

      {/* Bagian Rekap & Dokumentasi */}
      <div className="liquid-glass rounded-3xl p-8 border border-slate-300/80 dark:border-secondary/20">
        <h3 className="text-xl font-bold mb-4 text-slate-950 dark:text-white flex items-center gap-2">
          <Camera size={20} className="text-slate-700 dark:text-secondary" /> Rekap &amp; Dokumentasi Kegiatan
        </h3>

        {proker.status !== 'Selesai' ? (
          <p className="text-xs text-slate-500 dark:text-[#bebeca]/60 italic">
            Program kerja ini belum terlaksana. Dokumentasi akan tersedia setelah kegiatan selesai.
          </p>
        ) : proker.documentation?.photoUrls && proker.documentation.photoUrls.length > 0 ? (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-[#bebeca]/90 font-normal">{proker.documentation.summary}</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {proker.documentation.photoUrls.map((url, i) => (
                <img key={i} src={url} alt="Dokumentasi" className="rounded-xl object-cover h-44 w-full shadow-md border border-slate-300 dark:border-secondary/20" />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-slate-300 dark:border-secondary/30 rounded-2xl text-slate-500 dark:text-[#bebeca]/60 text-xs">
            Dokumentasi Segera Hadir
          </div>
        )}
      </div>
    </div>
  );
};
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
        <h2 className="text-2xl font-bold mb-4">Program Kerja Tidak Ditemukan</h2>
        <Link to="/proker" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Daftar Proker
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <Link to="/proker" className="inline-flex items-center gap-2 text-xs font-semibold opacity-75 hover:opacity-100">
        <ArrowLeft size={16} /> Kembali ke Semua Program Kerja
      </Link>

      <div className="glass-effect rounded-3xl p-8 sm:p-12 border">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-mono uppercase bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
            {division.name}
          </span>
          <span className="text-xs font-mono uppercase bg-secondary/10 px-3 py-1 rounded-full border">
            Status: {proker.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">{proker.title}</h1>

        <div className="flex items-center gap-2 text-sm opacity-70 font-mono mb-8 pb-6 border-b">
          <Calendar size={16} />
          <span>Pelaksanaan: {proker.period || 'Coming Soon'}</span>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Deskripsi Program Kerja</h3>
          <p className="text-sm sm:text-base leading-relaxed opacity-85 whitespace-pre-line">{proker.description}</p>
        </div>
      </div>

      {/* Bagian Rekap & Dokumentasi (Jika proker Selesai) */}
      <div className="glass-effect rounded-3xl p-8 border">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Camera size={20} className="text-primary" /> Rekap &amp; Dokumentasi Kegiatan
        </h3>

        {proker.status !== 'Selesai' ? (
          <p className="text-xs opacity-60 italic">
            Program kerja ini belum terlaksana. Dokumentasi akan tersedia setelah kegiatan selesai.
          </p>
        ) : proker.documentation?.photoUrls && proker.documentation.photoUrls.length > 0 ? (
          <div className="space-y-6">
            <p className="text-sm leading-relaxed opacity-85">{proker.documentation.summary}</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {proker.documentation.photoUrls.map((url, i) => (
                <img key={i} src={url} alt="Dokumentasi" className="rounded-xl object-cover h-44 w-full shadow-md" />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed rounded-2xl opacity-60 text-xs">
            Dokumentasi Segera Hadir
          </div>
        )}
      </div>
    </div>
  );
};
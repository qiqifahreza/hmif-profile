import React from 'react';
import { Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';

export const DocumentationPage: React.FC = () => {
  const { divisions } = useData();

  const documentedPrograms = divisions.flatMap((d) =>
    d.programs
      .filter((p) => p.status === 'Selesai' || p.documentation)
      .map((p) => ({ ...p, divName: d.name }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      
      {/* Header Halaman */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/25 font-bold">
          Galeri &amp; Rekap
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3 text-slate-950 dark:text-white tracking-tight">
          Dokumentasi Kegiatan
        </h1>
        <p className="text-sm text-slate-600 dark:text-[#bebeca]/90 font-normal">
          Kompilasi rekam jejak dan galeri program kerja yang telah berhasil diselenggarakan.
        </p>
      </div>

      {documentedPrograms.length === 0 ? (
        <div className="text-center p-16 liquid-glass rounded-3xl border border-slate-300 dark:border-secondary/20 text-slate-600 dark:text-[#bebeca]/70 text-sm">
          Belum ada program kerja yang selesai didokumentasikan.
        </div>
      ) : (
        <div className="space-y-10">
          {documentedPrograms.map((p, idx) => (
            <SpotlightCard key={idx} className="p-8 sm:p-10 space-y-6 border border-slate-300/80 dark:border-secondary/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-secondary/15 pb-4">
                <div>
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-secondary font-bold">{p.divName}</span>
                  <h2 className="text-2xl font-bold mt-1 text-slate-950 dark:text-white">{p.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-[#bebeca]/80">
                  <Calendar size={14} />
                  <span>{p.documentation?.date || p.period}</span>
                </div>
              </div>

              {p.documentation?.summary && (
                <p className="text-sm text-slate-700 dark:text-[#bebeca]/90 leading-relaxed font-normal">
                  {p.documentation.summary}
                </p>
              )}

              {p.documentation?.photoUrls && p.documentation.photoUrls.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {p.documentation.photoUrls.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={p.title}
                      className="rounded-2xl w-full h-52 object-cover shadow-md hover:scale-105 transition-transform duration-300 border border-slate-300 dark:border-secondary/20"
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-slate-300 dark:border-secondary/30 rounded-xl text-slate-500 dark:text-[#bebeca]/60 text-xs">
                  Dokumentasi Segera Hadir
                </div>
              )}
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
};
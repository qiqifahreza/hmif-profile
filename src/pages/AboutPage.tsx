import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';

export const AboutPage: React.FC = () => {
  const { settings, divisions } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      
      {/* Header Profil */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-700 dark:text-[#bebeca] bg-slate-200/80 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-secondary/30 font-bold">
          Profil Organisasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-4 mb-4 tracking-tight text-slate-950 dark:text-white">
          Tentang {settings.org_name}
        </h1>
        <p className="text-slate-600 dark:text-[#bebeca]/90 text-sm sm:text-base leading-relaxed font-normal">
          Lembaga kemahasiswaan eksekutif tertinggi Program Studi Informatika di {settings.univ_name}, bergerak di bawah naungan <strong className="text-slate-900 dark:text-white">{settings.cabinet_name}</strong> periode {settings.period}.
        </p>
      </div>

      {/* Kotak Visi & Misi */}
      <div className="grid md:grid-cols-2 gap-8">
        <SpotlightCard className="p-8 sm:p-10 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <h3 className="text-2xl font-bold mb-4 text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-[#bebeca]" />
            Visi
          </h3>
          <p className="leading-relaxed text-slate-700 dark:text-[#bebeca] text-sm sm:text-base font-normal">
            {settings.vision}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-8 sm:p-10 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <h3 className="text-2xl font-bold mb-4 text-slate-950 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-[#bebeca]" />
            Misi
          </h3>
          <ul className="space-y-3 text-sm sm:text-base text-slate-700 dark:text-[#bebeca] font-normal">
            {settings.mission.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-slate-900 dark:text-white font-bold">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>

      {/* Struktur Kepengurusan */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Struktur Kepengurusan
          </h2>
          <p className="text-xs text-slate-600 dark:text-secondary/70 mt-1 font-medium">
            Pilih divisi untuk melihat profil Kadiv, seluruh anggota staf, dan rincian proker.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div) => (
            <SpotlightCard
              key={div.slug}
              to={`/divisi/${div.slug}`}
              className="p-6 h-full border border-slate-300/80 dark:border-secondary/20"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-200/80 dark:bg-[#3c3c44]/80 border border-slate-300 dark:border-[#bebeca]/30 text-slate-900 dark:text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-[#bebeca] dark:group-hover:text-[#121215] transition-all">
                  <Layers size={18} />
                </div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#bebeca] font-bold uppercase block mb-1">
                  {div.shortName}
                </span>
                <h4 className="font-bold text-base mb-2 text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#bebeca] transition-colors">
                  {div.name}
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-3 leading-relaxed mb-6 font-normal">
                  {div.about}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-secondary/15 text-xs font-semibold text-slate-900 dark:text-[#bebeca] group-hover:text-blue-600 dark:group-hover:text-white flex items-center justify-between">
                <span>Detail Divisi</span>
                <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
};
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
        <span className="text-xs font-mono uppercase tracking-widest text-[#bebeca] dark:text-[#bebeca] light:text-[#3c3c44] bg-primary/20 px-3.5 py-1.5 rounded-full border border-secondary/30">
          Profil Organisasi
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-4 mb-4 tracking-tight text-white dark:text-white light:text-[#121215]">
          Tentang {settings.org_name}
        </h1>
        <p className="opacity-90 text-sm sm:text-base leading-relaxed font-normal">
          Lembaga kemahasiswaan eksekutif tertinggi Program Studi Informatika di {settings.univ_name}, bergerak di bawah naungan <strong>{settings.cabinet_name}</strong> periode {settings.period}.
        </p>
      </div>

      {/* Kotak Visi & Misi (Teks Judul Sekarang Terang & Menyala) */}
      <div className="grid md:grid-cols-2 gap-8">
        <SpotlightCard className="p-8 sm:p-10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4 text-white dark:text-white light:text-[#121215] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bebeca]" />
            Visi
          </h3>
          <p className="leading-relaxed opacity-95 text-sm sm:text-base text-[#bebeca] dark:text-[#bebeca] light:text-[#33333d]">
            {settings.vision}
          </p>
        </SpotlightCard>

        <SpotlightCard className="p-8 sm:p-10 rounded-3xl">
          <h3 className="text-2xl font-bold mb-4 text-white dark:text-white light:text-[#121215] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bebeca]" />
            Misi
          </h3>
          <ul className="space-y-3 text-sm sm:text-base opacity-95 text-[#bebeca] dark:text-[#bebeca] light:text-[#33333d]">
            {settings.mission.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-white dark:text-white light:text-[#121215] font-bold">•</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>

      {/* Struktur Kepengurusan (8 Kotak Divisi) */}
      <div>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight text-white dark:text-white light:text-[#121215]">
            Struktur Kepengurusan
          </h2>
          <p className="text-xs opacity-75 mt-1">Pilih divisi untuk melihat profil Kadiv, seluruh anggota staf, dan rincian proker.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div) => (
            <SpotlightCard
              key={div.slug}
              to={`/divisi/${div.slug}`}
              className="p-6 h-full"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#3c3c44]/80 border border-[#bebeca]/30 text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#bebeca] group-hover:text-[#121215] transition-all">
                  <Layers size={18} />
                </div>
                <span className="text-[10px] font-mono text-[#bebeca] font-bold uppercase block mb-1">
                  {div.shortName}
                </span>
                <h4 className="font-bold text-base mb-2 text-white dark:text-white light:text-[#121215] group-hover:text-[#bebeca] transition-colors">
                  {div.name}
                </h4>
                <p className="text-xs opacity-80 line-clamp-3 leading-relaxed mb-6">
                  {div.about}
                </p>
              </div>

              <div className="pt-3 border-t border-secondary/15 text-xs font-semibold text-[#bebeca] group-hover:text-white flex items-center justify-between">
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
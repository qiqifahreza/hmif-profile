import React from 'react';
import { ArrowRight, Sparkles, Terminal, BookOpen } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="beranda" className="relative pt-36 pb-28 overflow-hidden bg-dark">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-20 bg-white/90 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge Kabinet */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface border border-primary text-secondary text-xs sm:text-sm font-mono mb-8 shadow-sm">
          <Sparkles size={14} className="text-secondary" />
          <span>KABINET SAMVAYA • 2026/2027</span>
        </div>

        {/* Title dengan gradasi Silver-Charcoal */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Himpunan Mahasiswa Informatika <br />
          <span className="bg-linear-to-r from-white via-secondary to-[#8c8c97] bg-clip-text text-transparent">
            Universitas Internasional Semen Indonesia
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-secondary text-base sm:text-lg mb-10 leading-relaxed font-normal">
          Wadah sinergi, akselerasi potensi, dan inovasi teknologi mahasiswa Informatika UISI
          di bawah naungan <strong className="text-white">Kabinet Samvaya</strong>.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <a
            href="/#divisi"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-white text-dark font-semibold px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            <Terminal size={18} />
            Struktur Divisi
            <ArrowRight size={16} />
          </a>
          <a
            href="/#dosen"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-primary bg-surface/80 hover:bg-primary text-secondary hover:text-white font-medium transition-all"
          >
            <BookOpen size={18} />
            Dosen Departemen
          </a>
        </div>
      </div>
    </section>
  );
};
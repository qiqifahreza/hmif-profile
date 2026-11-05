import React, { useState } from 'react';
import { User, Award, GraduationCap } from 'lucide-react';
import { lecturersData } from '../data/divisionsData';
import type { Lecturer } from '../types';

// Komponen Pembungkus Avatar Foto dengan Fallback Otomatis
const LecturerAvatar: React.FC<{ lecturer: Lecturer }> = ({ lecturer }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-24 h-24 mb-4">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary group-hover:border-secondary bg-dark flex items-center justify-center transition-all duration-300 shadow-inner">
        {lecturer.imageUrl && !hasError ? (
          <img
            src={lecturer.imageUrl}
            alt={lecturer.name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <User size={40} className="text-secondary" />
        )}
      </div>
      
      {/* Badge Ikon Topi Toga di pojok foto */}
      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-surface flex items-center justify-center text-secondary shadow-md">
        <GraduationCap size={14} />
      </div>
    </div>
  );
};

export const Lecturers: React.FC = () => {
  return (
    <section id="dosen" className="py-24 bg-dark text-secondary border-t border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-secondary bg-primary px-3.5 py-1.5 rounded-full border border-secondary/20">
            Tenaga Pendidik
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
            Dosen Departemen Informatika
          </h2>
          <p className="text-secondary mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Dosen pengajar dan pembimbing Departemen Informatika Universitas Internasional Semen Indonesia.
          </p>
          <div className="h-1 w-16 bg-secondary/40 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grid Kartu Profil Dosen (Sama seperti kartu pengurus di halaman divisi) */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {lecturersData.map((dosen, index) => (
    <div
      key={index}
      className="group liquid-glass-card rounded-2xl p-6 flex flex-col items-center text-center"
    >
      <LecturerAvatar lecturer={dosen} />

      <h4 className="text-base font-bold text-white leading-snug mb-3 min-h-12 flex items-center justify-center">
        {dosen.name}
      </h4>

      <div className="mt-auto inline-flex items-center gap-1.5 text-xs text-secondary font-medium bg-dark/60 px-3 py-1 rounded-full border border-secondary/20">
        <Award size={13} className="text-secondary" />
        <span>{dosen.role}</span>
      </div>
    </div>
  ))}
</div>
      </div>
    </section>
  );
};
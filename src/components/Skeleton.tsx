import React from 'react';

// 1. Elemen Dasar Skeleton (Kotak / Lingkaran Animasi Pulse)
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-slate-200/80 dark:bg-white/[0.06] border border-slate-300/40 dark:border-white/[0.05] rounded-xl ${className}`}
  />
);

// 2. Skeleton Kartu Standar (Untuk Proker, Pengumuman, Kompetisi, dan Blog)
export const CardSkeleton: React.FC = () => (
  <div className="liquid-glass p-6 rounded-2xl border border-slate-300/70 dark:border-[#3c3c44] flex flex-col justify-between space-y-4">
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-6 rounded-lg mt-2" />
      <Skeleton className="w-full h-3 rounded" />
      <Skeleton className="w-5/6 h-3 rounded" />
      <Skeleton className="w-2/3 h-3 rounded" />
    </div>

    <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex items-center justify-between">
      <Skeleton className="w-24 h-4 rounded" />
      <Skeleton className="w-16 h-4 rounded" />
    </div>
  </div>
);

// 3. Skeleton Profil Pengurus / Anggota (Untuk Halaman Divisi)
export const MemberSkeleton: React.FC = () => (
  <div className="liquid-glass p-6 rounded-2xl border border-slate-300/70 dark:border-[#3c3c44] flex flex-col items-center text-center space-y-3">
    {/* Lingkaran Avatar */}
    <Skeleton className="w-20 h-20 rounded-full mb-1" />
    {/* Nama */}
    <Skeleton className="w-32 h-5 rounded-lg" />
    {/* Jabatan */}
    <Skeleton className="w-24 h-4 rounded-full" />
    {/* NIM */}
    <Skeleton className="w-28 h-4 rounded" />
  </div>
);

// 4. Skeleton Dokumentasi Kegiatan
export const DocSkeleton: React.FC = () => (
  <div className="liquid-glass p-8 rounded-3xl border border-slate-300/70 dark:border-[#3c3c44] space-y-6">
    <div className="flex justify-between items-center border-b border-slate-200 dark:border-secondary/15 pb-4">
      <div className="space-y-2">
        <Skeleton className="w-24 h-4 rounded-full" />
        <Skeleton className="w-48 h-6 rounded-lg" />
      </div>
      <Skeleton className="w-28 h-4 rounded" />
    </div>
    <Skeleton className="w-full h-4 rounded" />
    <Skeleton className="w-3/4 h-4 rounded" />
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-full h-48 rounded-2xl" />
      <Skeleton className="w-full h-48 rounded-2xl" />
    </div>
  </div>
);
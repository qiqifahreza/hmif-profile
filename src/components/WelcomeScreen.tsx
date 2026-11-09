import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

export const WelcomeScreen: React.FC = () => {
  const { settings } = useData();
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animasi garis progress bar dari 0% ke 100%
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 100);

    // Mulai fade-out setelah 1.6 detik
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1600);

    // Hapus total dari DOM setelah efek fade selesai (2.3 detik)
    const removeTimer = setTimeout(() => {
      setIsMounted(false);
    }, 2300);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0d11] transition-all duration-700 ease-in-out ${
        isFading ? 'opacity-0 scale-105 pointer-events-none blur-sm' : 'opacity-100 scale-100'
      }`}
    >
      {/* Bias Cahaya Cair di Belakang Logo */}
      <div className="absolute w-72 h-72 rounded-full bg-primary/30 blur-[100px] pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
        
        {/* Lingkaran Logo dengan Bingkai Kaca Bersinar */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#bebeca]/40 bg-[#19191d]/80 p-2 shadow-[0_0_40px_rgba(190,190,202,0.25)] flex items-center justify-center backdrop-blur-xl">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Logo HMIF"
                className="w-full h-full object-contain rounded-full"
              />
            ) : (
              <span className="font-extrabold text-2xl text-white tracking-widest">IF</span>
            )}
          </div>
          {/* Cincin Animasi Berdenyut */}
          <div className="absolute -inset-1 rounded-full border border-[#bebeca]/30 animate-ping opacity-30 pointer-events-none" />
        </div>

        {/* Teks Sambutan */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-black tracking-wider text-white">
            {settings.org_name || 'Himpunan Mahasiswa Informatika'}
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-[#bebeca] font-semibold">
            {settings.cabinet_name} • {settings.period}
          </p>
        </div>

        {/* Garis Loading Kaca Cair Minimalis */}
        <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-transparent via-[#bebeca] to-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_#ffffff]"
            style={{ width: `${progress}%` }}
          />
        </div>

      </div>
    </div>
  );
};
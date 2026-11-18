import React, { useState, useRef } from 'react';
import { Calendar, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '../types';

interface HeroGalleryProps {
  items: GalleryItem[];
}

export const HeroGallery: React.FC<HeroGalleryProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  
  // State untuk gesture sentuh / drag
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const startXRef = useRef(0);
  const movedRef = useRef(false);

  if (!items || items.length === 0) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Abaikan jika mengklik tombol navigasi kecil
    if ((e.target as HTMLElement).closest('button[data-nav]')) return;

    setIsDragging(true);
    startXRef.current = e.clientX;
    movedRef.current = false;
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) > 8) {
      movedRef.current = true;
    }
    setDragOffset(diff);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const diff = e.clientX - startXRef.current;

    if (movedRef.current) {
      // Logika Swipe / Geser Foto
      if (diff < -50 && currentIndex < items.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setFlippedIndex(null); // Reset flip saat pindah foto
      } else if (diff > 50 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
        setFlippedIndex(null);
      }
    } else {
      // Jika hanya Klik / Ketuk (tidak digeser) -> BALIK KARTU 3D!
      setFlippedIndex((prev) => (prev === currentIndex ? null : currentIndex));
    }

    setDragOffset(0);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlippedIndex(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setFlippedIndex(null);
    }
  };

  return (
    <div className="w-full space-y-3 select-none">
      {/* WADAH CAROUSEL LANDSCAPE 16:9 */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full relative overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y rounded-3xl"
      >
        <div
          className={`flex ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {items.map((item, idx) => {
            const isFlipped = flippedIndex === idx;

            return (
              <div
                key={idx}
                className="w-full shrink-0 aspect-video perspective-1200 p-1"
              >
                {/* KARTU YANG BISA BERPUTAR 3D 180 DERAJAT */}
                <div
                  className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  
                  {/* SISI DEPAN: FOTO FULL 16:9 BERSIH TANPA TEKS */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl border border-slate-300/60 dark:border-white/10 group">
                    <img
                      src={item.image}
                      alt={item.text || `Galeri ${idx + 1}`}
                      draggable={false}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                    {/* Ikon kecil penanda kartu bisa diklik/dibalik (tanpa teks) */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white/80 flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <RotateCw size={14} />
                    </div>
                  </div>

                  {/* SISI BELAKANG: INFORMASI FOTO (TAMPIL SAAT DIKLIK) */}
                  <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl liquid-glass border border-slate-300 dark:border-[#bebeca]/30 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto">
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between gap-2">
                        {item.date ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-3 py-1 rounded-full bg-slate-200 dark:bg-[#3c3c44] text-slate-800 dark:text-[#bebeca] font-bold">
                            <Calendar size={12} /> {item.date}
                          </span>
                        ) : (
                          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-[#bebeca]/60">
                            Informasi Kegiatan
                          </span>
                        )}
                        <span className="w-7 h-7 rounded-full bg-slate-200/80 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-white shrink-0">
                          <RotateCw size={13} />
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white leading-snug">
                        {item.text || 'Dokumentasi Kegiatan HMIF'}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-700 dark:text-[#bebeca]/90 leading-relaxed whitespace-pre-line font-normal">
                        {item.description || 'Belum ada keterangan tambahan untuk dokumentasi ini.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-[11px] font-mono text-slate-500 dark:text-[#bebeca]/60">
                      <span>HMIF UISI • Kabinet Samvaya</span>
                      <span>Klik lagi untuk kembali ke foto</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Tombol Navigasi Panah Kiri-Kanan (Muncul jika foto > 1) */}
        {items.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                type="button"
                data-nav="true"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all cursor-pointer z-20"
                title="Foto Sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {currentIndex < items.length - 1 && (
              <button
                type="button"
                data-nav="true"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all cursor-pointer z-20"
                title="Foto Berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Indikator Titik Bawah (Hanya muncul jika foto lebih dari 1) */}
      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-1">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setCurrentIndex(i);
                setFlippedIndex(null);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i
                  ? 'w-6 bg-slate-900 dark:bg-[#bebeca]'
                  : 'w-1.5 bg-slate-300 dark:bg-[#3c3c44]'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
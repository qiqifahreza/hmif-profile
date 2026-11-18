import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Muncul jika halaman di-scroll lebih dari 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl liquid-glass border border-slate-300 dark:border-secondary/30 text-slate-800 dark:text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer animate-fade-down"
      title="Kembali ke atas"
      aria-label="Back to Top"
    >
      <ArrowUp size={18} />
    </button>
  );
};
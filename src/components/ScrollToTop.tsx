import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Memastikan setiap kali berpindah halaman, posisi layar langsung kembali ke paling atas
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Langsung tanpa animasi lag
    });
  }, [pathname]);

  return null;
};
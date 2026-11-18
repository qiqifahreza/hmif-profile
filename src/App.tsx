import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ScrollToTop } from './components/ScrollToTop';
import { BackToTop } from './components/BackToTop';


// Halaman-halaman Publik
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProkerPage } from './pages/ProkerPage';
import { ProkerDetailPage } from './pages/ProkerDetailPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { AnnouncementPage } from './pages/AnnouncementPage';
import { CompetitionPage } from './pages/CompetitionPage';
import { BlogPage } from './pages/BlogPage';
import { DivisionPage } from './pages/DivisionPage';

// Halaman Admin
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import Topography from './components/Topography';
import { useData } from './context/DataContext';

// Komponen Pembungkus Halaman Publik dengan Animasi Fade-Down Otomatis
const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
    <ScrollToTop />
    <BackToTop />
      <WelcomeScreen />
      <Navbar />
      

      {/* key={location.pathname} memicu animasi fade-down setiap kali rute berpindah */}
      <main key={location.pathname} className="grow pt-16 animate-fade-down">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tentang" element={<AboutPage />} />
          <Route path="/divisi/:slug" element={<DivisionPage />} />
          <Route path="/proker" element={<ProkerPage />} />
          <Route path="/proker/:divSlug/:prokerIdx" element={<ProkerDetailPage />} />
          <Route path="/dokumentasi" element={<DocumentationPage />} />
          <Route path="/pengumuman" element={<AnnouncementPage />} />
          <Route path="/kompetisi" element={<CompetitionPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};
export const App: React.FC = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  );
};

// Komponen pembungkus agar bisa membaca settings & isDarkMode dari context
const AppContent: React.FC = () => {
  const { settings, isDarkMode } = useData();

  return (
    <div className="min-h-screen flex flex-col justify-between transition-colors duration-400 relative overflow-x-hidden">
      
      {/* 1. Ambient Liquid Blobs di Bagian Atas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-primary/25 blur-[140px] animate-liquid" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[150px] animate-liquid" style={{ animationDelay: '-5s' }} />
      </div>

      {/* 2. BACKGROUND TOPOGRAPHY (FIXED - TIDAK IKUT TERSCROLL) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.3) 38%, rgba(0,0,0,0.85) 55%, black 72%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(0,0,0,0.3) 38%, rgba(0,0,0,0.85) 55%, black 72%, black 100%)',
        }}
      >
        <Topography
          color={settings.topography_color || (isDarkMode ? '#bebeca' : '#3c3c44')}
          opacity={settings.topography_opacity ?? 0.45}
          lightMode={!isDarkMode}
          lineCount={26}
          lineWidth={1.1}
          speed={0.18}
          tilt={30}
          elevation={1.2}
          mouseInteraction={true} // Tetap interaktif merespons gerakan mouse
          className="w-full h-full"
        />

        {/* Gradasi Lembut Penutup Atas agar Area Header Tetap Bersih */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[var(--theme-bg)] via-[var(--theme-bg)]/80 to-transparent pointer-events-none" />
      </div>

      {/* 3. Konten Halaman */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Routes>
          {/* Rute Admin */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Rute Publik */}
          <Route path="*" element={<PublicLayout />} />
        </Routes>
      </div>

    </div>
  );
};
export default App;
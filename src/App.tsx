import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/WelcomeScreen';

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

// Komponen Pembungkus Halaman Publik dengan Animasi Fade-Down Otomatis
const PublicLayout: React.FC = () => {
  const location = useLocation();

  return (
    <>
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
        <div className="min-h-screen flex flex-col justify-between transition-colors duration-300 relative overflow-x-hidden">
          
          {/* Ambient Liquid Blobs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-primary/25 blur-[140px] animate-liquid" />
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[150px] animate-liquid" style={{ animationDelay: '-5s' }} />
            <div className="absolute bottom-[5%] left-[-5%] w-[550px] h-[550px] rounded-full bg-primary/20 blur-[140px] animate-liquid" style={{ animationDelay: '-9s' }} />
          </div>

          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <Routes>
              {/* Rute Khusus Admin */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Rute Publik */}
              <Route path="*" element={<PublicLayout />} />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Halaman Publik
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

// animation Welcome Screen
import { WelcomeScreen } from './components/WelcomeScreen';
export const App: React.FC = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col justify-between transition-colors duration-400 relative overflow-x-hidden">
          
          {/* ========================================================
              AMBIENT LIQUID BLOBS (SUMBER BIAS CAIRAN DI BACKGROUND)
             ======================================================== */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-primary/25 blur-[140px] animate-liquid" />
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[150px] animate-liquid" style={{ animationDelay: '-5s' }} />
            <div className="absolute bottom-[5%] left-[-5%] w-[550px] h-[550px] rounded-full bg-primary/20 blur-[140px] animate-liquid" style={{ animationDelay: '-9s' }} />
          </div>

          {/* Konten Utama Di Atas Lapisan Kaca */}
          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <Routes>
              {/* Rute Admin */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Rute Publik */}
              <Route
                path="*"
                element={
                  <>
                  <WelcomeScreen />
                    <Navbar />
                    <main className="grow pt-16">
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
                }
              />
            </Routes>
          </div>

        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
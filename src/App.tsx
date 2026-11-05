import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DivisionPage } from './pages/DivisionPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark font-sans flex flex-col justify-between relative overflow-x-hidden">
        
        {/* Ambient Liquid Light Blobs (Efek Cairan di Latar Belakang) */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-125 h-125 rounded-full bg-primary/35 blur-[130px] animate-liquid" />
          <div className="absolute top-[45%] right-[-10%] w-150 h-150 rounded-full bg-secondary/10 blur-[150px] animate-liquid" style={{ animationDelay: '-5s' }} />
          <div className="absolute bottom-[10%] left-[-5%] w-137.5 h-137.5 rounded-full bg-primary/30 blur-[140px] animate-liquid" style={{ animationDelay: '-8s' }} />
        </div>

        {/* Konten Utama */}
        <div className="relative z-10 flex flex-col min-h-screen justify-between">
          <Navbar />
          <main className="grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/divisi/:slug" element={<DivisionPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
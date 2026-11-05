import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DivisionPage } from './pages/DivisionPage';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DataProvider } from './context/DataContext';

export const App: React.FC = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-dark font-sans flex flex-col justify-between relative overflow-x-hidden">
          
          {/* Ambient Liquid Light Blobs */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/35 blur-[130px] animate-liquid" />
            <div className="absolute top-[45%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[150px] animate-liquid" style={{ animationDelay: '-5s' }} />
            <div className="absolute bottom-[10%] left-[-5%] w-[550px] h-[550px] rounded-full bg-primary/30 blur-[140px] animate-liquid" style={{ animationDelay: '-8s' }} />
          </div>

          {/* Rute Aplikasi */}
          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <Routes>
              {/* Rute Khusus Admin (Tanpa Navbar & Footer publik) */}
{/* Rute Khusus Admin */}
<Route path="/admin" element={<Navigate to="/admin/login" replace />} />
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Rute Publik Pengunjung */}
              <Route
                path="*"
                element={
                  <>
                    <Navbar />
                    <main className="grow">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/divisi/:slug" element={<DivisionPage />} />
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
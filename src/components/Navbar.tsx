import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useData } from '../context/DataContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, isDarkMode, toggleTheme } = useData();
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang HMIF', href: '/tentang' },
    { name: 'Program Kerja', href: '/proker' },
    { name: 'Dokumentasi', href: '/dokumentasi' },
    { name: 'Pengumuman', href: '/pengumuman' },
    { name: 'Kompetisi', href: '/kompetisi' },
    { name: 'Blog', href: '/blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/75 dark:bg-[#101014]/75 border-b border-slate-200/80 dark:border-[#3c3c44] transition-colors duration-300"
      style={{
        WebkitBackdropFilter: 'blur(16px)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nama Organisasi */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 border flex items-center justify-center p-0.5 shadow-sm">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
              ) : (
                <div className="font-bold text-xs text-primary">IF</div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-wide">HMIF UISI</span>
              <span className="text-[10px] opacity-70 font-mono tracking-tighter">{settings.cabinet_name}</span>
            </div>
          </Link>

          {/* Navigasi Desktop 7 Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive(link.href)
                    ? 'bg-primary text-white font-semibold shadow-sm'
                    : 'hover:bg-primary/10 opacity-80 hover:opacity-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Tombol Light / Dark Mode */}
            <button
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-slate-700" />}
            </button>
          </div>

          {/* Tombol Mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-xl bg-primary/10">
              {isDarkMode ? <Sun size={16} className="text-amber-300" /> : <Moon size={16} className="text-slate-700" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 opacity-80 hover:opacity-100">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden glass-effect border-b px-4 pt-2 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.href) ? 'bg-primary text-white font-semibold' : 'opacity-80 hover:bg-primary/10'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
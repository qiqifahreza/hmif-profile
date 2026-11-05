import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ChevronDown, Menu, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import logoImg from '../assets/logo.png'; // Cara import asset resmi Vite

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { divisions } = useData(); // Pakai data dari context
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-dark/90 backdrop-blur-md z-50 border-b border-primary text-secondary">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3 text-white hover:text-secondary transition-colors group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/70 border border-secondary/30 flex items-center justify-center p-1 group-hover:border-secondary transition-all shadow-md">
              {!logoError ? (
                <img
                  src={logoImg}
                  alt="Logo HMIF UISI"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                  className="w-full h-full rounded-full object-contain"
                />
              ) : (
                <Terminal size={18} className="text-secondary" />
              )}
            </div>
            <span className="font-bold text-lg tracking-wider text-white">HMIF UISI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-secondary hover:text-white text-sm font-medium transition-colors">
              Beranda
            </Link>

            {/* Dropdown Divisi */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
                className="flex items-center gap-1 text-secondary hover:text-white text-sm font-medium py-2 transition-colors focus:outline-none"
              >
                <span>Divisi</span>
                <ChevronDown size={15} />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute left-0 mt-0 w-64 bg-surface border border-primary rounded-xl shadow-2xl py-2 z-50"
                >
                  {/* Menggunakan data dinamis divisions */}
                  {divisions.map((div) => (
                    <Link
                      key={div.slug}
                      to={`/divisi/${div.slug}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-secondary hover:bg-primary hover:text-white transition-colors"
                    >
                      {div.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="/#tentang" className="text-secondary hover:text-white text-sm font-medium transition-colors">
              Tentang
            </a>
            <a href="/#proker" className="text-secondary hover:text-white text-sm font-medium transition-colors">
              Program Kerja
            </a>
            <a href="#kontak" className="text-secondary hover:text-white text-sm font-medium transition-colors">
              Kontak
            </a>
          </div>

          {/* Hamburger Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary hover:text-white p-2"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-primary px-4 pt-2 pb-4 space-y-2 max-h-[80vh] overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-secondary hover:text-white font-medium"
          >
            Beranda
          </Link>
          <div className="py-2 border-t border-primary text-xs font-semibold text-secondary/60 uppercase tracking-wider">
            Divisi Kabinet Samvaya
          </div>
          {/* Menggunakan data dinamis divisions */}
          {divisions.map((div) => (
            <Link
              key={div.slug}
              to={`/divisi/${div.slug}`}
              onClick={() => setIsOpen(false)}
              className="block pl-3 py-1.5 text-sm text-secondary hover:text-white"
            >
              {div.name}
            </Link>
          ))}
          <a
            href="/#tentang"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-secondary hover:text-white font-medium border-t border-primary"
          >
            Tentang
          </a>
          {/* Link Dosen sudah dibersihkan */}
          <a
            href="#kontak"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-secondary hover:text-white font-medium"
          >
            Kontak
          </a>
        </div>
      )}
    </nav>
  );
};
import React from 'react';

// Ikon SVG Mandiri
const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer
      id="kontak"
      className="bg-slate-100 dark:bg-[#0c0c0f] border-t border-slate-300 dark:border-[#3c3c44] text-slate-600 dark:text-[#bebeca] py-6 sm:py-10 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 text-center sm:text-left">
        
        {/* Identitas Organisasi */}
        <div>
          <h4 className="text-slate-900 dark:text-white font-bold text-sm sm:text-base leading-snug">
            Himpunan Informatika UISI - Kabinet Samvaya
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#bebeca]/80 mt-1">
            Universitas Internasional Semen Indonesia • PT Semen Indonesia Gresik
          </p>
        </div>

        {/* Ikon Sosial Media */}
        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] hover:bg-slate-200 dark:hover:bg-[#232329] text-slate-700 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href="https://www.instagram.com/hmif.uisi?utm_source=ig_web_button_share_sheet&vrfl=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] hover:bg-slate-200 dark:hover:bg-[#232329] text-slate-700 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            aria-label="Instagram"
          >
            <InstagramIcon size={16} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/5 text-center text-[10px] sm:text-xs text-slate-400 dark:text-[#bebeca]/50 font-mono">
        &copy; {new Date().getFullYear()} HIMATIF UISI. All rights reserved.
      </div>
    </footer>
  );
};
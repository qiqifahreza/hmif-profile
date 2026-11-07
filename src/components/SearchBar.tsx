import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
}) => {
  return (
    <div className={`relative max-w-md w-full ${className}`}>
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#bebeca]/50 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-[#bebeca]/40 text-xs sm:text-sm focus:outline-none focus:border-slate-500 dark:focus:border-[#bebeca] transition-all shadow-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-[#bebeca]/50 dark:hover:text-white cursor-pointer"
          title="Hapus pencarian"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
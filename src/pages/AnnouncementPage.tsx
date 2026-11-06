import React from 'react';
import { Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AnnouncementPage: React.FC = () => {
  const { announcements } = useData();
  const published = announcements.filter((a) => a.is_published);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center">
        <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border">
          Kanal Informasi Resmi
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3">Pengumuman HMIF</h1>
        <p className="text-sm opacity-75">Informasi rilis, pendaftaran kegiatan, dan surat edaran resmi himpunan.</p>
      </div>

      <div className="space-y-6">
        {published.length === 0 ? (
          <div className="p-12 text-center glass-effect rounded-2xl border opacity-60 text-sm">
            Belum ada pengumuman yang dipublikasikan.
          </div>
        ) : (
          published.map((a) => (
            <div key={a.id} className="glass-effect rounded-2xl p-6 sm:p-8 border space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono opacity-60">
                <Calendar size={14} />
                <span>{a.published_date}</span>
              </div>
              <h2 className="text-2xl font-bold">{a.title}</h2>
              {a.poster_url && (
                <img src={a.poster_url} alt={a.title} className="max-h-96 w-full object-contain rounded-xl bg-black/10 my-4" />
              )}
              <p className="text-sm opacity-85 leading-relaxed whitespace-pre-line">{a.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Calendar, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';

export const CompetitionPage: React.FC = () => {
  const { competitions } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border">
          Perlombaan &amp; Sayembara
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3">Informasi Kompetisi IT</h1>
        <p className="text-sm opacity-75">Daftar lomba programming, UI/UX, data science, dan karya inovasi teknologi.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-effect rounded-2xl border opacity-60 text-sm">
            Belum ada info kompetisi saat ini.
          </div>
        ) : (
          competitions.map((c) => (
            <div key={c.id} className="glass-effect rounded-2xl p-6 border flex flex-col justify-between">
              <div>
                {c.poster_url && (
                  <img src={c.poster_url} alt={c.title} className="w-full h-48 object-cover rounded-xl mb-4" />
                )}
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs opacity-70 font-medium">{c.organizer}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'Dibuka' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {c.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-4 leading-snug">{c.title}</h3>
              </div>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono opacity-70">
                  <Calendar size={14} />
                  <span>Batas: {c.deadline}</span>
                </div>
                <a
                  href={c.registration_link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-primary text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
                >
                  Daftar Sekarang <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
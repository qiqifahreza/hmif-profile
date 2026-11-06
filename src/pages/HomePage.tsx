import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';

export const HomePage: React.FC = () => {
  const { settings, announcements, divisions } = useData();

  const latestAnnouncements = announcements.filter((a) => a.is_published).slice(0, 3);
  const upcomingPrograms = divisions.flatMap((d) =>
    d.programs
      .filter((p) => p.status === 'Akan Datang' || p.status === 'Berlangsung')
      .map((p, idx) => ({ ...p, divName: d.shortName, divSlug: d.slug, idx }))
  ).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="pt-20 pb-16 text-center max-w-5xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-mono mb-6 border border-secondary/25">
          <Sparkles size={14} className="text-secondary" />
          <span>{settings.cabinet_name} • {settings.period}</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight text-white dark:text-white light:text-[#121215]">
          {settings.hero_title}
        </h1>
        <p className="text-base sm:text-lg opacity-85 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {settings.hero_subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/proker" className="px-6 py-3 rounded-xl bg-[#bebeca] text-[#121215] font-bold text-sm shadow-lg hover:bg-white transition-all">
            Lihat Program Kerja
          </Link>
          <Link to="/tentang" className="px-6 py-3 rounded-xl liquid-glass border font-medium text-sm hover:border-secondary transition-all">
            Profil HMIF
          </Link>
        </div>
      </section>

      {/* Pengumuman Terbaru dengan Spotlight */}
      {latestAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white dark:text-white light:text-[#121215]">
              <Bell size={20} className="text-secondary" /> Pengumuman Resmi Terbaru
            </h2>
            <Link to="/pengumuman" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              Semua Pengumuman <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestAnnouncements.map((a) => (
              <SpotlightCard key={a.id} className="p-6 h-full">
                <div>
                  {a.poster_url && (
                    <img src={a.poster_url} alt={a.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                  )}
                  <span className="text-[11px] font-mono opacity-70 text-secondary">{a.published_date}</span>
                  <h3 className="font-bold text-lg mt-1 mb-2 leading-snug text-white dark:text-white light:text-[#121215]">{a.title}</h3>
                  <p className="text-xs opacity-85 line-clamp-3 leading-relaxed">{a.content}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      {/* Kegiatan Terdekat dengan Spotlight */}
      {upcomingPrograms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white dark:text-white light:text-[#121215]">
              <Calendar size={20} className="text-secondary" /> Kegiatan Terdekat
            </h2>
            <Link to="/proker" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
              Lihat Seluruh Proker <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingPrograms.map((p, i) => (
              <SpotlightCard
                key={i}
                to={`/proker/${p.divSlug}/${p.idx}`}
                className="p-5 h-full"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase bg-primary/40 text-secondary border border-secondary/25 px-2.5 py-0.5 rounded-full font-bold">
                    {p.divName}
                  </span>
                  <h4 className="font-bold text-base mt-3 mb-2 text-white dark:text-white light:text-[#121215] group-hover:text-secondary transition-colors leading-snug">{p.title}</h4>
                  <p className="text-xs opacity-80 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-secondary/15 text-[11px] font-mono opacity-80 flex items-center justify-between">
                  <span>{p.period}</span>
                  <span className="text-secondary font-bold">{p.status}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      {/* Visi Singkat dengan Spotlight */}
      <section className="max-w-7xl mx-auto px-4">
        <SpotlightCard className="p-8 sm:p-12 text-center rounded-3xl">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 text-white dark:text-white light:text-[#121215]">Visi Kami</h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg opacity-90 leading-relaxed mb-6 font-normal">
            &ldquo;{settings.vision}&rdquo;
          </p>
          <Link to="/tentang" className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:underline">
            <BookOpen size={15} /> Pelajari Misi &amp; Struktur Organisasi Lengkap <ArrowRight size={14} />
          </Link>
        </SpotlightCard>
      </section>
    </div>
  );
};
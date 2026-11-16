import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Sparkles, BookOpen } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import CircularGallery from '../components/CircularGallery';

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
      {/* Hero Section: Adaptif Otomatis (1 Kolom Tengah jika kosong, 2 Kolom jika ada foto) */}
      <section className="pt-16 sm:pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {settings.hero_gallery && settings.hero_gallery.length > 0 ? (
          
          /* KONDISI 1: ADA FOTO DARI ADMIN -> TAMPIL 2 KOLOM (TEKS KIRI, FOTO KANAN) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Teks Hero Kiri */}
            <div className="lg:col-span-6 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-mono border border-slate-300 dark:border-secondary/25 text-slate-800 dark:text-[#bebeca]">
                <Sparkles size={14} className="text-secondary" />
                <span>{settings.cabinet_name} • {settings.period}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
                {settings.hero_title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-[#bebeca]/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
                {settings.hero_subtitle}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                <Link to="/proker" className="px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] font-bold text-sm shadow-lg hover:opacity-90 transition-all">
                  Lihat Program Kerja
                </Link>
                <Link to="/tentang" className="px-6 py-3 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/30 font-medium text-sm text-slate-800 dark:text-white hover:border-slate-500 transition-all">
                  Profil HMIF
                </Link>
              </div>
            </div>

            {/* Slider Foto Kanan */}
            <div className="lg:col-span-6 w-full flex items-center justify-center">
              <div className="h-[360px] sm:h-[420px] lg:h-[460px] w-full relative overflow-hidden">
                <CircularGallery
                  items={settings.hero_gallery}
                  bend={0}
                  wave={0}
                  showTitles={false}
                  enableWheel={false}
                  autoScroll={0}
                  openOnClick={false}
                  borderRadius={0.08}
                  itemAspect={0.75}
                  gap={0.12}
                  scrollSpeed={1.8}
                />
              </div>
            </div>
          </div>

        ) : (

          /* KONDISI 2: FOTO KOSONG -> TAMPIL RAPI DI TENGAH (CENTERED HERO) */
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-xs font-mono border border-slate-300 dark:border-secondary/25 text-slate-800 dark:text-[#bebeca]">
              <Sparkles size={14} className="text-secondary" />
              <span>{settings.cabinet_name} • {settings.period}</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
              {settings.hero_title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#bebeca]/90 leading-relaxed font-normal max-w-2xl mx-auto">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link to="/proker" className="px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] font-bold text-sm shadow-lg hover:opacity-90 transition-all">
                Lihat Program Kerja
              </Link>
              <Link to="/tentang" className="px-6 py-3 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/30 font-medium text-sm text-slate-800 dark:text-white hover:border-slate-500 transition-all">
                Profil HMIF
              </Link>
            </div>
          </div>

        )}
      </section>
      {/* Pengumuman Terbaru */}
      {latestAnnouncements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-950 dark:text-white">
              <Bell size={20} className="text-slate-700 dark:text-secondary" /> Pengumuman Resmi Terbaru
            </h2>
            <Link to="/pengumuman" className="text-xs font-semibold text-slate-900 dark:text-secondary hover:underline flex items-center gap-1">
              Semua Pengumuman <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {latestAnnouncements.map((a) => (
              <SpotlightCard key={a.id} className="p-6 h-full border border-slate-300/80 dark:border-secondary/20">
                <div>
                  {a.poster_url && (
                    <img src={a.poster_url} alt={a.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                  )}
                  <span className="text-[11px] font-mono text-slate-500 dark:text-secondary/70">{a.published_date}</span>
                  <h3 className="font-bold text-lg mt-1 mb-2 leading-snug text-slate-950 dark:text-white">{a.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-3 leading-relaxed">{a.content}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
          
        </section>
      )}

      {/* Proker Terdekat */}
      {upcomingPrograms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-950 dark:text-white">
              <Calendar size={20} className="text-slate-700 dark:text-secondary" /> Kegiatan Terdekat
            </h2>
            <Link to="/proker" className="text-xs font-semibold text-slate-900 dark:text-secondary hover:underline flex items-center gap-1">
              Lihat Seluruh Proker <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingPrograms.map((p, i) => (
              <SpotlightCard
                key={i}
                to={`/proker/${p.divSlug}/${p.idx}`}
                className="p-5 h-full border border-slate-300/80 dark:border-secondary/20"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase bg-slate-200 dark:bg-primary/40 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25 px-2.5 py-0.5 rounded-full font-bold">
                    {p.divName}
                  </span>
                  <h4 className="font-bold text-base mt-3 mb-2 text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-secondary transition-colors leading-snug">{p.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-secondary/15 text-[11px] font-mono text-slate-700 dark:text-secondary flex items-center justify-between">
                  <span>{p.period}</span>
                  <span className="font-bold">{p.status}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
          
        </section>
      )}

      {/* Visi Kami */}
      <section className="max-w-7xl mx-auto px-4">
        <SpotlightCard className="p-8 sm:p-12 text-center rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 text-slate-950 dark:text-white">Visi Kami</h2>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-700 dark:text-[#bebeca] leading-relaxed mb-6 font-normal">
            &ldquo;{settings.vision}&rdquo;
          </p>
          <Link to="/tentang" className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-secondary hover:underline">
            <BookOpen size={15} /> Lihat Struktur Lengkap <ArrowRight size={14} />
          </Link>
        </SpotlightCard>
      </section>
    </div>
  );
};
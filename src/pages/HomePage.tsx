import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Calendar, Sparkles, BookOpen, Layers, CheckCircle2, Clock, Users } from 'lucide-react';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { HeroTerminal } from '../components/HeroTerminal';
import CircularGallery from '../components/CircularGallery';

export const HomePage: React.FC = () => {
  // Ambil isDarkMode agar warna teks caption di CircularGallery otomatis menyesuaikan Dark/Light Mode
  const { settings, announcements, divisions, isDarkMode } = useData();

  const latestAnnouncements = announcements.filter((a) => a.is_published).slice(0, 3);
  
  // Hitung metrik dinamis dari database
  const stats = useMemo(() => {
    const totalDivisions = divisions.length;
    const allProkers = divisions.flatMap((d) => d.programs);
    const totalProkers = allProkers.length;
    const finishedProkers = allProkers.filter((p) => p.status === 'Selesai').length;
    const totalMembers = divisions.reduce(
      (acc, curr) => acc + curr.members.length + (curr.leader ? 1 : 0) + (curr.coLeader ? 1 : 0),
      0
    );

    return { totalDivisions, totalProkers, finishedProkers, totalMembers };
  }, [divisions]);

  const upcomingPrograms = divisions
    .flatMap((d) =>
      d.programs
        .filter((p) => p.status === 'Akan Datang' || p.status === 'Berlangsung')
        .map((p, idx) => ({ ...p, divName: d.shortName, divSlug: d.slug, idx }))
    )
    .slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-20 w-full">
      
      {/* 1. Hero Section: Teks Kiri (5 Kolom) + CircularGallery 16:9 Kanan (7 Kolom) */}
      <section className="w-full pt-10 sm:pt-14 lg:pt-20 pb-4 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Kolom Kiri: Teks & CTA */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass text-[11px] sm:text-xs font-mono border border-slate-300 dark:border-secondary/25 text-slate-800 dark:text-[#bebeca]">
              <Sparkles size={14} className="text-secondary shrink-0" />
              <span>{settings.cabinet_name} • {settings.period}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-tight text-slate-950 dark:text-white">
              {settings.hero_title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#bebeca]/90 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              {settings.hero_subtitle}
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                to="/proker"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] font-bold text-sm shadow-lg hover:opacity-90 transition-all text-center"
              >
                Lihat Program Kerja
              </Link>
              <Link
                to="/tentang"
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/30 font-medium text-sm text-slate-800 dark:text-white hover:border-slate-500 transition-all text-center"
              >
                Profil HMIF
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: CircularGallery Landscape 16:9 Besar */}
          <div className="lg:col-span-7 w-full flex items-center justify-center">
            {settings.hero_gallery && settings.hero_gallery.length > 0 ? (
              <div className="h-[340px] sm:h-[420px] lg:h-[480px] w-full relative overflow-hidden">
                <CircularGallery
                  items={settings.hero_gallery}
                  bend={0}                    // Flat (lurus)
                  wave={0}                    // Tanpa gelombang
                  showTitles={false}          // Bersih tanpa teks di bawah kartu
                  enableWheel={false}         // Tidak ter-scroll oleh mouse wheel
                  autoScroll={0.5}              // Diam, hanya gerak jika disentuh/drag
                  openOnClick={true}          // Klik kartu untuk zoom & lihat informasi foto
                  itemAspect={16 / 9}         // <-- RASIO LANDSCAPE 16:9
                  itemSize={1.15}             // <-- Ukuran diperbesar
                  gap={0.05}
                  borderRadius={0.06}
                  scrollSpeed={1.8}
                  textColor={isDarkMode ? '#ffffff' : '#0f172a'} // Teks informasi adaptif Light/Dark
                />
              </div>
            ) : (
              <HeroTerminal />
            )}
          </div>

        </div>
      </section>

      {/* 2. STATISTIK ORGANISASI (RINGKASAN DATA KABINET) */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl liquid-glass border border-slate-300/80 dark:border-secondary/20 shadow-sm">
          <div className="flex items-center gap-3.5 p-2 sm:p-0">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white block">{stats.totalDivisions}</span>
              <span className="text-xs text-slate-600 dark:text-[#bebeca]/70 font-medium">Departemen &amp; BPH</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 sm:p-0">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Calendar size={22} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white block">{stats.totalProkers}</span>
              <span className="text-xs text-slate-600 dark:text-[#bebeca]/70 font-medium">Program Kerja</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 sm:p-0">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white block">{stats.finishedProkers}</span>
              <span className="text-xs text-slate-600 dark:text-[#bebeca]/70 font-medium">Proker Terlaksana</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-2 sm:p-0">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white block">{stats.totalMembers}</span>
              <span className="text-xs text-slate-600 dark:text-[#bebeca]/70 font-medium">Pengurus Samvaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pengumuman Resmi Terbaru (1 Kolom HP, 2 Kolom Tab, 3 Kolom Desktop) */}
      {latestAnnouncements.length > 0 && (
        <section className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-950 dark:text-white">
              <Bell size={20} className="text-slate-700 dark:text-secondary shrink-0" /> Pengumuman Resmi Terbaru
            </h2>
            <Link to="/pengumuman" className="text-xs font-semibold text-slate-900 dark:text-secondary hover:underline flex items-center gap-1 w-fit">
              Semua Pengumuman <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

      {/* 4. Agenda Terdekat (1 Kolom HP, 2 Kolom Tab, 4 Kolom Desktop) */}
      {upcomingPrograms.length > 0 && (
        <section className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-slate-950 dark:text-white">
              <Clock size={20} className="text-slate-700 dark:text-secondary shrink-0" /> Kegiatan Terdekat
            </h2>
            <Link to="/proker" className="text-xs font-semibold text-slate-900 dark:text-secondary hover:underline flex items-center gap-1 w-fit">
              Lihat Seluruh Proker <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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
                  <h4 className="font-bold text-base mt-3 mb-2 text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-secondary transition-colors leading-snug">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-secondary/15 text-[11px] font-mono text-slate-700 dark:text-secondary flex items-center justify-between">
                  <span>{p.period || 'Coming Soon'}</span>
                  <span className="font-bold">{p.status}</span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      {/* 5. Visi Singkat Organisasi (Full Kiri-Kanan) */}
      <section className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">
        <SpotlightCard className="p-6 sm:p-10 lg:p-14 text-center rounded-3xl border border-slate-300/80 dark:border-secondary/20">
          <h2 className="text-2xl sm:text-3xl font-black mb-4 text-slate-950 dark:text-white">Visi Kami</h2>
          <p className="max-w-4xl mx-auto text-sm sm:text-base lg:text-lg text-slate-700 dark:text-[#bebeca] leading-relaxed mb-6 font-normal">
            &ldquo;{settings.vision}&rdquo;
          </p>
          <Link to="/tentang" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900 dark:text-secondary hover:underline">
            <BookOpen size={16} /> Pelajari Misi &amp; Struktur Organisasi Lengkap <ArrowRight size={14} />
          </Link>
        </SpotlightCard>
      </section>

    </div>
  );
};
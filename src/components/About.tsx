import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="tentang" className="py-24 bg-transparent text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-secondary bg-primary px-3 py-1 rounded-full border border-secondary/20">
            Profil Himpunan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
            Visi &amp; Misi
          </h2>
          <div className="h-1 w-16 bg-secondary/40 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Visi */}
          <div className="bg-surface p-8 rounded-2xl border border-primary hover:border-secondary/40 transition-colors">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              Visi
            </h3>
            <p className="text-secondary/90 leading-relaxed text-sm sm:text-base">
              Menjadikan HMIF UISI sebagai wadah akselerasi potensi mahasiswa informatika yang unggul,
              berintegritas, inklusif, dan adaptif terhadap perkembangan teknologi global di bawah naungan <strong>Kabinet Samvaya</strong>.
            </p>
          </div>

          {/* Card Misi */}
          <div className="bg-surface p-8 rounded-2xl border border-primary hover:border-secondary/40 transition-colors">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
              Misi
            </h3>
            <ul className="space-y-3 text-secondary/90 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                <span>Membangun iklim riset, inovasi software, dan kompetisi teknologi yang berdaya saing tinggi.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                <span>Menyelenggarakan pembinaan karakter, etika, dan kepemimpinan yang berkelanjutan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white mt-1">•</span>
                <span>Memperluas jejaring strategis dengan alumni, civitas akademika, dan dunia industri IT nasional.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
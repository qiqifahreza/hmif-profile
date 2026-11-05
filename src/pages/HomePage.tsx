import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Users } from 'lucide-react';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Events } from '../components/Events';
import { useData } from '../context/DataContext'; // <-- Ganti import ini

export const HomePage: React.FC = () => {
  const { divisions } = useData(); // <-- Ambil data dinamis

  return (
    <div className="bg-dark text-secondary min-h-screen">
      <Hero />
      <About />

      {/* Section Divisi */}
      <section id="divisi" className="py-24 bg-surface border-t border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs uppercase font-mono tracking-widest text-secondary bg-primary/80 px-3 py-1 rounded-full border border-secondary/20">
              Struktur Kepengurusan
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
              Divisi &amp; BPH Kabinet Samvaya
            </h2>
            <p className="text-secondary mt-2 max-w-xl mx-auto text-sm sm:text-base">
              Klik pada divisi untuk melihat profil Kadiv, seluruh staf, dan rincian program kerja.
            </p>
            <div className="h-1 w-16 bg-secondary/40 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Iterasi data dinamis */}
            {divisions.map((div) => (
              <Link
                key={div.slug}
                to={`/divisi/${div.slug}`}
                className="group relative liquid-glass-card rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-primary/80 border border-secondary/30 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-dark group-hover:shadow-[0_0_15px_rgba(190,190,202,0.4)] transition-all duration-300">
                    {div.slug === 'kahim-wakahim' ? <Users size={20} /> : <Layers size={20} />}
                  </div>

                  <span className="text-[11px] font-mono text-secondary/70 font-semibold tracking-wider uppercase block mb-1">
                    {div.shortName}
                  </span>
                  <h3 className="font-bold text-lg text-white group-hover:text-white transition-colors mb-2">
                    {div.name}
                  </h3>
                  <p className="text-xs text-secondary/80 line-clamp-3 leading-relaxed mb-6">
                    {div.about}
                  </p>
                </div>

                <div className="pt-4 border-t border-secondary/10 flex items-center justify-between text-xs font-medium text-secondary group-hover:text-white transition-colors">
                  <span>View Team</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Events />
    </div>
  );
};
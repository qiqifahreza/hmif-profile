import React from 'react';
import { User } from 'lucide-react';
import { useData } from '../context/DataContext';

export const BlogPage: React.FC = () => {
  const { blogs } = useData();
  const published = blogs.filter((b) => b.is_published);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border">
          Karya Tulis &amp; Insight
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-3 mb-3">Blog &amp; Edukasi</h1>
        <p className="text-sm opacity-75">Artikel teknologi, tutorial coding, dan catatan pengalaman mahasiswa Informatika.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {published.length === 0 ? (
          <div className="col-span-full p-12 text-center glass-effect rounded-2xl border opacity-60 text-sm">
            Belum ada artikel yang dipublikasikan.
          </div>
        ) : (
          published.map((b) => (
            <div key={b.id} className="glass-effect rounded-2xl p-6 border flex flex-col justify-between">
              <div>
                {b.cover_url && (
                  <img src={b.cover_url} alt={b.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                )}
                <div className="flex gap-1.5 flex-wrap mb-2">
                  {b.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
                <h3 className="font-bold text-lg mb-2 leading-snug">{b.title}</h3>
                <p className="text-xs opacity-75 line-clamp-3 leading-relaxed mb-6">{b.excerpt}</p>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-xs opacity-70 font-mono">
                <span className="flex items-center gap-1"><User size={13}/> {b.author}</span>
                <span>{b.published_date}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
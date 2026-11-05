import React from 'react';
import { Cpu, Users, Megaphone, DollarSign } from 'lucide-react';

interface DivisionCard {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export const Divisions: React.FC = () => {
  const divisions: DivisionCard[] = [
    {
      title: 'Riset & Teknologi',
      desc: 'Fokus pada pengembangan coding camp, proyek open-source, dan bootcamp web/mobile dev.',
      icon: <Cpu className="w-8 h-8 text-blue-400" />
    },
    {
      title: 'PSDM (Pengembangan SDM)',
      desc: 'Membimbing kaderisasi mahasiswa baru dan pembinaan karakter anggota organisasi.',
      icon: <Users className="w-8 h-8 text-emerald-400" />
    },
    {
      title: 'Humas & Media',
      desc: 'Mengelola kanal komunikasi publik, podcast teknologi, dan publikasi visual sosial media.',
      icon: <Megaphone className="w-8 h-8 text-amber-400" />
    },
    {
      title: 'Danus (Dana Usaha)',
      desc: 'Membangun jiwa technopreneurship anggota lewat merchandise resmi dan pendanaan kreatif.',
      icon: <DollarSign className="w-8 h-8 text-rose-400" />
    }
  ];

  return (
    <section id="divisi" className="py-20 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Departemen & Divisi</h2>
          <p className="text-slate-400 mt-2">Pilar penggerak operasional organisasi</p>
          <div className="h-1 w-16 bg-blue-500 mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {divisions.map((div, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-all hover:-translate-y-1"
            >
              <div className="p-3 bg-slate-800 w-fit rounded-lg mb-4">
                {div.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{div.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{div.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
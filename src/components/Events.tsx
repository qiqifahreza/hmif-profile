import React from 'react';
import { Calendar } from 'lucide-react';
import type { EventProgram } from '../types';

export const Events: React.FC = () => {
  const events: EventProgram[] = [
    {
      id: '1',
      title: 'N/A',
      date: 'dd/mm/yyyy',
      description: 'none',
      tag: '#?'
    },
    {
      id: '2',
      title: 'N/A',
      date: 'dd/mm/yyyy',
      description: 'none',
      tag: '#?'
    },
    {
      id: '3',
      title: 'N/A',
      date: 'dd/mm/yyyy',
      description: 'none',
      tag: '#?'
    }
  ];

  return (
    <section id="proker" className="py-24 bg-[#1e1e24] text-secondary border-t border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-mono tracking-widest text-secondary bg-primary/80 px-3 py-1 rounded-full border border-secondary/20">
            Agenda Akbar
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-4">
            Program Kerja Utama
          </h2>
          <div className="h-1 w-16 bg-secondary/40 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-surface border border-primary hover:border-secondary/50 p-6 rounded-2xl flex flex-col justify-between transition-all hover:-translate-y-1"
            >
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-primary text-secondary border border-secondary/20 rounded-md">
                  {ev.tag}
                </span>
                <h3 className="font-bold text-xl text-white mt-4 mb-2">{ev.title}</h3>
                <p className="text-sm text-secondary/80 mb-6 leading-relaxed">{ev.description}</p>
              </div>
              <div className="pt-4 border-t border-primary flex items-center gap-2 text-xs font-mono text-secondary">
                <Calendar size={14} className="text-secondary" />
                <span>Pelaksanaan: {ev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
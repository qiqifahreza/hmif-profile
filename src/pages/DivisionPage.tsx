import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import type { Member } from '../types';
import { useData } from '../context/DataContext';
import { SpotlightCard } from '../components/SpotlightCard';
import { MemberSkeleton } from '../components/Skeleton';

const MemberAvatar: React.FC<{ member: Member; isLeader: boolean }> = ({ member, isLeader }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative mb-4 group/avatar">
      <div
        className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 ${
          isLeader
            ? 'border-2 border-slate-900 dark:border-[#bebeca] bg-slate-200 dark:bg-[#3c3c44]/60 shadow-md ring-4 ring-slate-300 dark:ring-[#bebeca]/20'
            : 'border border-slate-300 dark:border-[#bebeca]/25 bg-slate-100 dark:bg-[#19191d]/80'
        }`}
      >
        {member.imageUrl && !hasError ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
          />
        ) : (
          <User size={40} className={isLeader ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#bebeca]'} />
        )}
      </div>

      {isLeader && (
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-900 dark:bg-[#3c3c44] border border-white dark:border-[#bebeca] flex items-center justify-center text-white shadow-md">
          <ShieldCheck size={13} className="text-white dark:text-[#bebeca]" />
        </div>
      )}
    </div>
  );
};

export const DivisionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
const { divisions, isLoading } = useData();
  const division = divisions.find((d) => d.slug === slug);

  if (!division) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-slate-950 dark:text-white">Divisi Tidak Ditemukan</h1>
        <Link to="/tentang" className="text-blue-600 dark:text-[#bebeca] hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Halaman Struktur
        </Link>
      </div>
    );
  }

  const renderMemberCard = (member: Member, isLeader = false) => (
    <SpotlightCard
      key={member.nim || member.name}
      className={`p-6 flex flex-col items-center text-center border border-slate-300/80 dark:border-secondary/20 ${
        isLeader ? 'ring-1 ring-slate-300 dark:ring-[#bebeca]/30' : ''
      }`}
    >
      <MemberAvatar member={member} isLeader={isLeader} />
      <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-1 leading-snug">{member.name}</h4>
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-primary/40 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25">
          {member.role}
        </span>
      </div>
      {member.nim && (
        <span className="text-[11px] font-mono text-slate-600 dark:text-[#bebeca]/80 px-2.5 py-1 rounded-md border border-slate-300 dark:border-secondary/20 bg-slate-100 dark:bg-[#121215]/80">
          NIM: {member.nim}
        </span>
      )}
    </SpotlightCard>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">
      <Link
        to="/tentang"
        className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white transition-colors px-4 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/20 w-fit"
      >
        <ArrowLeft size={16} /> Kembali ke Struktur Organisasi
      </Link>

      {/* Header Divisi */}
      <SpotlightCard className="p-8 sm:p-12 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
        <span className="text-xs uppercase font-mono tracking-widest px-3.5 py-1.5 bg-slate-200 dark:bg-primary/40 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25 rounded-full w-fit font-bold">
          Divisi Kabinet Samvaya
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-5 mb-4 tracking-tight text-slate-950 dark:text-white">
          {division.name}
        </h1>
        <p className="text-slate-700 dark:text-[#bebeca]/90 text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
          {division.about}
        </p>
      </SpotlightCard>
{/* Pimpinan */}
   <div>
     <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Pimpinan Divisi</h2>
     <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
     {isLoading ? (
       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <MemberSkeleton />
         <MemberSkeleton />
       </div>
     ) : (
       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {renderMemberCard(division.leader, true)}
         {division.coLeader && renderMemberCard(division.coLeader, true)}
       </div>
     )}
   </div>

   {/* Anggota Staf */}
   <div>
     <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Anggota Staf</h2>
     <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
     {isLoading ? (
       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {Array.from({ length: 4 }).map((_, i) => (
           <MemberSkeleton key={i} />
         ))}
       </div>
     ) : (
       <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
         {division.members.map((m) => renderMemberCard(m, false))}
       </div>
     )}
   </div>

      {/* Proker Divisi */}
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Program Kerja Divisi</h2>
        <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
        <div className="grid md:grid-cols-2 gap-6">
          {division.programs.map((proker, index) => (
            <SpotlightCard key={index} className="p-7 border border-slate-300/80 dark:border-secondary/20">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-primary/30 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25">
                  {proker.status || 'Direncanakan'}
                </span>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white mt-3 mb-2.5 leading-snug">{proker.title}</h3>
                <p className="text-slate-600 dark:text-[#bebeca]/80 text-sm leading-relaxed mb-6 font-normal">
                  {proker.description}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#bebeca]/80">
                <Calendar size={14} />
                <span>Jadwal: {proker.period || 'Coming Soon'}</span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </div>
  );
};
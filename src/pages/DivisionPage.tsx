import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, ShieldCheck, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
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
      <div className="min-h-[60vh] flex flex-col justify-center items-center px-4 text-center">
        <h1 className="text-3xl font-bold mb-4 text-slate-950 dark:text-white">Divisi Tidak Ditemukan</h1>
        <Link to="/tentang" className="text-blue-600 dark:text-[#bebeca] hover:underline inline-flex items-center gap-2 text-sm font-semibold">
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
      <h4 className="text-base sm:text-lg font-bold text-slate-950 dark:text-white mb-1 leading-snug">{member.name}</h4>
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
    <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 py-10 sm:py-12 space-y-12 sm:space-y-14">
      
      {/* Tombol Kembali */}
      <Link
        to="/tentang"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-[#bebeca] hover:text-slate-950 dark:hover:text-white transition-colors px-4 py-2 rounded-xl liquid-glass border border-slate-300 dark:border-secondary/20 w-fit"
      >
        <ArrowLeft size={16} /> Kembali ke Struktur Organisasi
      </Link>

      {/* Header Divisi Full Kiri-Kanan */}
      <SpotlightCard className="p-6 sm:p-10 lg:p-12 rounded-3xl border border-slate-300/80 dark:border-secondary/20">
        <span className="text-xs uppercase font-mono tracking-widest px-3.5 py-1.5 bg-slate-200 dark:bg-primary/40 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25 rounded-full w-fit font-bold">
          Divisi Kabinet Samvaya
        </span>
        <h1 className="text-3xl sm:text-5xl font-black mt-5 mb-4 tracking-tight text-slate-950 dark:text-white">
          {division.name}
        </h1>
        <p className="text-slate-700 dark:text-[#bebeca]/90 text-sm sm:text-base lg:text-lg max-w-4xl leading-relaxed font-normal">
          {division.about}
        </p>
      </SpotlightCard>

      {/* Pimpinan Divisi */}
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Pimpinan Divisi</h2>
        <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <MemberSkeleton />
            <MemberSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {renderMemberCard(division.leader, true)}
            {division.coLeader && renderMemberCard(division.coLeader, true)}
          </div>
        )}
      </div>

      {/* Anggota Staf */}
      {division.members.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Anggota Staf</h2>
          <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <MemberSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {division.members.map((m) => renderMemberCard(m, false))}
            </div>
          )}
        </div>
      )}

      {/* Proker Divisi (Klik untuk ke Detail Proker!) */}
      <div>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">Program Kerja Divisi</h2>
        <div className="h-1 w-12 bg-slate-900 dark:bg-secondary/50 rounded mb-6"></div>
        
        {division.programs.length === 0 ? (
          <div className="p-10 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-secondary/20 text-xs sm:text-sm text-slate-500 dark:text-[#bebeca]/60">
            Belum ada program kerja yang terdaftar pada divisi ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {division.programs.map((proker, index) => (
              <SpotlightCard
                key={index}
                to={`/proker/${division.slug}/${index}`}
                className="p-6 sm:p-7 border border-slate-300/80 dark:border-secondary/20 flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-primary/30 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25">
                    {proker.status || 'Direncanakan'}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mt-3 mb-2.5 leading-snug group-hover:text-blue-600 dark:group-hover:text-secondary transition-colors">
                    {proker.title}
                  </h3>
                  <p className="text-slate-600 dark:text-[#bebeca]/80 text-xs sm:text-sm leading-relaxed mb-6 font-normal line-clamp-3">
                    {proker.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-secondary/15 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#bebeca]/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{proker.period || 'Coming Soon'}</span>
                  </div>
                  <span className="text-slate-900 dark:text-secondary font-sans font-semibold flex items-center gap-1 group-hover:text-blue-600 dark:group-hover:text-white">
                    Detail <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
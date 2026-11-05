import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, ShieldCheck, Calendar, ArrowLeft } from 'lucide-react';
import type { Member } from '../types';
import { useData } from '../context/DataContext';

// Subkomponen Avatar Pengurus...
// ==========================================
// 1. FRAME FOTO AVATAR BERGAYA LIQUID GLASS
// ==========================================
const MemberAvatar: React.FC<{ member: Member; isLeader: boolean }> = ({ member, isLeader }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative mb-4 group/avatar">
      <div
        className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 ${
          isLeader
            ? 'border-2 border-secondary bg-primary/60 shadow-[0_0_25px_rgba(190,190,202,0.3)] ring-4 ring-secondary/20 group-hover/avatar:ring-secondary/40'
            : 'border border-secondary/25 bg-[#19191d]/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] group-hover/avatar:border-secondary/50'
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
          <User size={40} className={isLeader ? 'text-white' : 'text-secondary'} />
        )}
      </div>

      {/* Aksen kilau kaca kecil di sudut avatar untuk ketua/kadiv */}
      {isLeader && (
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary border border-secondary flex items-center justify-center text-white shadow-md">
          <ShieldCheck size={13} className="text-secondary" />
        </div>
      )}
    </div>
  );
};

export const DivisionPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
    const { divisions } = useData();
    const division = divisions.find((d) => d.slug === slug);

  if (!division) {
    return (
      <div className="min-h-screen bg-dark text-secondary flex flex-col justify-center items-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-white">Divisi Tidak Ditemukan</h1>
        <Link to="/" className="text-white hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ==========================================
  // 2. KARTU PENGURUS & ANGGOTA (LIQUID GLASS)
  // ==========================================
  const renderMemberCard = (member: Member, isLeader = false) => (
    <div
      key={member.nim || member.name}
      className={`p-6 rounded-2xl flex flex-col items-center text-center liquid-glass-card transition-all duration-300 ${
        isLeader
          ? 'ring-1 ring-secondary/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)]'
          : ''
      }`}
    >
      {/* Frame Foto Liquid Glass */}
      <MemberAvatar member={member} isLeader={isLeader} />

      <h4 className="text-lg font-bold text-white mb-1 leading-snug">{member.name}</h4>
      
      <div className="flex items-center gap-1.5 mb-3">
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isLeader
              ? 'bg-primary text-white border border-secondary/40 shadow-sm'
              : 'text-secondary/80 bg-[#19191d]/60 border border-primary'
          }`}
        >
          {member.role}
        </span>
      </div>

      {member.nim && (
        <span className="text-[11px] font-mono text-secondary/70 bg-dark/80 px-2.5 py-1 rounded-md border border-primary/80">
          NIM: {member.nim}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-dark text-secondary pt-28 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Tombol Kembali */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors mb-8 px-4 py-2 rounded-xl liquid-glass w-fit"
        >
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>

        {/* ==========================================
            3. HEADER DIVISI (PANEL LIQUID GLASS)
           ========================================== */}
        <div className="liquid-glass rounded-3xl p-8 sm:p-12 mb-14 relative overflow-hidden shadow-2xl">
          {/* Cahaya bias internal di dalam kaca */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-primary/40 blur-3xl pointer-events-none" />

          <span className="text-xs uppercase font-mono tracking-widest px-3.5 py-1.5 bg-primary/80 text-secondary border border-secondary/25 rounded-full shadow-inner">
            Divisi Kabinet Samvaya
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mt-5 mb-4 tracking-tight text-white drop-shadow-sm">
            {division.name}
          </h1>
          <p className="text-secondary text-base sm:text-lg max-w-3xl leading-relaxed font-normal">
            {division.about}
          </p>
        </div>

        {/* Pimpinan Divisi */}
        <div className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Pimpinan Divisi</h2>
            <div className="h-1 w-12 bg-secondary/50 rounded mt-2"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderMemberCard(division.leader, true)}
            {division.coLeader && renderMemberCard(division.coLeader, true)}
          </div>
        </div>

        {/* Anggota Staf */}
        {division.members.length > 0 && (
          <div className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Anggota Staf</h2>
              <div className="h-1 w-12 bg-secondary/50 rounded mt-2"></div>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {division.members.map((m) => renderMemberCard(m, false))}
            </div>
          </div>
        )}

        {/* ==========================================
            4. PROGRAM KERJA (LIQUID GLASS CARDS)
           ========================================== */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Program Kerja Divisi</h2>
            <div className="h-1 w-12 bg-secondary/50 rounded mt-2"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {division.programs.map((proker, index) => (
              <div
                key={index}
                className="liquid-glass-card p-6 sm:p-7 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-2.5">{proker.title}</h3>
                  <p className="text-secondary/85 text-sm leading-relaxed mb-6 font-normal">
                    {proker.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-secondary/10 flex items-center gap-2 text-xs font-mono text-secondary">
                  <Calendar size={14} className="text-secondary" />
                  <span>Jadwal: {proker.period}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
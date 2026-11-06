import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  LogOut, Plus, Trash2, Edit3, ArrowLeft,
  Calendar, Layers, KeyRound, Palette, Bell, Trophy, BookOpen, Camera, Upload, X, Sun, Moon
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Member, DivisionProker, ProkerStatus, Announcement, Competition, BlogPost, SiteSettings } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    divisions, announcements, competitions, blogs, settings,
    isAdmin, adminUsername, logout, changeCredentials, updateSettings,
    isDarkMode, toggleTheme,
    updateLeader, updateCoLeader, addMember, updateMember, deleteMember,
    addProgram, updateProgram, deleteProgram,
    saveAnnouncement, deleteAnnouncement,
    saveCompetition, deleteCompetition,
    saveBlog, deleteBlog
  } = useData();

  const navigate = useNavigate();

  // Tab Menu Superpanel
  type TabType = 'settings' | 'divisions' | 'programs' | 'documentation' | 'announcements' | 'competitions' | 'blogs';
  const [activeTab, setActiveTab] = useState<TabType>('settings');

  // Divisipanel Selection
  const [selectedDivSlug, setSelectedDivSlug] = useState<string>(divisions[0]?.slug || 'kahim-wakahim');

  // Form Pengaturan Situs & Warna
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [newMissionItem, setNewMissionItem] = useState('');

  // Modals State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberIndex, setMemberIndex] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState<Member>({ name: '', role: '', nim: '', imageUrl: '' });
  const [isEditingLeader, setIsEditingLeader] = useState<'leader' | 'coLeader' | null>(null);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programIndex, setProgramIndex] = useState<number | null>(null);
  const [programForm, setProgramForm] = useState<DivisionProker>({
    title: '', description: '', period: '', status: 'Direncanakan',
    documentation: { title: '', date: '', summary: '', photoUrls: [] }
  });

  // State Khusus Dokumentasi Kegiatan
  const [showDocModal, setShowDocModal] = useState(false);
  const [isNewDocActivity, setIsNewDocActivity] = useState(false);
  const [docSelectedProkerIdx, setDocSelectedProkerIdx] = useState<number>(-1);
  const [docForm, setDocForm] = useState({
    title: '',
    date: '',
    summary: '',
    photoUrls: [] as string[],
  });
  const [tempDocPhotoUrl, setTempDocPhotoUrl] = useState('');

  const [showAnnModal, setShowAnnModal] = useState(false);
  const [annForm, setAnnForm] = useState<Partial<Announcement>>({ title: '', content: '', poster_url: '', is_published: true });

  const [showCompModal, setShowCompModal] = useState(false);
  const [compForm, setCompForm] = useState<Partial<Competition>>({ title: '', organizer: '', deadline: '', registration_link: '', poster_url: '', status: 'Dibuka' });

  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({ title: '', excerpt: '', content: '', author: 'Admin HMIF', cover_url: '', tags: ['Informatika'], is_published: true });

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState(adminUsername);
  const [newPassword, setNewPassword] = useState('');

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentDiv = divisions.find((d) => d.slug === selectedDivSlug) || divisions[0];

  // Helper File Upload Lokal ke Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB agar penyimpanan Supabase lancar.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          callback(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  // Buka Modal untuk Menambah Dokumentasi Baru
  const handleOpenAddDocModal = () => {
    setIsNewDocActivity(true);
    setDocSelectedProkerIdx(-1);
    setDocForm({
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      photoUrls: [],
    });
    setTempDocPhotoUrl('');
    setShowDocModal(true);
  };

  // Buka Modal untuk Edit Dokumentasi yang Sudah Ada
  const handleOpenEditDocModal = (prokerIdx: number) => {
    const p = currentDiv.programs[prokerIdx];
    setIsNewDocActivity(false);
    setDocSelectedProkerIdx(prokerIdx);
    setDocForm({
      title: p.title,
      date: p.documentation?.date || p.period || '',
      summary: p.documentation?.summary || '',
      photoUrls: p.documentation?.photoUrls || [],
    });
    setTempDocPhotoUrl('');
    setShowDocModal(true);
  };

  // Simpan Dokumentasi (Langsung Tersinkron ke Supabase)
  const handleSaveDocumentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) {
      alert('Nama kegiatan wajib diisi!');
      return;
    }

    if (isNewDocActivity || docSelectedProkerIdx === -1) {
      // Jika kegiatan baru: tambahkan sebagai proker Selesai baru
      const newProker: DivisionProker = {
        title: docForm.title.trim(),
        description: docForm.summary.trim() || 'Kegiatan terdokumentasi.',
        period: docForm.date,
        status: 'Selesai',
        documentation: {
          title: docForm.title.trim(),
          date: docForm.date,
          summary: docForm.summary.trim(),
          photoUrls: docForm.photoUrls,
        },
      };
      await addProgram(selectedDivSlug, newProker);
    } else {
      // Jika mengedit proker yang sudah ada
      const target = currentDiv.programs[docSelectedProkerIdx];
      const updated: DivisionProker = {
        ...target,
        title: docForm.title.trim(),
        period: docForm.date || target.period,
        status: 'Selesai',
        documentation: {
          title: docForm.title.trim(),
          date: docForm.date,
          summary: docForm.summary.trim(),
          photoUrls: docForm.photoUrls,
        },
      };
      await updateProgram(selectedDivSlug, docSelectedProkerIdx, updated);
    }

    setShowDocModal(false);
  };
  // Apakah DivisiPanel perlu ditampilkan di sidebar kiri?
  const showDivisiPanel = activeTab === 'divisions' || activeTab === 'programs' || activeTab === 'documentation';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#121215] text-[#bebeca]">
{/* ========================================================
          SIDEBAR KIRI: SUPERPANEL & DIVISIPANEL LENGKAP
         ======================================================== */}
      <aside className="w-full lg:w-72 lg:min-h-screen border-r border-slate-300 dark:border-[#3c3c44] bg-slate-50 dark:bg-[#16161b] p-5 flex flex-col justify-between shrink-0 transition-colors duration-300">
        <div className="space-y-6">
          
          {/* Logo & Info Admin + TOMBOL SWITCH TEMA */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to="/" className="text-xs text-slate-500 dark:text-[#bebeca]/60 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors mb-2">
                <ArrowLeft size={13} /> Ke Website Publik
              </Link>
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-snug">HMIF CMS Panel</h1>
              <p className="text-[11px] font-mono text-slate-500 dark:text-[#bebeca]/60">Login: @{adminUsername}</p>
            </div>

            {/* Tombol Switch Tema */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#232329] hover:bg-slate-100 dark:hover:bg-[#3c3c44] shadow-sm transition-all cursor-pointer shrink-0"
              title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-slate-700" />
              )}
            </button>
          </div>

          {/* SUPERPANEL NAVIGASI UTAMA (MENGGUNAKAN SEMUA IKON DAN SETACTIVETAB) */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-[#bebeca]/50 block px-2 mb-1.5">
              Superpanel
            </span>
            {[
              { id: 'settings', label: 'Pengaturan & Warna', icon: <Palette size={15}/> },
              { id: 'divisions', label: 'Divisi & Anggota', icon: <Layers size={15}/> },
              { id: 'programs', label: 'Program Kerja', icon: <Calendar size={15}/> },
              { id: 'documentation', label: 'Dokumentasi', icon: <Camera size={15}/> },
              { id: 'announcements', label: 'Pengumuman', icon: <Bell size={15}/> },
              { id: 'competitions', label: 'Kompetisi', icon: <Trophy size={15}/> },
              { id: 'blogs', label: 'Blog & Edukasi', icon: <BookOpen size={15}/> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                    : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* DIVISIPANEL (HANYA MUNCUL DI TAB DIVISI, PROKER, & DOKUMENTASI) */}
          {showDivisiPanel && (
            <div className="space-y-1 pt-4 border-t border-slate-300 dark:border-[#3c3c44]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-[#bebeca]/50 block px-2 mb-1.5">
                Pilih Divisi
              </span>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {divisions.map((d) => (
                  <button
                    key={d.slug}
                    onClick={() => setSelectedDivSlug(d.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors truncate cursor-pointer ${
                      selectedDivSlug === d.slug
                        ? 'bg-slate-300 dark:bg-[#3c3c44] text-slate-900 dark:text-white font-bold border-l-2 border-slate-900 dark:border-[#bebeca]'
                        : 'text-slate-600 dark:text-[#bebeca]/70 hover:bg-slate-200 dark:hover:bg-[#232329]'
                    }`}
                    title={d.name}
                  >
                    {d.shortName}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Sidebar: Ganti Akun & Logout */}
        <div className="pt-4 border-t border-slate-300 dark:border-[#3c3c44] flex items-center justify-between gap-2">
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-slate-300 dark:border-[#3c3c44] hover:border-slate-500 dark:hover:border-[#bebeca] text-[11px] font-semibold text-slate-700 dark:text-[#bebeca] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <KeyRound size={13} /> Akun
          </button>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-600 dark:text-red-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </aside>
      {/* ========================================================
          KONTEN UTAMA KANAN
         ======================================================== */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-8">
{/* TAB 1: PENGATURAN TEKS, WARNA, LOGO, DAN MISI */}
          {activeTab === 'settings' && (
            <div className="liquid-glass rounded-3xl p-6 lg:p-8 border border-slate-300 dark:border-[#3c3c44] space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kustomisasi Tampilan &amp; Konten Website</h2>
              </div>
              
              <form onSubmit={async (e) => { e.preventDefault(); await updateSettings(siteForm); alert('Pengaturan tersimpan ke Supabase!'); }} className="space-y-6">
                
                {/* 1. Pengaturan Palet Warna */}
                <div className="space-y-3 p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] bg-slate-100/70 dark:bg-[#16161b]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white">Palet Warna Tema</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Primary (Dark Mode)</label>
                      <input type="color" value={siteForm.primary_color_dark} onChange={(e) => setSiteForm({...siteForm, primary_color_dark: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Secondary (Dark Mode)</label>
                      <input type="color" value={siteForm.secondary_color_dark} onChange={(e) => setSiteForm({...siteForm, secondary_color_dark: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Primary (Light Mode)</label>
                      <input type="color" value={siteForm.primary_color_light} onChange={(e) => setSiteForm({...siteForm, primary_color_light: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Secondary (Light Mode)</label>
                      <input type="color" value={siteForm.secondary_color_light} onChange={(e) => setSiteForm({...siteForm, secondary_color_light: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-[#3c3c44]" />
                    </div>
                  </div>
                </div>

                {/* 2. Upload Logo (File Lokal & URL) */}
                <div className="p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] bg-slate-100/70 dark:bg-[#16161b] space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-800 dark:text-white">Logo Organisasi (Upload File atau URL)</label>
                  <div className="flex items-center gap-4">
                    {siteForm.logo_url && (
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-300 dark:border-[#bebeca] bg-black p-1 shrink-0">
                        <img src={siteForm.logo_url} alt="Logo" className="w-full h-full object-contain" />
                        <button type="button" onClick={() => setSiteForm({...siteForm, logo_url: ''})} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5"><X size={10}/></button>
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 bg-slate-200 dark:bg-[#232329] hover:bg-slate-300 dark:hover:bg-[#3c3c44] border border-slate-300 dark:border-[#3c3c44] rounded-xl text-xs text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
                      <Upload size={14} /> Pilih Logo dari Perangkat
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setSiteForm({...siteForm, logo_url: base64}))} />
                    </label>
                  </div>
                  <input type="text" placeholder="Atau masukkan tautan URL Logo (https://...)" value={siteForm.logo_url} onChange={(e) => setSiteForm({...siteForm, logo_url: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                </div>

                {/* 3. Teks Identitas */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Nama Organisasi</label>
                    <input type="text" value={siteForm.org_name} onChange={(e) => setSiteForm({...siteForm, org_name: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Nama Kabinet</label>
                    <input type="text" value={siteForm.cabinet_name} onChange={(e) => setSiteForm({...siteForm, cabinet_name: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Judul Beranda (Hero Title)</label>
                  <input type="text" value={siteForm.hero_title} onChange={(e) => setSiteForm({...siteForm, hero_title: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Deskripsi Beranda (Hero Subtitle)</label>
                  <textarea rows={2} value={siteForm.hero_subtitle} onChange={(e) => setSiteForm({...siteForm, hero_subtitle: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Visi Organisasi</label>
                  <textarea rows={2} value={siteForm.vision} onChange={(e) => setSiteForm({...siteForm, vision: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white" />
                </div>

                {/* 4. Butir-Butir Misi */}
                <div className="p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] bg-slate-100/70 dark:bg-[#16161b] space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-mono font-bold text-slate-800 dark:text-white">Butir-Butir Misi Organisasi</label>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-[#bebeca]/60">Total: {siteForm.mission.length}</span>
                  </div>

                  {siteForm.mission.map((mItem, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-700 dark:text-[#bebeca]">{idx + 1}.</span>
                      <input
                        type="text"
                        value={mItem}
                        onChange={(e) => {
                          const updated = [...siteForm.mission];
                          updated[idx] = e.target.value;
                          setSiteForm({...siteForm, mission: updated});
                        }}
                        className="flex-1 border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = siteForm.mission.filter((_, i) => i !== idx);
                          setSiteForm({...siteForm, mission: updated});
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Tulis butir misi baru..."
                      value={newMissionItem}
                      onChange={(e) => setNewMissionItem(e.target.value)}
                      className="flex-1 border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2 rounded-xl text-xs text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMissionItem.trim()) {
                          setSiteForm({...siteForm, mission: [...siteForm.mission, newMissionItem.trim()]});
                          setNewMissionItem('');
                        }
                      }}
                      className="px-3.5 py-2 bg-slate-900 dark:bg-[#bebeca] text-white dark:text-[#121215] text-xs font-bold rounded-xl"
                    >
                      Tambah Misi
                    </button>
                  </div>
                </div>

                <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-[#bebeca] hover:opacity-90 text-white dark:text-[#121215] font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                  Simpan Semua Pengaturan
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: DIVISI & ANGGOTA (DENGAN UPLOAD FOTO PROFIL LOKAL) */}
          {activeTab === 'divisions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Kelola {currentDiv.name}</h2>
              </div>

              {/* Pimpinan */}
              <div className="liquid-glass p-6 rounded-2xl border border-[#3c3c44] space-y-4">
                <h3 className="font-bold text-sm text-white">Pimpinan Divisi</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-[#3c3c44] rounded-xl flex items-center justify-between bg-[#19191d]">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border border-[#bebeca] bg-black">
                        {currentDiv.leader.imageUrl ? <img src={currentDiv.leader.imageUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">IF</div>}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-[#bebeca] uppercase font-bold">{currentDiv.leader.role}</span>
                        <h4 className="font-bold text-sm text-white">{currentDiv.leader.name}</h4>
                        <span className="text-xs opacity-60">NIM: {currentDiv.leader.nim || '-'}</span>
                      </div>
                    </div>
                    <button onClick={() => { setIsEditingLeader('leader'); setMemberForm({...currentDiv.leader}); setShowMemberModal(true); }} className="p-2 border border-[#3c3c44] hover:bg-[#3c3c44] rounded-lg">
                      <Edit3 size={15}/>
                    </button>
                  </div>

                  {currentDiv.coLeader && (
                    <div className="p-4 border border-[#3c3c44] rounded-xl flex items-center justify-between bg-[#19191d]">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-[#bebeca] bg-black">
                          {currentDiv.coLeader.imageUrl ? <img src={currentDiv.coLeader.imageUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold">IF</div>}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#bebeca] uppercase font-bold">{currentDiv.coLeader.role}</span>
                          <h4 className="font-bold text-sm text-white">{currentDiv.coLeader.name}</h4>
                          <span className="text-xs opacity-60">NIM: {currentDiv.coLeader.nim || '-'}</span>
                        </div>
                      </div>
                      <button onClick={() => { setIsEditingLeader('coLeader'); setMemberForm({...currentDiv.coLeader!}); setShowMemberModal(true); }} className="p-2 border border-[#3c3c44] hover:bg-[#3c3c44] rounded-lg">
                        <Edit3 size={15}/>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Anggota Staf */}
              <div className="liquid-glass p-6 rounded-2xl border border-[#3c3c44] space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white">Anggota Staf ({currentDiv.members.length})</h3>
                  <button onClick={() => { setIsEditingLeader(null); setMemberIndex(null); setMemberForm({ name: '', role: 'Anggota Divisi', nim: '', imageUrl: '' }); setShowMemberModal(true); }} className="px-3 py-1.5 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1">
                    <Plus size={14}/> Tambah Anggota
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentDiv.members.map((m, idx) => (
                    <div key={idx} className="p-4 border border-[#3c3c44] rounded-xl flex items-center justify-between bg-[#19191d]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#3c3c44] bg-black">
                          {m.imageUrl ? <img src={m.imageUrl} alt="" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">IF</div>}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-white">{m.name}</h5>
                          <p className="text-xs opacity-70">{m.role}</p>
                          <span className="text-[10px] font-mono opacity-50">NIM: {m.nim || '-'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setIsEditingLeader(null); setMemberIndex(idx); setMemberForm({...m}); setShowMemberModal(true); }} className="p-1.5 hover:bg-[#3c3c44] rounded">
                          <Edit3 size={14}/>
                        </button>
                        <button onClick={async () => { if (confirm(`Hapus anggota ${m.name}?`)) await deleteMember(selectedDivSlug, idx); }} className="p-1.5 text-red-400 hover:bg-red-950/40 rounded">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROGRAM KERJA */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Program Kerja ({currentDiv.shortName})</h2>
                <button onClick={() => { setProgramIndex(null); setProgramForm({ title: '', description: '', period: '', status: 'Direncanakan' }); setShowProgramModal(true); }} className="px-4 py-2 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Plus size={15}/> Tambah Proker
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {currentDiv.programs.map((p, idx) => (
                  <div key={idx} className="liquid-glass p-6 rounded-2xl border border-[#3c3c44] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3c3c44] text-[#bebeca] border border-[#bebeca]/20">{p.status}</span>
                        <h4 className="font-bold text-base text-white mt-2">{p.title}</h4>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setProgramIndex(idx); setProgramForm({...p}); setShowProgramModal(true); }} className="p-2 border border-[#3c3c44] rounded-lg hover:bg-[#3c3c44]"><Edit3 size={14}/></button>
                        <button onClick={async () => { if (confirm(`Hapus proker "${p.title}"?`)) await deleteProgram(selectedDivSlug, idx); }} className="p-2 border border-[#3c3c44] rounded-lg text-red-400 hover:bg-red-950/40"><Trash2 size={14}/></button>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 leading-relaxed">{p.description}</p>
                    <div className="text-[11px] font-mono opacity-60 pt-2 border-t border-[#3c3c44]">Jadwal: {p.period || 'Coming Soon'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
{/* TAB 4: PANEL DOKUMENTASI MANDIRI */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Dokumentasi Kegiatan ({currentDiv.shortName})</h2>
                  <p className="text-xs opacity-60">Unggah foto kegiatan, rekap acara, dan tanggal pelaksanaan proker.</p>
                </div>
                {/* TOMBOL TAMBAH DOKUMENTASI */}
                <button
                  onClick={handleOpenAddDocModal}
                  className="px-4 py-2 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus size={15} /> Tambah Dokumentasi
                </button>
              </div>

              {/* DAFTAR DOKUMENTASI KEGIATAN */}
              {currentDiv.programs.filter((p) => p.documentation || p.status === 'Selesai').length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-3xl border border-dashed border-[#3c3c44] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#232329] border border-[#3c3c44] flex items-center justify-center mx-auto text-[#bebeca]">
                    <Camera size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-white">Belum Ada Dokumentasi Kegiatan</h4>
                  <p className="text-xs opacity-60 max-w-sm mx-auto">
                    Divisi ini belum memiliki dokumentasi foto kegiatan. Klik tombol <strong>Tambah Dokumentasi</strong> di atas untuk menambahkan.
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {currentDiv.programs.map((p, idx) => {
                    return (
                      <div key={idx} className="liquid-glass p-6 rounded-2xl border border-[#3c3c44] flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="text-[10px] font-mono text-[#bebeca] uppercase font-bold px-2 py-0.5 bg-[#232329] rounded border border-[#3c3c44]">
                                {p.documentation?.date || p.period || 'Tanggal -'}
                              </span>
                              <h4 className="font-bold text-base text-white mt-2 leading-snug">{p.title}</h4>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              {p.status}
                            </span>
                          </div>

                          <p className="text-xs opacity-75 mt-2 mb-4 leading-relaxed line-clamp-3">
                            {p.documentation?.summary || p.description}
                          </p>

                          {/* Galeri Thumbnail Foto */}
                          {p.documentation?.photoUrls && p.documentation.photoUrls.length > 0 ? (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {p.documentation.photoUrls.map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt=""
                                  className="w-16 h-16 object-cover rounded-xl border border-[#3c3c44] shrink-0"
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] opacity-40 italic block mb-2">Belum ada foto yang diunggah.</span>
                          )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="pt-4 border-t border-[#3c3c44] flex gap-2">
                          <button
                            onClick={() => handleOpenEditDocModal(idx)}
                            className="flex-1 py-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} /> Edit Dokumentasi &amp; Foto
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus dokumentasi untuk "${p.title}"?`)) {
                                await deleteProgram(selectedDivSlug, idx);
                              }
                            }}
                            className="p-2 border border-[#3c3c44] hover:bg-red-950/40 text-red-400 rounded-xl transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {/* TAB 5: PENGUMUMAN */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Kelola Pengumuman Resmi</h2>
                <button onClick={() => { setAnnForm({ title: '', content: '', poster_url: '', is_published: true }); setShowAnnModal(true); }} className="px-4 py-2 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Plus size={15}/> Buat Pengumuman
                </button>
              </div>

              <div className="space-y-4">
                {announcements.map((a) => (
                  <div key={a.id} className="liquid-glass p-5 rounded-2xl border border-[#3c3c44] flex justify-between items-center">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10'}`}>
                        {a.is_published ? 'Published' : 'Draft'}
                      </span>
                      <h4 className="font-bold text-base text-white mt-1">{a.title}</h4>
                      <p className="text-xs opacity-70 line-clamp-1">{a.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setAnnForm(a); setShowAnnModal(true); }} className="p-2 border border-[#3c3c44] rounded-lg hover:bg-[#3c3c44]"><Edit3 size={14}/></button>
                      <button onClick={async () => { if (confirm('Hapus pengumuman ini?')) await deleteAnnouncement(a.id); }} className="p-2 border border-[#3c3c44] rounded-lg text-red-400 hover:bg-red-950/40"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: KOMPETISI */}
          {activeTab === 'competitions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Kelola Informasi Kompetisi</h2>
                <button onClick={() => { setCompForm({ title: '', organizer: '', deadline: '', registration_link: '', status: 'Dibuka' }); setShowCompModal(true); }} className="px-4 py-2 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Plus size={15}/> Tambah Kompetisi
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {competitions.map((c) => (
                  <div key={c.id} className="liquid-glass p-5 rounded-2xl border border-[#3c3c44] flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-[#bebeca]">{c.organizer}</span>
                      <h4 className="font-bold text-base text-white mt-1">{c.title}</h4>
                      <p className="text-xs opacity-70 font-mono mt-2">Batas: {c.deadline}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => { setCompForm(c); setShowCompModal(true); }} className="p-2 border border-[#3c3c44] rounded-lg hover:bg-[#3c3c44]"><Edit3 size={14}/></button>
                      <button onClick={async () => { if (confirm('Hapus kompetisi ini?')) await deleteCompetition(c.id); }} className="p-2 border border-[#3c3c44] rounded-lg text-red-400 hover:bg-red-950/40"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: BLOG */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Kelola Blog &amp; Artikel Edukasi</h2>
                <button onClick={() => { setBlogForm({ title: '', excerpt: '', content: '', author: 'Admin HMIF', tags: ['Informatika'], is_published: true }); setShowBlogModal(true); }} className="px-4 py-2 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <Plus size={15}/> Tulis Artikel
                </button>
              </div>

              <div className="space-y-4">
                {blogs.map((b) => (
                  <div key={b.id} className="liquid-glass p-5 rounded-2xl border border-[#3c3c44] flex justify-between items-center">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.is_published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10'}`}>
                        {b.is_published ? 'Published' : 'Draft'}
                      </span>
                      <h4 className="font-bold text-base text-white mt-1">{b.title}</h4>
                      <p className="text-xs opacity-70">Penulis: {b.author}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setBlogForm(b); setShowBlogModal(true); }} className="p-2 border border-[#3c3c44] rounded-lg hover:bg-[#3c3c44]"><Edit3 size={14}/></button>
                      <button onClick={async () => { if (confirm('Hapus artikel ini?')) await deleteBlog(b.id); }} className="p-2 border border-[#3c3c44] rounded-lg text-red-400 hover:bg-red-950/40"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
{/* ========================================================
          MODAL FORM TAMBAH / EDIT DOKUMENTASI KEGIATAN
         ======================================================== */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {isNewDocActivity ? 'Tambah Dokumentasi Kegiatan Baru' : `Edit Dokumentasi: ${docForm.title}`}
              </h3>
              <p className="text-xs opacity-60">Divisi: {currentDiv.name}</p>
            </div>

            <form onSubmit={handleSaveDocumentation} className="space-y-4">
              
              {/* 1. LAGI KEGIATAN APA? */}
              <div>
                <label className="block text-xs font-mono mb-1 text-white font-bold">1. Lagi Kegiatan Apa? (Nama Kegiatan / Proker)</label>
                {/* Pilihan: Pilih dari proker yang ada atau tulis baru */}
                {!isNewDocActivity && (
                  <input
                    type="text"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white"
                    placeholder="Contoh: Informatics Social Care 2026"
                    required
                  />
                )}
                {isNewDocActivity && (
                  <div className="space-y-2">
                    {currentDiv.programs.length > 0 && (
                      <select
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '__NEW__') {
                            setDocSelectedProkerIdx(-1);
                            setDocForm({ ...docForm, title: '' });
                          } else {
                            const pIdx = Number(val);
                            setDocSelectedProkerIdx(pIdx);
                            const p = currentDiv.programs[pIdx];
                            setDocForm({
                              ...docForm,
                              title: p.title,
                              date: p.period || docForm.date,
                              summary: p.description || docForm.summary,
                            });
                          }
                        }}
                        className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white"
                      >
                        <option value="__NEW__">-- Tulis Nama Kegiatan Baru --</option>
                        {currentDiv.programs.map((p, i) => (
                          <option key={i} value={i}>
                            Pilih dari Proker: {p.title}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      value={docForm.title}
                      onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                      className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white"
                      placeholder="Masukkan nama kegiatan..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* 2. DI TANGGAL BERAPA? */}
              <div>
                <label className="block text-xs font-mono mb-1 text-white font-bold">2. Di Tanggal Berapa? (Waktu Pelaksanaan)</label>
                <input
                  type="text"
                  placeholder="Contoh: 15 November 2026 atau November 2026"
                  value={docForm.date}
                  onChange={(e) => setDocForm({ ...docForm, date: e.target.value })}
                  className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white"
                  required
                />
              </div>

              {/* 3. DESKRIPSI KEGIATAN */}
              <div>
                <label className="block text-xs font-mono mb-1 text-white font-bold">3. Deskripsi / Rekap Ringkas Kegiatan</label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan singkat bagaimana jalannya acara, pencapaian, dan antusiasme peserta..."
                  value={docForm.summary}
                  onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white"
                  required
                />
              </div>

              {/* 4. UPLOAD FOTO (LOKAL / URL) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-mono mb-1 text-white font-bold">4. Galeri Foto Dokumentasi (Upload File / URL)</label>
                
                {/* Grid Foto yang Sudah Ditambahkan */}
                {docForm.photoUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2 p-2 border border-[#3c3c44] rounded-xl bg-[#19191d]">
                    {docForm.photoUrls.map((url, i) => (
                      <div key={i} className="relative w-full h-16 rounded-lg overflow-hidden border border-[#3c3c44]">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setDocForm({ ...docForm, photoUrls: docForm.photoUrls.filter((_, idx) => idx !== i) })}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-700 cursor-pointer"
                          title="Hapus foto ini"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload dari Perangkat */}
                <label className="cursor-pointer w-full py-2.5 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2 transition-colors">
                  <Upload size={14} /> Pilih Foto dari Komputer / HP
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (base64) => setDocForm({ ...docForm, photoUrls: [...docForm.photoUrls, base64] }))}
                  />
                </label>

                {/* Atau Tambah via Link URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Atau tempel link URL foto (https://...)"
                    value={tempDocPhotoUrl}
                    onChange={(e) => setTempDocPhotoUrl(e.target.value)}
                    className="flex-1 border border-[#3c3c44] bg-[#19191d] p-2 rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempDocPhotoUrl.trim()) {
                        setDocForm({ ...docForm, photoUrls: [...docForm.photoUrls, tempDocPhotoUrl.trim()] });
                        setTempDocPhotoUrl('');
                      }
                    }}
                    className="px-3.5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl hover:bg-white cursor-pointer"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {/* Tombol Simpan */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white hover:bg-[#232329] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg hover:bg-white cursor-pointer"
                >
                  Simpan Dokumentasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL ANGGOTA DENGAN UPLOAD FOTO LOKAL & URL
         ======================================================== */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{isEditingLeader ? 'Edit Pimpinan Divisi' : memberIndex !== null ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (isEditingLeader === 'leader') await updateLeader(selectedDivSlug, memberForm);
              else if (isEditingLeader === 'coLeader') await updateCoLeader(selectedDivSlug, memberForm);
              else if (memberIndex !== null) await updateMember(selectedDivSlug, memberIndex, memberForm);
              else await addMember(selectedDivSlug, memberForm);
              setShowMemberModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Nama Lengkap</label>
                <input type="text" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Jabatan / Role</label>
                <input type="text" value={memberForm.role} onChange={(e) => setMemberForm({...memberForm, role: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">NIM Mahasiswa</label>
                <input type="text" value={memberForm.nim || ''} onChange={(e) => setMemberForm({...memberForm, nim: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" />
              </div>

              {/* Upload Foto Profil (Lokal & URL) */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-mono mb-1 text-white">Foto Profil (Upload File atau URL)</label>
                {memberForm.imageUrl && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#bebeca] mx-auto shadow-md">
                    <img src={memberForm.imageUrl} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setMemberForm({...memberForm, imageUrl: ''})} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"><X size={10}/></button>
                  </div>
                )}
                <label className="cursor-pointer w-full py-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2">
                  <Upload size={14} /> Pilih Foto dari Perangkat
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setMemberForm({...memberForm, imageUrl: base64}))} />
                </label>
                <input type="text" placeholder="Atau paste link URL foto..." value={memberForm.imageUrl || ''} onChange={(e) => setMemberForm({...memberForm, imageUrl: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2 rounded-xl text-xs text-white" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button type="button" onClick={() => setShowMemberModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FORM PROGRAM KERJA
         ======================================================== */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{programIndex !== null ? 'Edit Proker' : 'Tambah Proker'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (programIndex !== null) await updateProgram(selectedDivSlug, programIndex, programForm);
              else await addProgram(selectedDivSlug, programForm);
              setShowProgramModal(false);
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Nama Program Kerja</label>
                <input type="text" value={programForm.title} onChange={(e) => setProgramForm({...programForm, title: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Status Pelaksanaan</label>
                <select value={programForm.status} onChange={(e) => setProgramForm({...programForm, status: e.target.value as ProkerStatus})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white">
                  <option value="Direncanakan">Direncanakan</option>
                  <option value="Akan Datang">Akan Datang</option>
                  <option value="Berlangsung">Berlangsung</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Jadwal (Kosongkan jika Coming Soon)</label>
                <input type="text" placeholder="Contoh: 15 Oktober 2026 atau Coming Soon" value={programForm.period} onChange={(e) => setProgramForm({...programForm, period: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Deskripsi Lengkap Proker</label>
                <textarea rows={3} value={programForm.description} onChange={(e) => setProgramForm({...programForm, description: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button type="button" onClick={() => setShowProgramModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan Proker</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FORM PENGUMUMAN
         ======================================================== */}
      {showAnnModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{annForm.id ? 'Edit Pengumuman' : 'Buat Pengumuman'}</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await saveAnnouncement(annForm); setShowAnnModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Judul Pengumuman</label>
                <input type="text" value={annForm.title || ''} onChange={(e) => setAnnForm({...annForm, title: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Poster (Upload File atau URL)</label>
                <label className="cursor-pointer w-full py-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2 mb-2">
                  <Upload size={14} /> Upload Poster dari Perangkat
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setAnnForm({...annForm, poster_url: base64}))} />
                </label>
                <input type="text" placeholder="Atau paste link URL poster..." value={annForm.poster_url || ''} onChange={(e) => setAnnForm({...annForm, poster_url: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Isi Pengumuman</label>
                <textarea rows={5} value={annForm.content || ''} onChange={(e) => setAnnForm({...annForm, content: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={annForm.is_published} onChange={(e) => setAnnForm({...annForm, is_published: e.target.checked})} className="rounded cursor-pointer" />
                <label htmlFor="pub" className="text-xs cursor-pointer text-white">Publikasikan langsung (Uncheck untuk simpan sebagai Draft)</label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button type="button" onClick={() => setShowAnnModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FORM KOMPETISI
         ======================================================== */}
      {showCompModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{compForm.id ? 'Edit Kompetisi' : 'Tambah Kompetisi'}</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await saveCompetition(compForm); setShowCompModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Nama Lomba</label>
                <input type="text" value={compForm.title || ''} onChange={(e) => setCompForm({...compForm, title: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Penyelenggara</label>
                <input type="text" value={compForm.organizer || ''} onChange={(e) => setCompForm({...compForm, organizer: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Batas Akhir Pendaftaran</label>
                <input type="date" value={compForm.deadline || ''} onChange={(e) => setCompForm({...compForm, deadline: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Link Pendaftaran</label>
                <input type="url" value={compForm.registration_link || ''} onChange={(e) => setCompForm({...compForm, registration_link: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Poster Lomba (Upload File atau URL)</label>
                <label className="cursor-pointer w-full py-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2 mb-2">
                  <Upload size={14} /> Upload Poster dari Perangkat
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setCompForm({...compForm, poster_url: base64}))} />
                </label>
                <input type="text" placeholder="Atau paste link URL..." value={compForm.poster_url || ''} onChange={(e) => setCompForm({...compForm, poster_url: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2 rounded-xl text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button type="button" onClick={() => setShowCompModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL FORM BLOG
         ======================================================== */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#3c3c44] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">{blogForm.id ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h3>
            <form onSubmit={async (e) => { e.preventDefault(); await saveBlog(blogForm); setShowBlogModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Judul Artikel</label>
                <input type="text" value={blogForm.title || ''} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Penulis</label>
                <input type="text" value={blogForm.author || ''} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Ringkasan (Excerpt)</label>
                <textarea rows={2} value={blogForm.excerpt || ''} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Isi Artikel</label>
                <textarea rows={6} value={blogForm.content || ''} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" required />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Cover Artikel (Upload File atau URL)</label>
                <label className="cursor-pointer w-full py-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2 mb-2">
                  <Upload size={14} /> Upload Cover dari Perangkat
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setBlogForm({...blogForm, cover_url: base64}))} />
                </label>
                <input type="text" placeholder="Atau paste link URL cover..." value={blogForm.cover_url || ''} onChange={(e) => setBlogForm({...blogForm, cover_url: e.target.value})} className="w-full border border-[#3c3c44] bg-[#19191d] p-2 rounded-xl text-xs text-white" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pubB" checked={blogForm.is_published} onChange={(e) => setBlogForm({...blogForm, is_published: e.target.checked})} className="rounded cursor-pointer" />
                <label htmlFor="pubB" className="text-xs cursor-pointer text-white">Publikasikan langsung</label>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button type="button" onClick={() => setShowBlogModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button type="submit" className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL GANTI AKUN ADMIN
         ======================================================== */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#3c3c44]">
            <h3 className="text-lg font-bold text-white mb-4">Ganti Akun Administrator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Username Baru</label>
                <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-mono mb-1 text-white">Password Baru</label>
                <input type="text" placeholder="Masukkan password baru..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="password-mask w-full border border-[#3c3c44] bg-[#19191d] p-2.5 rounded-xl text-xs text-white" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-[#3c3c44]">
                <button onClick={() => setShowAccountModal(false)} className="px-4 py-2 border border-[#3c3c44] rounded-xl text-xs text-white">Batal</button>
                <button onClick={async () => { await changeCredentials(newUsername, newPassword); alert('Akun berhasil diperbarui!'); setShowAccountModal(false); }} className="px-5 py-2 bg-[#bebeca] text-[#121215] text-xs font-bold rounded-xl shadow-lg">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
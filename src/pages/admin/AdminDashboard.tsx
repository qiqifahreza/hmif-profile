import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  LogOut, Plus, Trash2, Edit3, ArrowLeft,
  Calendar, Layers, KeyRound, Palette, Bell, Trophy, BookOpen, Camera, Upload, X, Sun, Moon, Menu, ChevronDown
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Member, DivisionProker, ProkerStatus, Announcement, Competition, BlogPost, SiteSettings } from '../../types';
import { SearchBar } from '../../components/SearchBar';
import { Pagination } from '../../components/Pagination';

export const AdminDashboard: React.FC = () => {
  const { 
    divisions, announcements, competitions, blogs, settings,
    isAdmin, adminUsername, isDarkMode, toggleTheme, logout, changeCredentials, updateSettings,
    updateDivisionInfo,
    updateLeader, updateCoLeader, addMember, updateMember, deleteMember,
    addProgram, updateProgram, deleteProgram,
    saveAnnouncement, deleteAnnouncement,
    saveCompetition, deleteCompetition,
    saveBlog, deleteBlog
  } = useData();

  const navigate = useNavigate();

  // State Buka/Tutup Sidebar Panel
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Tab Menu Superpanel
  type TabType = 'settings' | 'divisions' | 'programs' | 'documentation' | 'announcements' | 'competitions' | 'blogs';
  const [activeTab, setActiveTab] = useState<TabType>('settings');

  // Divisipanel Selection
  const [selectedDivSlug, setSelectedDivSlug] = useState<string>(divisions[0]?.slug || 'kahim-wakahim');

  // Form Pengaturan Situs & Warna
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [newMissionItem, setNewMissionItem] = useState('');

  // SINKRONKAN FORM OTOMATIS SAAT DATA SUPABASE SELESAI DIUNDUH
  useEffect(() => {
    if (settings) {
      setSiteForm(settings);
    }
  }, [settings]);
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

  // State Modal Konfirmasi Hapus
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'program' | 'member';
    slug: string;
    index: number;
    title: string;
  } | null>(null);
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

  // State Modal Edit Informasi Divisi (Nama & Deskripsi)
  const [showDivInfoModal, setShowDivInfoModal] = useState(false);
  const [divInfoForm, setDivInfoForm] = useState({ name: '', shortName: '', about: '' });

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

  // 1. Set 5 item per halaman untuk admin
  const [adminSearch, setAdminSearch] = useState('');
  const [adminPage, setAdminPage] = useState(1);
  const adminItemsPerPage = 5;

  const handleSearchChange = (val: string) => {
    setAdminSearch(val);
    setAdminPage(1);
  };

  // Tutup panel otomatis di layar HP saat admin memilih menu
  // Tutup panel otomatis di layar HP saat admin memilih menu mandiri,
  // tetapi BIARKAN TERBUKA jika menu tersebut memiliki sub-menu (Divisi, Proker, Dokumentasi)
  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setAdminSearch('');
    setAdminPage(1);

    // Cek apakah menu ini memiliki cabang pilihan divisi
    const hasSubMenu = tab === 'divisions' || tab === 'programs' || tab === 'documentation';

    // Hanya tutup panel di HP jika menu TIDAK memiliki cabang pilihan divisi
    if (!hasSubMenu && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  // 2. Program Kerja (5 item)
  const filteredPrograms = currentDiv.programs.filter((p) =>
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(adminSearch.toLowerCase())
  );
  const totalProgPages = Math.ceil(filteredPrograms.length / adminItemsPerPage);
  const paginatedPrograms = filteredPrograms.slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage);

  // 3. Dokumentasi (5 item)
  const filteredDocs = currentDiv.programs.filter((p) =>
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    (p.documentation?.summary && p.documentation.summary.toLowerCase().includes(adminSearch.toLowerCase()))
  );
  const totalDocPages = Math.ceil(filteredDocs.length / adminItemsPerPage);
  const paginatedDocs = filteredDocs.slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage);

  // 4. Pengumuman (5 item)
  const filteredAnn = announcements.filter((a) =>
    a.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    a.content.toLowerCase().includes(adminSearch.toLowerCase())
  );
  const totalAnnPages = Math.ceil(filteredAnn.length / adminItemsPerPage);
  const paginatedAnn = filteredAnn.slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage);

  // 5. Kompetisi (5 item)
  const filteredComp = competitions.filter((c) =>
    c.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    c.organizer.toLowerCase().includes(adminSearch.toLowerCase())
  );
  const totalCompPages = Math.ceil(filteredComp.length / adminItemsPerPage);
  const paginatedComp = filteredComp.slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage);

  // 6. Blog & Edukasi (5 item)
  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(adminSearch.toLowerCase())
  );
  const totalBlogPages = Math.ceil(filteredBlogs.length / adminItemsPerPage);
  const paginatedBlogs = filteredBlogs.slice((adminPage - 1) * adminItemsPerPage, adminPage * adminItemsPerPage);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 dark:bg-[#121215] text-slate-800 dark:text-[#bebeca] transition-colors duration-300">
      
      {/* BACKDROP GELAP SAAT SIDEBAR DIBUKA DI HP */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden cursor-pointer"
        />
      )}

      {/* ========================================================
          SIDEBAR KIRI: TUNGGAL & BERSIH (RESPONSIF BISA DITUTUP)
         ======================================================== */}
      {/* ========================================================
          SIDEBAR KIRI: STRUKTUR TREE ACCORDION NAVIGASI
         ======================================================== */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-full min-h-screen border-r border-slate-200 dark:border-[#3c3c44] bg-white dark:bg-[#16161b] flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? 'w-72 p-5 translate-x-0 opacity-100 shadow-2xl lg:shadow-none'
            : '-translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:border-none lg:overflow-hidden opacity-0 pointer-events-none'
        }`}
      >
        <div className="space-y-6">
          
          {/* Header Sidebar: Logo & Tombol Tutup */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link to="/" className="text-xs text-slate-500 dark:text-[#bebeca]/60 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 transition-colors mb-2">
                <ArrowLeft size={13} /> Ke Website Publik
              </Link>
              <h1 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight leading-snug">HMIF CMS Panel</h1>
              <p className="text-[11px] font-mono text-slate-500 dark:text-[#bebeca]/60">Login: @{adminUsername}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#232329] hover:bg-slate-100 dark:hover:bg-[#3c3c44] shadow-sm transition-all cursor-pointer"
                title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              >
                {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-700" />}
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] text-slate-700 dark:text-[#bebeca] lg:hidden hover:bg-slate-100 dark:hover:bg-[#232329]"
                title="Tutup Panel"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ========================================================
              TREE MENU NAVIGASI (ACCORDION OTOMATIS)
             ======================================================== */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-[#bebeca]/50 block px-2 mb-2">
              Menu Navigasi
            </span>

            {/* 1. Pengaturan & Warna (Tanpa Tree) */}
            <button
              type="button"
              onClick={() => handleTabSwitch('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                  : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
              }`}
            >
              <Palette size={15} />
              <span>Pengaturan &amp; Warna</span>
            </button>

            {/* 2. Divisi & Anggota (Tree Dropdown Seluruh Divisi) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabSwitch('divisions')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'divisions'
                    ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                    : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers size={15} />
                  <span>Divisi &amp; Anggota</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeTab === 'divisions' ? 'rotate-0' : '-rotate-90 opacity-40'
                  }`}
                />
              </button>

              {/* Sub-menu Seluruh Divisi (Hanya Buka Saat Divisi & Anggota Aktif) */}
              {activeTab === 'divisions' && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-300 dark:border-[#3c3c44] ml-4 transition-all">
                  {divisions.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => {
                        setSelectedDivSlug(d.slug);
                        setAdminPage(1);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors truncate cursor-pointer flex items-center gap-1.5 ${
                        selectedDivSlug === d.slug
                          ? 'bg-slate-200 dark:bg-[#3c3c44] text-slate-950 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-[#bebeca]/70 hover:bg-slate-100 dark:hover:bg-[#232329]'
                      }`}
                      title={d.name}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      <span className="truncate">{d.shortName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Program Kerja (Tree Dropdown Seluruh Divisi) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabSwitch('programs')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'programs'
                    ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                    : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={15} />
                  <span>Program Kerja</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeTab === 'programs' ? 'rotate-0' : '-rotate-90 opacity-40'
                  }`}
                />
              </button>

              {/* Sub-menu Seluruh Divisi (Hanya Buka Saat Program Kerja Aktif) */}
              {activeTab === 'programs' && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-300 dark:border-[#3c3c44] ml-4 transition-all">
                  {divisions.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => {
                        setSelectedDivSlug(d.slug);
                        setAdminPage(1);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors truncate cursor-pointer flex items-center gap-1.5 ${
                        selectedDivSlug === d.slug
                          ? 'bg-slate-200 dark:bg-[#3c3c44] text-slate-950 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-[#bebeca]/70 hover:bg-slate-100 dark:hover:bg-[#232329]'
                      }`}
                      title={d.name}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      <span className="truncate">{d.shortName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Dokumentasi (Tree Dropdown Seluruh Divisi) */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabSwitch('documentation')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'documentation'
                    ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                    : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Camera size={15} />
                  <span>Dokumentasi</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    activeTab === 'documentation' ? 'rotate-0' : '-rotate-90 opacity-40'
                  }`}
                />
              </button>

              {/* Sub-menu Seluruh Divisi (Hanya Buka Saat Dokumentasi Aktif) */}
              {activeTab === 'documentation' && (
                <div className="pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-300 dark:border-[#3c3c44] ml-4 transition-all">
                  {divisions.map((d) => (
                    <button
                      key={d.slug}
                      type="button"
                      onClick={() => {
                        setSelectedDivSlug(d.slug);
                        setAdminPage(1);
                        if (window.innerWidth < 1024) setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-colors truncate cursor-pointer flex items-center gap-1.5 ${
                        selectedDivSlug === d.slug
                          ? 'bg-slate-200 dark:bg-[#3c3c44] text-slate-950 dark:text-white font-bold'
                          : 'text-slate-600 dark:text-[#bebeca]/70 hover:bg-slate-100 dark:hover:bg-[#232329]'
                      }`}
                      title={d.name}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                      <span className="truncate">{d.shortName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Pengumuman */}
            <button
              type="button"
              onClick={() => handleTabSwitch('announcements')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'announcements'
                  ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                  : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
              }`}
            >
              <Bell size={15} />
              <span>Pengumuman</span>
            </button>

            {/* 6. Kompetisi */}
            <button
              type="button"
              onClick={() => handleTabSwitch('competitions')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'competitions'
                  ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                  : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
              }`}
            >
              <Trophy size={15} />
              <span>Kompetisi</span>
            </button>

            {/* 7. Blog & Edukasi */}
            <button
              type="button"
              onClick={() => handleTabSwitch('blogs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'blogs'
                  ? 'bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] shadow-md font-bold'
                  : 'text-slate-700 dark:text-[#bebeca] hover:bg-slate-200 dark:hover:bg-[#232329]'
              }`}
            >
              <BookOpen size={15} />
              <span>Blog &amp; Edukasi</span>
            </button>

          </div>

        </div>

        {/* Footer Sidebar: Ganti Akun & Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-[#3c3c44] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setShowAccountModal(true)}
            className="flex-1 py-2 px-2.5 rounded-xl border border-slate-300 dark:border-[#3c3c44] hover:border-slate-500 dark:hover:border-[#bebeca] text-[11px] font-semibold text-slate-700 dark:text-[#bebeca] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <KeyRound size={13} /> Akun
          </button>
          <button
            type="button"
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-600 dark:text-red-300 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <LogOut size={13} /> Keluar
          </button>
        </div>
      </aside>

      {/* ========================================================
          KONTEN UTAMA KANAN (DENGAN TOMBOL HAMBURGER DI ATASNYA)
         ======================================================== */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto bg-slate-100/70 dark:bg-transparent">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* BARIS TOMBOL HAMBURGER TOGGLE PANEL */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-300/80 dark:border-[#3c3c44]">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#16161b] hover:bg-slate-100 dark:hover:bg-[#232329] text-slate-800 dark:text-white shadow-sm transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={isSidebarOpen ? "Tutup Panel" : "Buka Panel"}
              aria-label={isSidebarOpen ? "Tutup Panel" : "Buka Panel"}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <span className="text-xs font-mono text-slate-500 dark:text-[#bebeca]/60">
              {settings.cabinet_name} • {settings.period}
            </span>
          </div>

          {/* TAB 1: PENGATURAN TEKS, WARNA, LOGO, DAN MISI */}
          {activeTab === 'settings' && (
            <div className="liquid-glass rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#3c3c44] shadow-sm dark:shadow-2xl space-y-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kustomisasi Tampilan &amp; Konten Website</h2>
              
              <form onSubmit={async (e) => { e.preventDefault(); await updateSettings(siteForm); alert('Pengaturan tersimpan ke Supabase!'); }} className="space-y-6">
                
                {/* 1. Palet Warna */}
                <div className="space-y-3 p-5 rounded-2xl border border-slate-200 dark:border-[#3c3c44] bg-white/70 dark:bg-[#16161b]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-white">Palet Warna Tema</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-600 dark:text-slate-300">Primary (Dark Mode)</label>
                      <input type="color" value={siteForm.primary_color_dark} onChange={(e) => setSiteForm({...siteForm, primary_color_dark: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-600 dark:text-slate-300">Secondary (Dark Mode)</label>
                      <input type="color" value={siteForm.secondary_color_dark} onChange={(e) => setSiteForm({...siteForm, secondary_color_dark: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-600 dark:text-slate-300">Primary (Light Mode)</label>
                      <input type="color" value={siteForm.primary_color_light} onChange={(e) => setSiteForm({...siteForm, primary_color_light: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-[#3c3c44]" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1 text-slate-600 dark:text-slate-300">Secondary (Light Mode)</label>
                      <input type="color" value={siteForm.secondary_color_light} onChange={(e) => setSiteForm({...siteForm, secondary_color_light: e.target.value})} className="w-full h-10 rounded-lg cursor-pointer bg-transparent border border-slate-200 dark:border-[#3c3c44]" />
                    </div>
                  </div>
                </div>
{/* 2. Upload Logo (Dibuat Responsif Flex-Wrap untuk Layar HP) */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#3c3c44] bg-white/70 dark:bg-[#16161b] space-y-3">
                  <label className="block text-xs font-mono font-bold text-slate-800 dark:text-white">Pengaturan Logo</label>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    {siteForm.logo_url && (
                      <div className="relative w-14 h-14 shrink-0">
                        {/* Lingkaran Logo */}
                        <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-300 dark:border-[#bebeca] bg-slate-100 dark:bg-black p-1 shadow-sm">
                          <img src={siteForm.logo_url} alt="Logo" className="w-full h-full object-contain rounded-full" />
                        </div>
                        {/* Tombol Silang */}
                        <button type="button" onClick={() => setSiteForm({...siteForm, logo_url: ''})} className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#16161b] shadow-md transition-transform hover:scale-110 cursor-pointer z-10">
                          <X size={10}/>
                        </button>
                      </div>
                    )}
                    <label className="cursor-pointer px-4 py-2 bg-slate-100 dark:bg-[#232329] hover:bg-slate-200 dark:hover:bg-[#3c3c44] border border-slate-300 dark:border-[#3c3c44] rounded-xl text-xs text-slate-800 dark:text-white flex items-center gap-2 transition-colors">
                      <Upload size={14} /> Pilih Logo dari Perangkat
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (base64) => setSiteForm({...siteForm, logo_url: base64}))} />
                    </label>
                  </div>
                  <input type="text" placeholder="Atau masukkan tautan URL Logo (https://...)" value={siteForm.logo_url} onChange={(e) => setSiteForm({...siteForm, logo_url: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>
                {/* 3. Teks Identitas */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Nama Organisasi</label>
                    <input type="text" value={siteForm.org_name} onChange={(e) => setSiteForm({...siteForm, org_name: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Nama Kabinet</label>
                    <input type="text" value={siteForm.cabinet_name} onChange={(e) => setSiteForm({...siteForm, cabinet_name: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Judul Beranda (Hero Title)</label>
                  <input type="text" value={siteForm.hero_title} onChange={(e) => setSiteForm({...siteForm, hero_title: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Deskripsi Beranda (Hero Subtitle)</label>
                  <textarea rows={2} value={siteForm.hero_subtitle} onChange={(e) => setSiteForm({...siteForm, hero_subtitle: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-slate-300">Visi Organisasi</label>
                  <textarea rows={2} value={siteForm.vision} onChange={(e) => setSiteForm({...siteForm, vision: e.target.value})} className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none" />
                </div>

                {/* 4. Butir-Butir Misi */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-[#3c3c44] bg-white/70 dark:bg-[#16161b] space-y-3">
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
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
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
                      className="px-3.5 py-2 bg-slate-900 dark:bg-[#bebeca] text-white dark:text-[#121215] text-xs font-bold rounded-xl cursor-pointer"
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
              
              {/* KOTAK INFORMASI NAMA & DESKRIPSI DIVISI */}
              <div className="liquid-glass p-6 rounded-2xl border border-slate-300 dark:border-[#3c3c44] space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-slate-200 dark:bg-primary/40 text-slate-800 dark:text-secondary border border-slate-300 dark:border-secondary/25 px-2.5 py-0.5 rounded-full font-bold">
                      {currentDiv.shortName}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 leading-snug">{currentDiv.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 mt-1.5 leading-relaxed font-normal">{currentDiv.about}</p>
                  </div>
                  
                  {/* Tombol Edit Info Divisi */}
                  <button
                    type="button"
                    onClick={() => {
                      setDivInfoForm({
                        name: currentDiv.name,
                        shortName: currentDiv.shortName,
                        about: currentDiv.about,
                      });
                      setShowDivInfoModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#232329] border border-slate-300 dark:border-[#3c3c44] hover:bg-slate-100 dark:hover:bg-[#3c3c44] text-xs font-semibold text-slate-800 dark:text-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-sm"
                  >
                    <Edit3 size={14} /> Edit Info Divisi
                  </button>
                </div>
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
                        <button 
                          type="button"
                          onClick={() => setDeleteTarget({ 
                            type: 'member', 
                            slug: selectedDivSlug, 
                            index: idx, 
                            title: m.name 
                          })} 
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded cursor-pointer transition-colors"
                          title="Hapus Anggota"
                        >
                          <Trash2 size={14} />
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Program Kerja ({currentDiv.shortName})</h2>
                <button
                  type="button"
                  onClick={() => {
                    setProgramIndex(null);
                    setProgramForm({ title: '', description: '', period: '', status: 'Direncanakan' });
                    setShowProgramModal(true);
                  }}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <Plus size={15}/> Tambah Proker
                </button>
              </div>

              {/* SEARCHBAR PROKER */}
              <SearchBar
                value={adminSearch}
                onChange={handleSearchChange}
                placeholder="Cari program kerja divisi ini..."
              />

              {paginatedPrograms.length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-[#3c3c44] text-xs opacity-70">
                  {adminSearch ? `Tidak ada proker dengan kata kunci "${adminSearch}".` : 'Belum ada program kerja di divisi ini.'}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {paginatedPrograms.map((p, idx) => (
                    <div key={idx} className="liquid-glass p-6 rounded-2xl border border-slate-300 dark:border-[#3c3c44] space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-[#3c3c44] text-slate-800 dark:text-[#bebeca] border border-slate-300 dark:border-[#bebeca]/20">
                            {p.status}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white mt-2">{p.title}</h4>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setProgramIndex(idx);
                              setProgramForm({...p});
                              setShowProgramModal(true);
                            }}
                            className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg hover:bg-slate-200 dark:hover:bg-[#3c3c44] text-slate-700 dark:text-[#bebeca] cursor-pointer"
                            title="Edit Proker"
                          >
                            <Edit3 size={14}/>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget({ type: 'program', slug: selectedDivSlug, index: idx, title: p.title })}
                            className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                            title="Hapus Proker"
                          >
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 leading-relaxed">{p.description}</p>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-[#bebeca]/60 pt-2 border-t border-slate-200 dark:border-[#3c3c44]">
                        Jadwal: {p.period || 'Coming Soon'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION PROKER */}
              <Pagination currentPage={adminPage} totalPages={totalProgPages} onPageChange={setAdminPage} />
            </div>
          )}

          {/* TAB 4: PANEL DOKUMENTASI MANDIRI */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dokumentasi Kegiatan ({currentDiv.shortName})</h2>
                  <p className="text-xs opacity-60">Unggah foto kegiatan, rekap acara, dan tanggal pelaksanaan proker.</p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddDocModal}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <Plus size={15} /> Tambah Dokumentasi
                </button>
              </div>

              {/* SEARCHBAR DOKUMENTASI */}
              <SearchBar
                value={adminSearch}
                onChange={handleSearchChange}
                placeholder="Cari dokumentasi kegiatan..."
              />

              {paginatedDocs.length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-3xl border border-dashed border-[#3c3c44] space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#232329] border border-[#3c3c44] flex items-center justify-center mx-auto text-[#bebeca]">
                    <Camera size={22} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Belum Ada Dokumentasi Kegiatan</h4>
                  <p className="text-xs opacity-60 max-w-sm mx-auto">
                    {adminSearch ? `Tidak ditemukan dokumentasi dengan kata kunci "${adminSearch}".` : 'Klik tombol Tambah Dokumentasi di atas untuk mulai mendokumentasikan kegiatan.'}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {paginatedDocs.map((p, idx) => (
                    <div key={idx} className="liquid-glass p-6 rounded-2xl border border-slate-300 dark:border-[#3c3c44] flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-700 dark:text-[#bebeca] uppercase font-bold px-2 py-0.5 bg-slate-200 dark:bg-[#232329] rounded border border-slate-300 dark:border-[#3c3c44]">
                              {p.documentation?.date || p.period || 'Tanggal -'}
                            </span>
                            <h4 className="font-bold text-base text-slate-900 dark:text-white mt-2 leading-snug">{p.title}</h4>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500">
                            {p.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 mt-2 mb-4 leading-relaxed line-clamp-3">
                          {p.documentation?.summary || p.description}
                        </p>

                        {p.documentation?.photoUrls && p.documentation.photoUrls.length > 0 ? (
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {p.documentation.photoUrls.map((url, i) => (
                              <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-xl border border-slate-300 dark:border-[#3c3c44] shrink-0" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] opacity-40 italic block mb-2">Belum ada foto yang diunggah.</span>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-[#3c3c44] flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditDocModal(idx)}
                          className="flex-1 py-2 bg-slate-100 dark:bg-[#232329] hover:bg-slate-200 dark:hover:bg-[#3c3c44] border border-slate-300 dark:border-[#3c3c44] rounded-xl text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} /> Edit Dokumentasi
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget({ type: 'program', slug: selectedDivSlug, index: idx, title: p.title })}
                          className="p-2 border border-slate-300 dark:border-[#3c3c44] hover:bg-red-500/10 text-red-500 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Dokumentasi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION DOKUMENTASI */}
              <Pagination currentPage={adminPage} totalPages={totalDocPages} onPageChange={setAdminPage} />
            </div>
          )}

          {/* TAB 5: PENGUMUMAN */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola Pengumuman Resmi</h2>
                <button
                  type="button"
                  onClick={() => { setAnnForm({ title: '', content: '', poster_url: '', is_published: true }); setShowAnnModal(true); }}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <Plus size={15}/> Buat Pengumuman
                </button>
              </div>

              {/* SEARCHBAR PENGUMUMAN */}
              <SearchBar
                value={adminSearch}
                onChange={handleSearchChange}
                placeholder="Cari judul atau isi pengumuman..."
              />

              {paginatedAnn.length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-[#3c3c44] text-xs opacity-70">
                  {adminSearch ? `Tidak ada pengumuman dengan kata kunci "${adminSearch}".` : 'Belum ada pengumuman yang dibuat.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedAnn.map((a) => (
                    <div key={a.id} className="liquid-glass p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] flex justify-between items-center">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${a.is_published ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/15 text-slate-500'}`}>
                          {a.is_published ? 'Published' : 'Draft'}
                        </span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">{a.title}</h4>
                        <p className="text-xs text-slate-600 dark:text-[#bebeca]/70 line-clamp-1">{a.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setAnnForm(a); setShowAnnModal(true); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg hover:bg-slate-200 dark:hover:bg-[#3c3c44] cursor-pointer"><Edit3 size={14}/></button>
                        <button type="button" onClick={async () => { if (confirm('Hapus pengumuman ini?')) await deleteAnnouncement(a.id); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION PENGUMUMAN */}
              <Pagination currentPage={adminPage} totalPages={totalAnnPages} onPageChange={setAdminPage} />
            </div>
          )}

          {/* TAB 6: KOMPETISI */}
          {activeTab === 'competitions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola Informasi Kompetisi</h2>
                <button
                  type="button"
                  onClick={() => { setCompForm({ title: '', organizer: '', deadline: '', registration_link: '', status: 'Dibuka' }); setShowCompModal(true); }}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <Plus size={15}/> Tambah Kompetisi
                </button>
              </div>

              {/* SEARCHBAR KOMPETISI */}
              <SearchBar
                value={adminSearch}
                onChange={handleSearchChange}
                placeholder="Cari kompetisi atau penyelenggara..."
              />

              {paginatedComp.length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-[#3c3c44] text-xs opacity-70">
                  {adminSearch ? `Tidak ada kompetisi dengan kata kunci "${adminSearch}".` : 'Belum ada data kompetisi.'}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {paginatedComp.map((c) => (
                    <div key={c.id} className="liquid-glass p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-slate-600 dark:text-[#bebeca]">{c.organizer}</span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">{c.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-[#bebeca]/70 font-mono mt-2">Batas: {c.deadline}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button type="button" onClick={() => { setCompForm(c); setShowCompModal(true); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg hover:bg-slate-200 dark:hover:bg-[#3c3c44] cursor-pointer"><Edit3 size={14}/></button>
                        <button type="button" onClick={async () => { if (confirm('Hapus kompetisi ini?')) await deleteCompetition(c.id); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION KOMPETISI */}
              <Pagination currentPage={adminPage} totalPages={totalCompPages} onPageChange={setAdminPage} />
            </div>
          )}

          {/* TAB 7: BLOG */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kelola Blog &amp; Artikel Edukasi</h2>
                <button
                  type="button"
                  onClick={() => { setBlogForm({ title: '', excerpt: '', content: '', author: 'Admin HMIF', tags: ['Informatika'], is_published: true }); setShowBlogModal(true); }}
                  className="px-4 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer hover:opacity-90"
                >
                  <Plus size={15}/> Tulis Artikel
                </button>
              </div>

              {/* SEARCHBAR BLOG */}
              <SearchBar
                value={adminSearch}
                onChange={handleSearchChange}
                placeholder="Cari artikel atau penulis..."
              />

              {paginatedBlogs.length === 0 ? (
                <div className="p-12 text-center liquid-glass rounded-2xl border border-slate-300 dark:border-[#3c3c44] text-xs opacity-70">
                  {adminSearch ? `Tidak ada artikel dengan kata kunci "${adminSearch}".` : 'Belum ada artikel yang dibuat.'}
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedBlogs.map((b) => (
                    <div key={b.id} className="liquid-glass p-5 rounded-2xl border border-slate-300 dark:border-[#3c3c44] flex justify-between items-center">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.is_published ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/15 text-slate-500'}`}>
                          {b.is_published ? 'Published' : 'Draft'}
                        </span>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">{b.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-[#bebeca]/70">Penulis: {b.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => { setBlogForm(b); setShowBlogModal(true); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg hover:bg-slate-200 dark:hover:bg-[#3c3c44] cursor-pointer"><Edit3 size={14}/></button>
                        <button type="button" onClick={async () => { if (confirm('Hapus artikel ini?')) await deleteBlog(b.id); }} className="p-2 border border-slate-300 dark:border-[#3c3c44] rounded-lg text-red-500 hover:bg-red-500/10 cursor-pointer"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PAGINATION BLOG */}
              <Pagination currentPage={adminPage} totalPages={totalBlogPages} onPageChange={setAdminPage} />
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          MODAL FORM EDIT INFORMASI DIVISI (NAMA & DESKRIPSI)
         ======================================================== */}
      {showDivInfoModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-300 dark:border-[#3c3c44] space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Informasi Divisi</h3>
            <p className="text-xs text-slate-500 dark:text-[#bebeca]/70">Ubah nama resmi, singkatan (badge), dan deskripsi divisi ini.</p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateDivisionInfo(selectedDivSlug, divInfoForm);
                setShowDivInfoModal(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-white font-bold">Nama Lengkap Divisi</label>
                <input
                  type="text"
                  value={divInfoForm.name}
                  onChange={(e) => setDivInfoForm({ ...divInfoForm, name: e.target.value })}
                  placeholder="Contoh: Riset & Teknologi"
                  className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-white font-bold">Nama Singkat / Badge</label>
                <input
                  type="text"
                  value={divInfoForm.shortName}
                  onChange={(e) => setDivInfoForm({ ...divInfoForm, shortName: e.target.value })}
                  placeholder="Contoh: Ristek"
                  className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono mb-1 text-slate-700 dark:text-white font-bold">Deskripsi / Tentang Divisi</label>
                <textarea
                  rows={4}
                  value={divInfoForm.about}
                  onChange={(e) => setDivInfoForm({ ...divInfoForm, about: e.target.value })}
                  placeholder="Jelaskan peran dan fokus utama divisi ini..."
                  className="w-full border border-slate-300 dark:border-[#3c3c44] bg-white dark:bg-[#19191d] p-2.5 rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-[#3c3c44]">
                <button
                  type="button"
                  onClick={() => setShowDivInfoModal(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-[#3c3c44] rounded-xl text-xs text-slate-700 dark:text-[#bebeca] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white dark:bg-[#bebeca] dark:text-[#121215] text-xs font-bold rounded-xl shadow-lg cursor-pointer hover:opacity-90"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              <div>
                <label className="block text-xs font-mono mb-1 text-white font-bold">1. Lagi Kegiatan Apa? (Nama Kegiatan / Proker)</label>
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

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-mono mb-1 text-white font-bold">4. Galeri Foto Dokumentasi (Upload File / URL)</label>
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

                <label className="cursor-pointer w-full py-2.5 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] rounded-xl text-xs text-white flex items-center justify-center gap-2 transition-colors">
                  <Upload size={14} /> Pilih Foto dari Komputer / HP
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (base64) => setDocForm({ ...docForm, photoUrls: [...docForm.photoUrls, base64] }))}
                  />
                </label>

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

              <div className="space-y-2 pt-1">
                <label className="block text-xs font-mono mb-1 text-white">Foto Profil (Upload File atau URL)</label>
                {/* PREVIEW FOTO DENGAN TOMBOL SILANG DI LUAR LINGKARAN */}
                {memberForm.imageUrl && (
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    {/* Lingkaran Foto yang Terpotong Rapi */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-400 dark:border-[#bebeca] shadow-md bg-slate-100 dark:bg-[#19191d]">
                      <img
                        src={memberForm.imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Tombol Silang Merah Melayang di Luar Tepi Lingkaran */}
                    <button
                      type="button"
                      onClick={() => setMemberForm({ ...memberForm, imageUrl: '' })}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-[#19191d] shadow-lg transition-transform hover:scale-110 cursor-pointer z-10"
                      title="Hapus foto"
                    >
                      <X size={12} />
                    </button>
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

      {/* ========================================================
          MODAL KONFIRMASI HAPUS
         ======================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-2xl p-6 max-w-sm w-full border border-red-500/40 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
              <Trash2 size={22} />
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Konfirmasi Hapus</h3>
            
            <p className="text-xs text-slate-600 dark:text-[#bebeca]/80 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-950 dark:text-white">&ldquo;{deleteTarget.title}&rdquo;</strong>?
              <br />Tindakan ini akan menghapus data dari Supabase.
            </p>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-[#3c3c44] text-xs font-semibold hover:bg-slate-200 dark:hover:bg-[#232329] transition-colors cursor-pointer text-slate-700 dark:text-[#bebeca]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteTarget.type === 'program') {
                    await deleteProgram(deleteTarget.slug, deleteTarget.index);
                  } else {
                    await deleteMember(deleteTarget.slug, deleteTarget.index);
                  }
                  setDeleteTarget(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
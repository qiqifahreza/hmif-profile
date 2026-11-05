import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { 
  LogOut, Plus, Trash2, Edit3, ArrowLeft,
  UserPlus, Calendar, Layers, KeyRound, Upload, Image as ImageIcon, X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Member, DivisionProker } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { 
    divisions, isAdmin, adminUsername, logout, changeCredentials,
    addMember, updateMember, deleteMember,
    updateLeader, updateCoLeader,
    addProgram, updateProgram, deleteProgram
  } = useData();

  const navigate = useNavigate();
  const [selectedSlug, setSelectedSlug] = useState<string>(divisions[0]?.slug || 'kahim-wakahim');

  // Modal State untuk Anggota
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberIndex, setMemberIndex] = useState<number | null>(null);
  const [memberForm, setMemberForm] = useState<Member>({ name: '', role: '', nim: '', imageUrl: '' });
  const [isEditingLeader, setIsEditingLeader] = useState<'leader' | 'coLeader' | null>(null);

  // Modal State untuk Program Kerja
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [programIndex, setProgramIndex] = useState<number | null>(null);
  const [programForm, setProgramForm] = useState<DivisionProker>({ title: '', description: '', period: '' });

  // Modal State untuk Ganti Akun Admin
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [accountSuccessMsg, setAccountSuccessMsg] = useState('');

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentDiv = divisions.find((d) => d.slug === selectedSlug) || divisions[0];

  // Handler Upload File Gambar Lokal
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB agar penyimpanan browser lancar.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setMemberForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simpan data Anggota / Leader
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingLeader === 'leader') {
      updateLeader(selectedSlug, memberForm);
    } else if (isEditingLeader === 'coLeader') {
      updateCoLeader(selectedSlug, memberForm);
    } else if (memberIndex !== null) {
      updateMember(selectedSlug, memberIndex, memberForm);
    } else {
      addMember(selectedSlug, memberForm);
    }
    setShowMemberModal(false);
  };

  // Simpan data Program Kerja
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (programIndex !== null) {
      updateProgram(selectedSlug, programIndex, programForm);
    } else {
      addProgram(selectedSlug, programForm);
    }
    setShowProgramModal(false);
  };
  
// ✅ Tambahkan "async" dan "await" pada changeCredentials
const handleSaveAccount = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newUsername.trim() || !newPassword) {
    alert('Username dan password tidak boleh kosong!');
    return;
  }
  await changeCredentials(newUsername, newPassword); // <-- Tambahkan await
  setAccountSuccessMsg('Akun berhasil diperbarui!');
  setTimeout(() => {
    setShowAccountModal(false);
    setAccountSuccessMsg('');
  }, 1200);
};

  return (
    <div className="min-h-screen bg-dark text-secondary pt-10 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-primary">
          <div>
            <div className="flex items-center gap-3">
              <Link to="/" className="text-xs text-secondary/60 hover:text-white flex items-center gap-1">
                <ArrowLeft size={14} /> Beranda Publik
              </Link>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-2">
              Database Administrator Panel
            </h1>
            <p className="text-xs text-secondary/70">
              Masuk sebagai: <span className="text-white font-mono font-bold">@{adminUsername}</span> • Kabinet Samvaya
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Tombol Ganti Username & Password */}
            <button
              onClick={() => {
                setNewUsername(adminUsername);
                setNewPassword('');
                setAccountSuccessMsg('');
                setShowAccountModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#232329] border border-primary hover:border-secondary text-xs font-medium text-secondary hover:text-white transition-colors flex items-center gap-1.5"
            >
              <KeyRound size={14} /> Ganti Akun
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold transition-colors flex items-center gap-2"
            >
              <LogOut size={14} /> Keluar
            </button>
          </div>
        </div>

        {/* Tab Pemilihan Divisi */}
        <div className="mb-8 overflow-x-auto pb-2 flex gap-2 items-center">
          <div className="flex gap-2 min-w-max">
            {divisions.map((d) => (
              <button
                key={d.slug}
                onClick={() => setSelectedSlug(d.slug)}
                className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSlug === d.slug
                    ? 'bg-secondary text-dark shadow-lg'
                    : 'bg-[#232329] text-secondary border border-primary hover:border-secondary/40'
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {/* BAGIAN 1: PIMPINAN DIVISI */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
            <Layers size={18} className="text-secondary" />
            Pimpinan Divisi ({currentDiv.shortName})
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Leader Card */}
            <div className="liquid-glass-card p-5 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[#19191d] border border-primary flex items-center justify-center shrink-0">
                  {currentDiv.leader.imageUrl ? (
                    <img src={currentDiv.leader.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-secondary/40" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase bg-[#3c3c44] text-[#bebeca] px-2 py-0.5 rounded">
                    {currentDiv.leader.role}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">{currentDiv.leader.name}</h4>
                  <p className="text-xs text-[#bebeca]/70">NIM: {currentDiv.leader.nim || '-'}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditingLeader('leader');
                  setMemberIndex(null);
                  setMemberForm({ ...currentDiv.leader });
                  setShowMemberModal(true);
                }}
                className="p-2.5 bg-[#3c3c44] hover:bg-[#bebeca] hover:text-[#121215] rounded-xl text-[#bebeca] transition-all"
                title="Edit Pimpinan"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {/* Co-Leader */}
            {currentDiv.coLeader && (
              <div className="liquid-glass-card p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-[#19191d] border border-[#3c3c44] flex items-center justify-center shrink-0">
                    {currentDiv.coLeader.imageUrl ? (
                      <img src={currentDiv.coLeader.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-[#bebeca]/40" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-[#3c3c44] text-[#bebeca] px-2 py-0.5 rounded">
                      {currentDiv.coLeader.role}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{currentDiv.coLeader.name}</h4>
                    <p className="text-xs text-[#bebeca]/70">NIM: {currentDiv.coLeader.nim || '-'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditingLeader('coLeader');
                    setMemberIndex(null);
                    setMemberForm({ ...currentDiv.coLeader! });
                    setShowMemberModal(true);
                  }}
                  className="p-2.5 bg-[#3c3c44] hover:bg-[#bebeca] hover:text-[#121215] rounded-xl text-[#bebeca] transition-all"
                  title="Edit Wakil"
                >
                  <Edit3 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BAGIAN 2: DAFTAR ANGGOTA STAF */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserPlus size={18} className="text-[#bebeca]" />
              Anggota Staf ({currentDiv.members.length})
            </h3>
            <button
              onClick={() => {
                setIsEditingLeader(null);
                setMemberIndex(null);
                setMemberForm({ name: '', role: 'Anggota Divisi', nim: '', imageUrl: '' });
                setShowMemberModal(true);
              }}
              className="px-3.5 py-1.5 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus size={15} /> Tambah Anggota
            </button>
          </div>

          {currentDiv.members.length === 0 ? (
            <div className="p-8 text-center bg-[#19191d] border border-dashed border-[#3c3c44] rounded-2xl text-xs text-[#bebeca]/60">
              Belum ada anggota staf di divisi ini. Klik tombol tambah di atas.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDiv.members.map((m, idx) => (
                <div key={idx} className="liquid-glass-card p-4 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#19191d] border border-[#3c3c44] flex items-center justify-center shrink-0">
                      {m.imageUrl ? (
                        <img src={m.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={16} className="text-[#bebeca]/40" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{m.name}</h5>
                      <p className="text-xs text-[#bebeca]/80">{m.role}</p>
                      <p className="text-[11px] font-mono text-[#bebeca]/50">NIM: {m.nim || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setIsEditingLeader(null);
                        setMemberIndex(idx);
                        setMemberForm({ ...m });
                        setShowMemberModal(true);
                      }}
                      className="p-2 hover:bg-[#3c3c44] text-[#bebeca] rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus anggota ${m.name}?`)) {
                          deleteMember(selectedSlug, idx);
                        }
                      }}
                      className="p-2 hover:bg-red-950 text-red-400 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BAGIAN 3: PROGRAM KERJA DIVISI */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-[#bebeca]" />
              Program Kerja Divisi
            </h3>
            <button
              onClick={() => {
                setProgramIndex(null);
                setProgramForm({ title: '', description: '', period: '' });
                setShowProgramModal(true);
              }}
              className="px-3.5 py-1.5 bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              <Plus size={15} /> Tambah Proker
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {currentDiv.programs.map((p, idx) => (
              <div key={idx} className="liquid-glass-card p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-base">{p.title}</h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setProgramIndex(idx);
                          setProgramForm({ ...p });
                          setShowProgramModal(true);
                        }}
                        className="p-1.5 hover:bg-[#3c3c44] text-[#bebeca] rounded-lg"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus proker "${p.title}"?`)) {
                            deleteProgram(selectedSlug, idx);
                          }
                        }}
                        className="p-1.5 hover:bg-red-950 text-red-400 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#bebeca]/80 mb-4">{p.description}</p>
                </div>
                <div className="text-[11px] font-mono text-[#bebeca]/60 pt-3 border-t border-[#3c3c44]">
                  Jadwal: {p.period}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL ANGGOTA DENGAN UPLOAD FOTO LOKAL */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-4">
              {isEditingLeader ? 'Edit Pimpinan Divisi' : memberIndex !== null ? 'Edit Data Anggota' : 'Tambah Anggota Baru'}
            </h3>
            <form onSubmit={handleSaveMember} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Jabatan / Role</label>
                <input
                  type="text"
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">NIM Mahasiswa</label>
                <input
                  type="text"
                  value={memberForm.nim || ''}
                  onChange={(e) => setMemberForm({ ...memberForm, nim: e.target.value })}
                  placeholder="Contoh: 3012510013"
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                />
              </div>

              {/* FITUR UPLOAD FOTO PROFIL LOKAL */}
              <div className="pt-2">
                <label className="block text-xs font-mono text-[#bebeca] mb-2">
                  Foto Profil (Upload File Lokal atau URL)
                </label>

                {/* Preview Foto */}
                {memberForm.imageUrl && (
                <div className="relative w-20 h-20 mx-auto mb-4">
                {/* Lingkaran Foto */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#bebeca] shadow-md bg-[#19191d]">
                      <img
                        src={memberForm.imageUrl}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                        </div>

                            {/* Tombol Silang (Badge Melayang di Sudut Kanan Atas) */}
                    <button
                        type="button"
                        onClick={() => setMemberForm({ ...memberForm, imageUrl: '' })}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#19191d] transition-all hover:scale-110 cursor-pointer"
                        title="Hapus foto"
                        >
                        <X size={12} />
                    </button>
                </div>
)}

                {/* Input File Lokal */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 bg-[#232329] hover:bg-[#3c3c44] border border-[#3c3c44] hover:border-[#bebeca] rounded-xl px-4 py-2.5 text-xs text-white transition-colors">
                    <Upload size={15} />
                    <span>Pilih Foto dari Komputer / HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Atau URL Online */}
                <input
                  type="text"
                  value={memberForm.imageUrl || ''}
                  onChange={(e) => setMemberForm({ ...memberForm, imageUrl: e.target.value })}
                  placeholder="Atau tempel Link URL gambar..."
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#3c3c44]">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#bebeca] hover:bg-[#3c3c44]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold shadow-lg"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM PROGRAM KERJA */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#3c3c44] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">
              {programIndex !== null ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
            </h3>
            <form onSubmit={handleSaveProgram} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Nama Program Kerja</label>
                <input
                  type="text"
                  value={programForm.title}
                  onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Deskripsi Proker</label>
                <textarea
                  rows={3}
                  value={programForm.description}
                  onChange={(e) => setProgramForm({ ...programForm, description: e.target.value })}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Jadwal / Periode Pelaksanaan</label>
                <input
                  type="text"
                  placeholder="Contoh: Oktober 2026 / Bulanan"
                  value={programForm.period}
                  onChange={(e) => setProgramForm({ ...programForm, period: e.target.value })}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#3c3c44]">
                <button
                  type="button"
                  onClick={() => setShowProgramModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#bebeca] hover:bg-[#3c3c44]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold shadow-lg"
                >
                  Simpan Proker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GANTI USERNAME & PASSWORD ADMIN */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#3c3c44] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <KeyRound size={18} /> Ganti Akun Admin
            </h3>
            <p className="text-xs text-[#bebeca]/70 mb-5">
              Perbarui kredensial untuk login ke panel administrator ini.
            </p>

            {accountSuccessMsg && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs">
                {accountSuccessMsg}
              </div>
            )}

            {/* GANTI DARI <form> MENJADI <div> */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#bebeca] mb-1">Username Baru</label>
                <input
                  type="text"
                  autoComplete="off"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm"
                  required
                />
              </div>
<div>
  <label className="block text-xs font-mono text-[#bebeca] mb-1">Password Baru</label>
  <input
    type="text"
    autoComplete="off"
    placeholder="Masukkan password baru..."
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="password-mask w-full bg-[#19191d] border border-[#3c3c44] rounded-xl px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-[#bebeca]"
    required
  />
</div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#3c3c44]">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#bebeca] hover:bg-[#3c3c44]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveAccount}
                  className="px-5 py-2 rounded-xl bg-[#bebeca] hover:bg-white text-[#121215] text-xs font-bold shadow-lg cursor-pointer"
                >
                  Simpan Kredensial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
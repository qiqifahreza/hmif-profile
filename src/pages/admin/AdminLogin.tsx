import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldAlert, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const { login, isAdmin } = useData();
  const navigate = useNavigate();

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
// ✅ Tambahkan "async" dan "await"
const executeLogin = async () => {
  const success = await login(username, password);
  if (success) {
    navigate('/admin/dashboard');
  } else {
    setError(true);
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#121215] flex items-center justify-center px-4 relative">
      <Link
        to="/"
        className="absolute top-8 left-8 text-xs text-[#bebeca]/60 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} /> Kembali ke Beranda
      </Link>

      <div className="liquid-glass rounded-3xl p-8 max-w-md w-full border border-[#3c3c44] shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-[#3c3c44]/80 border border-[#bebeca]/30 flex items-center justify-center text-[#bebeca] mx-auto mb-6">
          <Lock size={26} />
        </div>

        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Admin Database Portal
        </h2>
        <p className="text-xs text-center text-[#bebeca]/70 mb-8">
          Akses khusus pengurus Kabinet Samvaya untuk mengelola data himpunan.
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert size={16} />
            <span>Username atau Password salah!</span>
          </div>
        )}

        <div onKeyDown={handleKeyDown} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#bebeca] mb-2">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                autoComplete="off"
                placeholder="Masukkan username..."
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                className="w-full bg-[#19191d] border border-[#3c3c44] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#bebeca] transition-colors"
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-[#bebeca]/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#bebeca] mb-2">
              Password
            </label>
            <div className="relative">
              {/* INPUT TYPE TEXT DENGAN MASKING AGAR GOOGLE CHROME TIDAK MENCEGAT */}
              <input
                type="text"
                autoComplete="off"
                placeholder="Masukkan password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full bg-[#19191d] border border-[#3c3c44] rounded-xl pl-10 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#bebeca] transition-colors ${
                  !showPassword ? 'password-mask' : ''
                }`}
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#bebeca]/50" />
              
              {/* Tombol Lihat/Sembunyikan Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#bebeca]/50 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={executeLogin}
            className="w-full bg-[#bebeca] hover:bg-white text-[#121215] font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg mt-2 cursor-pointer"
          >
            <span>Masuk Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <p className="text-[11px] text-center text-[#bebeca]/40 mt-6 font-mono">
          HMIF UISI. All rights reserved.
        </p>
      </div>
    </div>
  );
};
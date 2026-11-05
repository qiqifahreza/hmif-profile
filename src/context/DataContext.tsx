import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { divisionsData as initialDivisionsData } from '../data/divisionsData';
import type { DivisionDetail, Member, DivisionProker } from '../types';

interface DataContextType {
  divisions: DivisionDetail[];
  isLoading: boolean;
  isAdmin: boolean;
  adminUsername: string;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  changeCredentials: (newUsername: string, newPassword: string) => Promise<void>;
  updateLeader: (divisionSlug: string, leader: Member) => Promise<void>;
  updateCoLeader: (divisionSlug: string, coLeader?: Member) => Promise<void>;
  addMember: (divisionSlug: string, member: Member) => Promise<void>;
  updateMember: (divisionSlug: string, index: number, member: Member) => Promise<void>;
  deleteMember: (divisionSlug: string, index: number) => Promise<void>;
  addProgram: (divisionSlug: string, program: DivisionProker) => Promise<void>;
  updateProgram: (divisionSlug: string, index: number, program: DivisionProker) => Promise<void>;
  deleteProgram: (divisionSlug: string, index: number) => Promise<void>;
}

// URUTAN DIVISI BAKU DAN RESMI
const STRICT_DIVISION_ORDER = [
  'kahim-wakahim',
  'sekretaris',
  'bendahara',
  'psdm',
  'kominfo',
  'ristek',
  'kewirausahaan',
  'humas',
];

// FUNGSI PENATAAN ULANG MUTLAK (ANTI-ACAK)
const enforceDivisionOrder = (list: DivisionDetail[]): DivisionDetail[] => {
  const orderedList: DivisionDetail[] = [];

  // 1. Susun persis sesuai urutan STRICT_DIVISION_ORDER
  STRICT_DIVISION_ORDER.forEach((slug) => {
    const found = list.find((item) => item.slug?.trim().toLowerCase() === slug);
    if (found) {
      orderedList.push(found);
    }
  });

  // 2. Bila ada divisi baru di luar 8 daftar ini, masukkan di paling belakang
  list.forEach((item) => {
    const itemSlug = item.slug?.trim().toLowerCase();
    if (!STRICT_DIVISION_ORDER.includes(itemSlug)) {
      orderedList.push(item);
    }
  });

  return orderedList;
};

const DataContext = createContext<DataContextType | undefined>(undefined);
const AUTH_SESSION_KEY = 'hmif_admin_session';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<DivisionDetail[]>(() => enforceDivisionOrder(initialDivisionsData));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_SESSION_KEY) === 'true';
  });
  const [adminUsername, setAdminUsername] = useState<string>('admin');

  // Ambil data langsung dari Supabase dengan sorting order_index
  const fetchDivisions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('divisions')
        .select('*')
        .order('order_index', { ascending: true }); // <-- Diurutkan dari database

      if (error) throw error;

      if (data && data.length > 0) {
        const formatted: DivisionDetail[] = data.map((row) => ({
          slug: row.slug,
          name: row.name,
          shortName: row.short_name,
          about: row.about,
          leader: row.leader,
          coLeader: row.co_leader,
          members: row.members || [],
          programs: row.programs || [],
        }));

        // KUNCI URUTAN SEKALI LAGI DI LEVEL FRONTEND
        setDivisions(enforceDivisionOrder(formatted));
      }
    } catch (err) {
      console.error('Gagal mengambil data dari Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  // Login via Database Cloud
  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_creds')
        .select('username, password')
        .eq('id', 1)
        .single();

      if (error || !data) return false;

      if (data.username === user.trim() && data.password === pass) {
        setIsAdmin(true);
        setAdminUsername(data.username);
        localStorage.setItem(AUTH_SESSION_KEY, 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(AUTH_SESSION_KEY);
  };

  // Ganti Password & Username Admin
  const changeCredentials = async (newUsername: string, newPassword: string) => {
    await supabase
      .from('admin_creds')
      .update({ username: newUsername.trim(), password: newPassword })
      .eq('id', 1);
    setAdminUsername(newUsername.trim());
  };

  // Helper sinkronisasi divisi ke Supabase
  const syncDivisionToSupabase = async (updatedDiv: DivisionDetail) => {
    await supabase
      .from('divisions')
      .update({
        leader: updatedDiv.leader,
        co_leader: updatedDiv.coLeader,
        members: updatedDiv.members,
        programs: updatedDiv.programs,
      })
      .eq('slug', updatedDiv.slug);
  };

  // CRUD Mahasiswa & Pimpinan
  const updateLeader = async (slug: string, leader: Member) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => (d.slug === slug ? { ...d, leader } : d));
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const updateCoLeader = async (slug: string, coLeader?: Member) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => (d.slug === slug ? { ...d, coLeader } : d));
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const addMember = async (slug: string, member: Member) => {
    setDivisions((prev) => {
      const updated = prev.map((d) =>
        d.slug === slug ? { ...d, members: [...d.members, member] } : d
      );
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const updateMember = async (slug: string, index: number, member: Member) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => {
        if (d.slug === slug) {
          const newMembers = [...d.members];
          newMembers[index] = member;
          return { ...d, members: newMembers };
        }
        return d;
      });
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const deleteMember = async (slug: string, index: number) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => {
        if (d.slug === slug) {
          return { ...d, members: d.members.filter((_, i) => i !== index) };
        }
        return d;
      });
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  // CRUD Program Kerja
  const addProgram = async (slug: string, program: DivisionProker) => {
    setDivisions((prev) => {
      const updated = prev.map((d) =>
        d.slug === slug ? { ...d, programs: [...d.programs, program] } : d
      );
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const updateProgram = async (slug: string, index: number, program: DivisionProker) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => {
        if (d.slug === slug) {
          const newProgs = [...d.programs];
          newProgs[index] = program;
          return { ...d, programs: newProgs };
        }
        return d;
      });
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  const deleteProgram = async (slug: string, index: number) => {
    setDivisions((prev) => {
      const updated = prev.map((d) => {
        if (d.slug === slug) {
          return { ...d, programs: d.programs.filter((_, i) => i !== index) };
        }
        return d;
      });
      const target = updated.find((d) => d.slug === slug);
      if (target) syncDivisionToSupabase(target);
      return enforceDivisionOrder(updated);
    });
  };

  return (
    <DataContext.Provider
      value={{
        divisions,
        isLoading,
        isAdmin,
        adminUsername,
        login,
        logout,
        changeCredentials,
        updateLeader,
        updateCoLeader,
        addMember,
        updateMember,
        deleteMember,
        addProgram,
        updateProgram,
        deleteProgram,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
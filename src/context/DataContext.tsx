import React, { createContext, useContext, useState, useEffect } from 'react';
import { divisionsData as initialDivisionsData } from '../data/divisionsData';
import type { DivisionDetail, Member, DivisionProker } from '../types';

interface AdminCredentials {
  username: string;
  password: string;
}

interface DataContextType {
  divisions: DivisionDetail[];
  isAdmin: boolean;
  adminUsername: string;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  changeCredentials: (newUsername: string, newPassword: string) => void;
  // CRUD Mahasiswa / Anggota
  updateLeader: (divisionSlug: string, leader: Member) => void;
  updateCoLeader: (divisionSlug: string, coLeader?: Member) => void;
  addMember: (divisionSlug: string, member: Member) => void;
  updateMember: (divisionSlug: string, index: number, member: Member) => void;
  deleteMember: (divisionSlug: string, index: number) => void;
  // CRUD Program Kerja
  addProgram: (divisionSlug: string, program: DivisionProker) => void;
  updateProgram: (divisionSlug: string, index: number, program: DivisionProker) => void;
  deleteProgram: (divisionSlug: string, index: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);
const STORAGE_KEY = 'hmif_uisi_database_v2';
const AUTH_KEY = 'hmif_uisi_admin_auth';
const CREDENTIALS_KEY = 'hmif_uisi_admin_creds';

const DEFAULT_CREDS: AdminCredentials = {
  username: 'admin',
  password: 'samvaya2026',
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<DivisionDetail[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialDivisionsData;
      }
    }
    return initialDivisionsData;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [credentials, setCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem(CREDENTIALS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_CREDS;
      }
    }
    return DEFAULT_CREDS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(divisions));
  }, [divisions]);

  // Login dengan Username & Password
  const login = (user: string, pass: string): boolean => {
    if (user.trim() === credentials.username && pass === credentials.password) {
      setIsAdmin(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(AUTH_KEY);
  };

  // Ganti Username & Password
  const changeCredentials = (newUsername: string, newPassword: string) => {
    const updated = {
      username: newUsername.trim(),
      password: newPassword,
    };
    setCredentials(updated);
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
  };

  const updateLeader = (slug: string, leader: Member) => {
    setDivisions((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, leader } : d))
    );
  };

  const updateCoLeader = (slug: string, coLeader?: Member) => {
    setDivisions((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, coLeader } : d))
    );
  };

  const addMember = (slug: string, member: Member) => {
    setDivisions((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, members: [...d.members, member] } : d))
    );
  };

  const updateMember = (slug: string, index: number, member: Member) => {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.slug === slug) {
          const updated = [...d.members];
          updated[index] = member;
          return { ...d, members: updated };
        }
        return d;
      })
    );
  };

  const deleteMember = (slug: string, index: number) => {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.slug === slug) {
          return { ...d, members: d.members.filter((_, i) => i !== index) };
        }
        return d;
      })
    );
  };

  const addProgram = (slug: string, program: DivisionProker) => {
    setDivisions((prev) =>
      prev.map((d) => (d.slug === slug ? { ...d, programs: [...d.programs, program] } : d))
    );
  };

  const updateProgram = (slug: string, index: number, program: DivisionProker) => {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.slug === slug) {
          const updated = [...d.programs];
          updated[index] = program;
          return { ...d, programs: updated };
        }
        return d;
      })
    );
  };

  const deleteProgram = (slug: string, index: number) => {
    setDivisions((prev) =>
      prev.map((d) => {
        if (d.slug === slug) {
          return { ...d, programs: d.programs.filter((_, i) => i !== index) };
        }
        return d;
      })
    );
  };

  return (
    <DataContext.Provider
      value={{
        divisions,
        isAdmin,
        adminUsername: credentials.username,
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
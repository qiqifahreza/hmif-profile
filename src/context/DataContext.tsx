import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { divisionsData as initialDivisionsData } from '../data/divisionsData';
import type { 
  DivisionDetail, Member, DivisionProker, 
  Announcement, Competition, BlogPost, SiteSettings 
} from '../types';

interface DataContextType {
  divisions: DivisionDetail[];
  announcements: Announcement[];
  competitions: Competition[];
  blogs: BlogPost[];
  settings: SiteSettings;
  isLoading: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  isAdmin: boolean;
  adminUsername: string;
  login: (user: string, pass: string) => Promise<boolean>;
  logout: () => void;
  changeCredentials: (newUsername: string, newPassword: string) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  updateLeader: (slug: string, leader: Member) => Promise<void>;
  updateCoLeader: (slug: string, coLeader?: Member) => Promise<void>;
  addMember: (slug: string, member: Member) => Promise<void>;
  updateMember: (slug: string, index: number, member: Member) => Promise<void>;
  deleteMember: (slug: string, index: number) => Promise<void>;
  addProgram: (slug: string, program: DivisionProker) => Promise<void>;
  updateProgram: (slug: string, index: number, program: DivisionProker) => Promise<void>;
  deleteProgram: (slug: string, index: number) => Promise<void>;
  saveAnnouncement: (data: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  saveCompetition: (data: Partial<Competition>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  saveBlog: (data: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
}

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

const enforceDivisionOrder = (list: DivisionDetail[]): DivisionDetail[] => {
  const orderedList: DivisionDetail[] = [];
  STRICT_DIVISION_ORDER.forEach((slug) => {
    const found = list.find((item) => item.slug?.trim().toLowerCase() === slug);
    if (found) orderedList.push(found);
  });
  list.forEach((item) => {
    if (!STRICT_DIVISION_ORDER.includes(item.slug?.trim().toLowerCase())) {
      orderedList.push(item);
    }
  });
  return orderedList;
};

const DEFAULT_SETTINGS: SiteSettings = {
  org_name: 'Himpunan Mahasiswa Informatika',
  univ_name: 'Universitas Internasional Semen Indonesia',
  cabinet_name: 'KABINET SAMVAYA',
  period: '2026/2027',
  hero_title: 'Ruang Akselerasi, Inovasi & Karya Nyata Informatika',
  hero_subtitle: 'Wadah kolaborasi dan pengembangan potensi mahasiswa Informatika UISI berdaya saing global.',
  vision: 'Menjadikan HMIF UISI sebagai wadah akselerasi potensi mahasiswa informatika yang unggul, berintegritas, inklusif, dan adaptif terhadap perkembangan teknologi global.',
  mission: [
    'Membangun iklim riset, inovasi software, dan kompetisi teknologi yang berdaya saing tinggi.',
    'Menyelenggarakan pembinaan karakter, etika, dan kepemimpinan yang berkelanjutan.',
    'Memperluas jejaring strategis dengan alumni, civitas akademika, dan dunia industri IT nasional.'
  ],
  logo_url: '',
  primary_color_dark: '#3c3c44',
  secondary_color_dark: '#bebeca',
  primary_color_light: '#3c3c44',
  secondary_color_light: '#bebeca',
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<DivisionDetail[]>(() => enforceDivisionOrder(initialDivisionsData));
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('hmif_theme') !== 'light');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => localStorage.getItem('hmif_admin_session') === 'true');
  const [adminUsername, setAdminUsername] = useState('admin');

  const applyThemeColors = useCallback((dark: boolean, currentSettings: SiteSettings) => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.style.setProperty('--theme-primary', currentSettings.primary_color_dark);
      root.style.setProperty('--theme-secondary', currentSettings.secondary_color_dark);
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--theme-primary', currentSettings.primary_color_light);
      root.style.setProperty('--theme-secondary', currentSettings.secondary_color_light);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('hmif_theme', next ? 'dark' : 'light');
      applyThemeColors(next, settings);
      return next;
    });
  };

  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: setRes } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (setRes) {
        setSettings(setRes);
        applyThemeColors(isDarkMode, setRes);
      }

      const { data: divRes } = await supabase.from('divisions').select('*').order('order_index', { ascending: true });
      if (divRes && divRes.length > 0) {
        const formatted = divRes.map((r) => ({
          slug: r.slug,
          name: r.name,
          shortName: r.short_name,
          about: r.about,
          leader: r.leader,
          coLeader: r.co_leader,
          members: r.members || [],
          programs: r.programs || [],
        }));
        setDivisions(enforceDivisionOrder(formatted));
      }

      const { data: annRes } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (annRes) setAnnouncements(annRes);

      const { data: compRes } = await supabase.from('competitions').select('*').order('deadline', { ascending: true });
      if (compRes) setCompetitions(compRes);

      const { data: blogRes } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (blogRes) setBlogs(blogRes);
    } catch (err) {
      console.error('Error fetching Supabase data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [applyThemeColors, isDarkMode]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const { data } = await supabase.from('admin_creds').select('username, password').eq('id', 1).single();
      if (data && data.username === user.trim() && data.password === pass) {
        setIsAdmin(true);
        setAdminUsername(data.username);
        localStorage.setItem('hmif_admin_session', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('hmif_admin_session');
  };

  const changeCredentials = async (newUsername: string, newPassword: string) => {
    await supabase.from('admin_creds').update({ username: newUsername.trim(), password: newPassword }).eq('id', 1);
    setAdminUsername(newUsername.trim());
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    applyThemeColors(isDarkMode, merged);
    await supabase.from('site_settings').update(newSettings).eq('id', 1);
  };
// Helper sinkronisasi divisi ke Supabase dengan proteksi error
  const syncDivisionToSupabase = async (updated: DivisionDetail) => {
    try {
      const { error } = await supabase
        .from('divisions')
        .update({
          leader: updated.leader,
          co_leader: updated.coLeader || null,
          members: updated.members || [],
          programs: updated.programs || [],
        })
        .eq('slug', updated.slug);

      if (error) {
        console.error('Supabase update error:', error.message);
      }
    } catch (err) {
      console.error('Gagal sinkronisasi ke Supabase:', err);
    }
  };

  // CRUD Mahasiswa & Pimpinan (Fix Local State & Supabase Update)
  const updateLeader = async (slug: string, leader: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, leader };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  const updateCoLeader = async (slug: string, coLeader?: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, coLeader };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  const addMember = async (slug: string, member: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, members: [...target.members, member] };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  const updateMember = async (slug: string, index: number, member: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newMembers = [...target.members];
    newMembers[index] = member;
    const updated = { ...target, members: newMembers };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  // FIX DELETE MEMBER AGAR BERFUNGSI SEMPURNA DI LOCAL (NPM RUN DEV)
  const deleteMember = async (slug: string, index: number) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newMembers = target.members.filter((_, i) => i !== index);
    const updated = { ...target, members: newMembers };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  // CRUD Program Kerja
  const addProgram = async (slug: string, program: DivisionProker) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, programs: [...target.programs, program] };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  const updateProgram = async (slug: string, index: number, program: DivisionProker) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newPrograms = [...target.programs];
    newPrograms[index] = program;
    const updated = { ...target, programs: newPrograms };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  // FIX DELETE PROKER AGAR BERFUNGSI SEMPURNA DI LOCAL (NPM RUN DEV)
  const deleteProgram = async (slug: string, index: number) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newPrograms = target.programs.filter((_, i) => i !== index);
    const updated = { ...target, programs: newPrograms };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await syncDivisionToSupabase(updated);
  };

  const saveAnnouncement = async (item: Partial<Announcement>) => {
    if (item.id) {
      await supabase.from('announcements').update(item).eq('id', item.id);
    } else {
      await supabase.from('announcements').insert([item]);
    }
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data) setAnnouncements(data);
  };

  const deleteAnnouncement = async (id: string) => {
    await supabase.from('announcements').delete().eq('id', id);
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const saveCompetition = async (item: Partial<Competition>) => {
    if (item.id) {
      await supabase.from('competitions').update(item).eq('id', item.id);
    } else {
      await supabase.from('competitions').insert([item]);
    }
    const { data } = await supabase.from('competitions').select('*').order('deadline', { ascending: true });
    if (data) setCompetitions(data);
  };

  const deleteCompetition = async (id: string) => {
    await supabase.from('competitions').delete().eq('id', id);
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
  };

  const saveBlog = async (item: Partial<BlogPost>) => {
    if (item.id) {
      await supabase.from('blogs').update(item).eq('id', item.id);
    } else {
      await supabase.from('blogs').insert([item]);
    }
    const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (data) setBlogs(data);
  };

  const deleteBlog = async (id: string) => {
    await supabase.from('blogs').delete().eq('id', id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        divisions,
        announcements,
        competitions,
        blogs,
        settings,
        isLoading,
        isDarkMode,
        toggleTheme,
        isAdmin,
        adminUsername,
        login,
        logout,
        changeCredentials,
        updateSettings,
        updateLeader,
        updateCoLeader,
        addMember,
        updateMember,
        deleteMember,
        addProgram,
        updateProgram,
        deleteProgram,
        saveAnnouncement,
        deleteAnnouncement,
        saveCompetition,
        deleteCompetition,
        saveBlog,
        deleteBlog,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
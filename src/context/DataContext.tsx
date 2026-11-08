import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  updateDivisionInfo: (slug: string, info: { name: string; shortName: string; about: string }) => Promise<void>;
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
const TOKEN_KEY = 'hmif_serverless_token';
const USERNAME_KEY = 'hmif_serverless_user';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [divisions, setDivisions] = useState<DivisionDetail[]>(() => enforceDivisionOrder(initialDivisionsData));
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('hmif_theme') !== 'light');
  
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [adminUsername, setAdminUsername] = useState<string>(() => localStorage.getItem(USERNAME_KEY) || 'admin');
  const isAdmin = Boolean(adminToken);

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

  // 1. AMBIL SELURUH DATA DARI SERVERLESS API (/api/data)
  const fetchAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Gagal mengambil data dari serverless API');
      
      const json = await res.json();
      if (json.settings) {
        setSettings(json.settings);
        applyThemeColors(isDarkMode, json.settings);
      }
      if (json.divisions && json.divisions.length > 0) {
        const formatted = json.divisions.map((r: Record<string, unknown>) => ({
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
      if (json.announcements) setAnnouncements(json.announcements);
      if (json.competitions) setCompetitions(json.competitions);
      if (json.blogs) setBlogs(json.blogs);
    } catch (err) {
      console.error('Fetch Serverless Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [applyThemeColors, isDarkMode]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Helper Pengiriman Mutasi Serverless
  const sendServerlessMutation = async (type: string, payload: unknown) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ type, payload }),
      });
    } catch (err) {
      console.error('Mutation Error:', err);
    }
  };

  // 2. LOGIN ADMIN VIA SERVERLESS (/api/auth)
  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username: user, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        setAdminToken(data.token);
        setAdminUsername(data.username);
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USERNAME_KEY, data.username);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
  };

  const changeCredentials = async (newUsername: string, newPassword: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        action: 'change-credentials',
        newUsername,
        newPassword,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setAdminUsername(data.username);
      localStorage.setItem(USERNAME_KEY, data.username);
    }
  };

  // 3. MUTASI DATA TERPUSAT
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    applyThemeColors(isDarkMode, merged);
    await sendServerlessMutation('update-settings', newSettings);
  };

  const updateDivisionInfo = async (slug: string, info: { name: string; shortName: string; about: string }) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, name: info.name.trim(), shortName: info.shortName.trim(), about: info.about.trim() };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const updateLeader = async (slug: string, leader: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, leader };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const updateCoLeader = async (slug: string, coLeader?: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, coLeader };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const addMember = async (slug: string, member: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, members: [...target.members, member] };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const updateMember = async (slug: string, index: number, member: Member) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newMembers = [...target.members];
    newMembers[index] = member;
    const updated = { ...target, members: newMembers };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const deleteMember = async (slug: string, index: number) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newMembers = target.members.filter((_, i) => i !== index);
    const updated = { ...target, members: newMembers };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const addProgram = async (slug: string, program: DivisionProker) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const updated = { ...target, programs: [...target.programs, program] };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const updateProgram = async (slug: string, index: number, program: DivisionProker) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newPrograms = [...target.programs];
    newPrograms[index] = program;
    const updated = { ...target, programs: newPrograms };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const deleteProgram = async (slug: string, index: number) => {
    const target = divisions.find((d) => d.slug === slug);
    if (!target) return;
    const newPrograms = target.programs.filter((_, i) => i !== index);
    const updated = { ...target, programs: newPrograms };
    setDivisions((prev) => enforceDivisionOrder(prev.map((d) => (d.slug === slug ? updated : d))));
    await sendServerlessMutation('update-division', { slug, data: updated });
  };

  const saveAnnouncement = async (item: Partial<Announcement>) => {
    await sendServerlessMutation('save-announcement', item);
    await fetchAllData();
  };

  const deleteAnnouncement = async (id: string) => {
    await sendServerlessMutation('delete-announcement', { id });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const saveCompetition = async (item: Partial<Competition>) => {
    await sendServerlessMutation('save-competition', item);
    await fetchAllData();
  };

  const deleteCompetition = async (id: string) => {
    await sendServerlessMutation('delete-competition', { id });
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
  };

  const saveBlog = async (item: Partial<BlogPost>) => {
    await sendServerlessMutation('save-blog', item);
    await fetchAllData();
  };

  const deleteBlog = async (id: string) => {
    await sendServerlessMutation('delete-blog', { id });
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
        updateDivisionInfo,
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
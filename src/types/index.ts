export type ProkerStatus = 'Direncanakan' | 'Akan Datang' | 'Berlangsung' | 'Selesai';

export interface Member {
  name: string;
  role: string;
  nim?: string;
  imageUrl?: string;
}

export interface DocumentationItem {
  title: string;
  date: string;
  summary: string;
  photoUrls: string[];
}

export interface DivisionProker {
  id?: string;
  title: string;
  description: string;
  period: string; // Bisa tanggal atau "Coming Soon"
  status: ProkerStatus;
  documentation?: DocumentationItem;
}

export interface DivisionDetail {
  slug: string;
  name: string;
  shortName: string;
  about: string;
  order_index?: number;
  leader: Member;
  coLeader?: Member;
  members: Member[];
  programs: DivisionProker[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  poster_url: string;
  published_date: string;
  is_published: boolean;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  deadline: string;
  registration_link: string;
  poster_url: string;
  status: 'Dibuka' | 'Segera Ditutup' | 'Ditutup';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_date: string;
  cover_url: string;
  tags: string[];
  is_published: boolean;
}

export interface SiteSettings {
  org_name: string;
  univ_name: string;
  cabinet_name: string;
  period: string;
  hero_title: string;
  hero_subtitle: string;
  vision: string;
  mission: string[];
  logo_url: string;
  primary_color_dark: string;
  secondary_color_dark: string;
  primary_color_light: string;
  secondary_color_light: string;
}
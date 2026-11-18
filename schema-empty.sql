-- =========================================================================
-- DATABASE SCHEMA (VERSI KOSONGAN / FRESH TEMPLATE)
-- Platform: Supabase (PostgreSQL)
-- Deskripsi: Struktur tabel bersih tanpa data pengurus, tanpa proker,
--            tanpa pengumuman, tanpa kompetisi, dan tanpa artikel blog.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. TABEL AKUN ADMIN (admin_creds)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_creds (
  id INT PRIMARY KEY DEFAULT 1,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

-- Akun admin awal agar bisa login ke /admin pertama kali
INSERT INTO admin_creds (id, username, password)
VALUES (1, 'admin', 'admin123')
ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------------------
-- 2. TABEL PENGATURAN SITUS & TEMA (site_settings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  org_name TEXT NOT NULL DEFAULT 'Nama Himpunan Mahasiswa',
  univ_name TEXT NOT NULL DEFAULT 'Nama Universitas',
  cabinet_name TEXT NOT NULL DEFAULT 'NAMA KABINET',
  period TEXT NOT NULL DEFAULT '2026/2027',
  hero_title TEXT NOT NULL DEFAULT 'Judul Utama Website',
  hero_subtitle TEXT NOT NULL DEFAULT 'Deskripsi singkat organisasi Anda di sini.',
  vision TEXT NOT NULL DEFAULT 'Visi organisasi belum diisi.',
  mission JSONB NOT NULL DEFAULT '["Butir misi pertama belum diisi."]'::jsonb,
  logo_url TEXT DEFAULT '',
  primary_color_dark TEXT NOT NULL DEFAULT '#3c3c44',
  secondary_color_dark TEXT NOT NULL DEFAULT '#bebeca',
  primary_color_light TEXT NOT NULL DEFAULT '#3c3c44',
  secondary_color_light TEXT NOT NULL DEFAULT '#bebeca',
  hero_gallery JSONB DEFAULT '[]'::jsonb,
  topography_color TEXT DEFAULT '#bebeca',
  topography_opacity NUMERIC DEFAULT 0.45
);

ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS topography_color TEXT DEFAULT '#bebeca';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS topography_opacity NUMERIC DEFAULT 0.45;

-- Wajib ada 1 baris awal (id = 1) agar menu Pengaturan Admin bisa menyimpan perubahan
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------------------
-- 3. TABEL DIVISI, PENGURUS & PROGRAM KERJA (divisions)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS divisions (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  about TEXT NOT NULL,
  order_index INT DEFAULT 0,
  leader JSONB NOT NULL,
  co_leader JSONB,
  members JSONB DEFAULT '[]'::jsonb,
  programs JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE divisions ADD COLUMN IF NOT EXISTS order_index INT DEFAULT 0;


-- -------------------------------------------------------------------------
-- 4. TABEL PENGUMUMAN RESMI (announcements) - KOSONG
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  poster_url TEXT DEFAULT '',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -------------------------------------------------------------------------
-- 5. TABEL INFORMASI KOMPETISI IT (competitions) - KOSONG
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organizer TEXT NOT NULL,
  deadline DATE NOT NULL,
  registration_link TEXT NOT NULL,
  poster_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Dibuka',
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -------------------------------------------------------------------------
-- 6. TABEL BLOG & ARTIKEL EDUKASI (blogs) - KOSONG
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_url TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -------------------------------------------------------------------------
-- 7. PENGATURAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- -------------------------------------------------------------------------
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_creds ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read divisions" ON divisions;
DROP POLICY IF EXISTS "Public write divisions" ON divisions;
DROP POLICY IF EXISTS "Public read admin_creds" ON admin_creds;
DROP POLICY IF EXISTS "Public write admin_creds" ON admin_creds;
DROP POLICY IF EXISTS "Public full on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public full on announcements" ON announcements;
DROP POLICY IF EXISTS "Public full on competitions" ON competitions;
DROP POLICY IF EXISTS "Public full on blogs" ON blogs;

CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public write divisions" ON divisions FOR ALL USING (true);

CREATE POLICY "Public read admin_creds" ON admin_creds FOR SELECT USING (true);
CREATE POLICY "Public write admin_creds" ON admin_creds FOR ALL USING (true);

CREATE POLICY "Public full on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Public full on announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Public full on competitions" ON competitions FOR ALL USING (true);
CREATE POLICY "Public full on blogs" ON blogs FOR ALL USING (true);


-- -------------------------------------------------------------------------
-- 8. KERANGKA SLOT 8 DIVISI KOSONG (TANPA ANGGOTA & TANPA PROKER)
-- (Hapus bagian di bawah ini jika ingin tabel divisions benar-benar 0 baris)
-- -------------------------------------------------------------------------
INSERT INTO divisions (slug, name, short_name, about, order_index, leader, co_leader, members, programs)
VALUES 
(
  'kahim-wakahim',
  'Ketua & Wakil Himpunan',
  'BPH Inti',
  'Deskripsi divisi belum diisi.',
  1,
  '{"name": "Belum Ditentukan", "role": "Ketua Himpunan", "nim": "", "imageUrl": ""}',
  '{"name": "Belum Ditentukan", "role": "Wakil Ketua Himpunan", "nim": "", "imageUrl": ""}',
  '[]',
  '[]'
),
(
  'sekretaris',
  'Sekretariat',
  'Sekretaris',
  'Deskripsi divisi belum diisi.',
  2,
  '{"name": "Belum Ditentukan", "role": "Sekretaris 1", "nim": "", "imageUrl": ""}',
  '{"name": "Belum Ditentukan", "role": "Sekretaris 2", "nim": "", "imageUrl": ""}',
  '[]',
  '[]'
),
(
  'bendahara',
  'Kebendaharaan',
  'Bendahara',
  'Deskripsi divisi belum diisi.',
  3,
  '{"name": "Belum Ditentukan", "role": "Bendahara 1", "nim": "", "imageUrl": ""}',
  '{"name": "Belum Ditentukan", "role": "Bendahara 2", "nim": "", "imageUrl": ""}',
  '[]',
  '[]'
),
(
  'psdm',
  'Pengembangan Sumber Daya Manusia (PSDM)',
  'PSDM',
  'Deskripsi divisi belum diisi.',
  4,
  '{"name": "Belum Ditentukan", "role": "Kepala Divisi PSDM", "nim": "", "imageUrl": ""}',
  NULL,
  '[]',
  '[]'
),
(
  'kominfo',
  'Komunikasi & Informasi (KOMINFO)',
  'Kominfo',
  'Deskripsi divisi belum diisi.',
  5,
  '{"name": "Belum Ditentukan", "role": "Kepala Divisi Kominfo", "nim": "", "imageUrl": ""}',
  NULL,
  '[]',
  '[]'
),
(
  'ristek',
  'Riset & Teknologi',
  'Ristek & Teknologi',
  'Deskripsi divisi belum diisi.',
  6,
  '{"name": "Belum Ditentukan", "role": "Kepala Divisi Ristek", "nim": "", "imageUrl": ""}',
  NULL,
  '[]',
  '[]'
),
(
  'kewirausahaan',
  'Kewirausahaan',
  'Kewirausahaan',
  'Deskripsi divisi belum diisi.',
  7,
  '{"name": "Belum Ditentukan", "role": "Kepala Divisi Kewirausahaan", "nim": "", "imageUrl": ""}',
  NULL,
  '[]',
  '[]'
),
(
  'humas',
  'Hubungan Masyarakat (HUMAS)',
  'Humas',
  'Deskripsi divisi belum diisi.',
  8,
  '{"name": "Belum Ditentukan", "role": "Kepala Divisi Humas", "nim": "", "imageUrl": ""}',
  NULL,
  '[]',
  '[]'
)
ON CONFLICT (slug) DO NOTHING;
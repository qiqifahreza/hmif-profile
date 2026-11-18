-- =========================================================================
-- DATABASE SCHEMA: HMIF UISI - KABINET SAMVAYA
-- Platform: Supabase (PostgreSQL)
-- Deskripsi: Skema lengkap untuk portal profil & CMS HMIF UISI
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. TABEL AKUN ADMIN (admin_creds)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_creds (
  id INT PRIMARY KEY DEFAULT 1,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);

INSERT INTO admin_creds (id, username, password)
VALUES (1, 'admin', 'samvaya2026')
ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------------------
-- 2. TABEL PENGATURAN SITUS & TEMA (site_settings)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  org_name TEXT NOT NULL DEFAULT 'Himpunan Mahasiswa Informatika',
  univ_name TEXT NOT NULL DEFAULT 'Universitas Internasional Semen Indonesia',
  cabinet_name TEXT NOT NULL DEFAULT 'KABINET SAMVAYA',
  period TEXT NOT NULL DEFAULT '2026/2027',
  hero_title TEXT NOT NULL DEFAULT 'Ruang Akselerasi, Inovasi & Karya Nyata Informatika',
  hero_subtitle TEXT NOT NULL DEFAULT 'Wadah kolaborasi dan pengembangan potensi mahasiswa Informatika UISI berdaya saing global.',
  vision TEXT NOT NULL DEFAULT 'Menjadikan HMIF UISI sebagai wadah akselerasi potensi mahasiswa informatika yang unggul, berintegritas, inklusif, dan adaptif terhadap perkembangan teknologi global.',
  mission JSONB NOT NULL DEFAULT '["Membangun iklim riset, inovasi software, dan kompetisi teknologi yang berdaya saing tinggi.", "Menyelenggarakan pembinaan karakter, etika, dan kepemimpinan yang berkelanjutan.", "Memperluas jejaring strategis dengan alumni, civitas akademika, dan dunia industri IT nasional."]'::jsonb,
  logo_url TEXT DEFAULT '',
  primary_color_dark TEXT NOT NULL DEFAULT '#3c3c44',
  secondary_color_dark TEXT NOT NULL DEFAULT '#bebeca',
  primary_color_light TEXT NOT NULL DEFAULT '#3c3c44',
  secondary_color_light TEXT NOT NULL DEFAULT '#bebeca',
  hero_gallery JSONB DEFAULT '[]'::jsonb,
  topography_color TEXT DEFAULT '#bebeca',
  topography_opacity NUMERIC DEFAULT 0.45
);

-- Pastikan kolom tambahan tersedia jika tabel sudah dibuat sebelumnya
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_gallery JSONB DEFAULT '[]'::jsonb;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS topography_color TEXT DEFAULT '#bebeca';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS topography_opacity NUMERIC DEFAULT 0.45;

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
-- 4. TABEL PENGUMUMAN RESMI (announcements)
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
-- 5. TABEL INFORMASI KOMPETISI IT (competitions)
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
-- 6. TABEL BLOG & ARTIKEL EDUKASI (blogs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_url TEXT DEFAULT '',
  tags JSONB DEFAULT '["Informatika", "Edukasi"]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- -------------------------------------------------------------------------
-- 7. PENGATURAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- Catatan: Akses tulis utama dijalankan melalui Serverless API menggunakan
-- SUPABASE_SERVICE_ROLE_KEY yang secara otomatis melewati RLS.
-- -------------------------------------------------------------------------
ALTER TABLE divisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_creds ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama jika ada agar skrip aman dijalankan ulang
DROP POLICY IF EXISTS "Public read divisions" ON divisions;
DROP POLICY IF EXISTS "Public write divisions" ON divisions;
DROP POLICY IF EXISTS "Public read admin_creds" ON admin_creds;
DROP POLICY IF EXISTS "Public write admin_creds" ON admin_creds;
DROP POLICY IF EXISTS "Public full on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public full on announcements" ON announcements;
DROP POLICY IF EXISTS "Public full on competitions" ON competitions;
DROP POLICY IF EXISTS "Public full on blogs" ON blogs;

-- Terapkan policy akses
CREATE POLICY "Public read divisions" ON divisions FOR SELECT USING (true);
CREATE POLICY "Public write divisions" ON divisions FOR ALL USING (true);

CREATE POLICY "Public read admin_creds" ON admin_creds FOR SELECT USING (true);
CREATE POLICY "Public write admin_creds" ON admin_creds FOR ALL USING (true);

CREATE POLICY "Public full on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Public full on announcements" ON announcements FOR ALL USING (true);
CREATE POLICY "Public full on competitions" ON competitions FOR ALL USING (true);
CREATE POLICY "Public full on blogs" ON blogs FOR ALL USING (true);


-- -------------------------------------------------------------------------
-- 8. DATA AWAL (SEED DATA) KABINET SAMVAYA 2026/2027
-- -------------------------------------------------------------------------
INSERT INTO divisions (slug, name, short_name, about, order_index, leader, co_leader, members, programs)
VALUES 
(
  'kahim-wakahim',
  'Ketua & Wakil Himpunan',
  'BPH Inti',
  'Pimpinan tertinggi Kabinet Samvaya yang memegang kemudi strategis, representasi internal & eksternal, dan penjamin keselarasan visi himpunan.',
  1,
  '{"name": "Muhammad Arya Ivandy Rohman", "role": "Ketua Himpunan", "nim": "3012410062", "imageUrl": ""}',
  '{"name": "Muhammad Faidza Airlangga", "role": "Wakil Ketua Himpunan", "nim": "3012410043", "imageUrl": ""}',
  '[]',
  '[{"title": "Grand Rapat Kerja Samvaya", "description": "Perumusan dan pengesahan visi misi serta proker satu periode.", "period": "Awal Periode", "status": "Direncanakan"}, {"title": "Informatics Townhall UISI", "description": "Forum sinergi dan aspirasi terbuka antara mahasiswa dan ormawa.", "period": "Berkala", "status": "Direncanakan"}]'
),
(
  'sekretaris',
  'Sekretariat',
  'Sekretaris',
  'Pusat tata kelola administrasi organisasi, pengarsipan surat dinamis, notulensi koordinasi, dan standardisasi dokumen resmi.',
  2,
  '{"name": "Achmad Ricky Hariono", "role": "Sekretaris 1", "nim": "3012410009", "imageUrl": ""}',
  '{"name": "Siti Amelia Istiqomah", "role": "Sekretaris 2", "nim": "3012510701", "imageUrl": ""}',
  '[]',
  '[{"title": "Cloud Data Center & SOP Persuratan", "description": "Manajemen digitalisasi arsip surat masuk/keluar dan proposal kegiatan.", "period": "Sepanjang Periode", "status": "Berlangsung"}]'
),
(
  'bendahara',
  'Kebendaharaan',
  'Bendahara',
  'Pengelola sirkulasi finansial, transparansi kas masuk-keluar, pembukuan anggaran, dan penjamin akuntabilitas dana himpunan.',
  3,
  '{"name": "Rafael Sucah Agustino", "role": "Bendahara 1", "nim": "3012410054", "imageUrl": ""}',
  '{"name": "Stephani Chris Anna", "role": "Bendahara 2", "nim": "3012510036", "imageUrl": ""}',
  '[]',
  '[{"title": "Laporan Keuangan Terbuka (Open Cash)", "description": "Publikasi transparansi anggaran kas himpunan secara berkala.", "period": "Bulanan", "status": "Berlangsung"}]'
),
(
  'psdm',
  'Pengembangan Sumber Daya Manusia (PSDM)',
  'PSDM',
  'Katalisator penguatan integritas, kaderisasi mahasiswa baru, peningkatan kompetensi kepemimpinan, dan solidaritas keluarga besar Informatika UISI.',
  4,
  '{"name": "Tegar Adidtya Pratama", "role": "Kepala Divisi PSDM", "nim": "3012510035", "imageUrl": ""}',
  NULL,
  '[{"name": "Rendy Alfiansyah", "role": "Anggota Divisi", "nim": "3012510013", "imageUrl": ""}, {"name": "Teti Ina Pangaribuan", "role": "Anggota Divisi", "nim": "3012510709", "imageUrl": ""}, {"name": "Muhammad Rendra Basyori", "role": "Anggota Divisi", "nim": "3012510039", "imageUrl": ""}, {"name": "Adelina Elsandra Mackayla Putri", "role": "Anggota Divisi", "nim": "3012510707", "imageUrl": ""}, {"name": "Rifqi Muhamad Rosadi", "role": "Anggota Divisi", "nim": "3012510028", "imageUrl": ""}]',
  '[{"title": "Kaderisasi Mahasiswa Informatika", "description": "Pelatihan karakter, kepemimpinan, dan etika dasar mahasiswa baru.", "period": "Semester Ganjil", "status": "Akan Datang"}]'
),
(
  'kominfo',
  'Komunikasi & Informasi (KOMINFO)',
  'Kominfo',
  'Pusat publikasi informasi, branding visual organisasi, pembuatan konten kreatif, dan pengelolaan media sosial resmi HMIF UISI.',
  5,
  '{"name": "Alfian Khusnul Fatoni", "role": "Kepala Divisi Kominfo", "nim": "3012410017", "imageUrl": ""}',
  NULL,
  '[{"name": "Raditya Arva Messi Jagaddhita", "role": "Anggota Divisi", "nim": "3012510034", "imageUrl": ""}, {"name": "Almaziidah Rihhadatul Aisya", "role": "Anggota Divisi", "nim": "3012510012", "imageUrl": ""}, {"name": "Reynata Mahessa Mulia Efendi", "role": "Anggota Divisi", "nim": "3012510703", "imageUrl": ""}, {"name": "M Faisal Afdani", "role": "Anggota Divisi", "nim": "3012510010", "imageUrl": ""}]',
  '[{"title": "Media & Branding Management", "description": "Pengelolaan feed, reels, visual identity, dan video dokumenter.", "period": "Rutin", "status": "Berlangsung"}]'
),
(
  'ristek',
  'Riset & Teknologi',
  'Ristek & Teknologi',
  'Inkubasi keterampilan teknikal mahasiswa melalui coding camp, riset software, persiapan lomba kompetitif, dan proyek open-source.',
  6,
  '{"name": "Nia Ramadani", "role": "Kepala Divisi Ristek", "nim": "3012410702", "imageUrl": ""}',
  NULL,
  '[{"name": "Mochamad Rifki Al Farizi", "role": "Anggota Divisi", "nim": "3012510011", "imageUrl": ""}, {"name": "M. Aliefta Rizky Alvansyah", "role": "Anggota Divisi", "nim": "3012510019", "imageUrl": ""}, {"name": "Chandra Mahendra Alam Pramudita", "role": "Anggota Divisi", "nim": "3012510008", "imageUrl": ""}, {"name": "Muhammad Fata Azzaki", "role": "Anggota Divisi", "nim": "3012510021", "imageUrl": ""}]',
  '[{"title": "Informatics Study Club & Bootcamp", "description": "Workshop intensif Web, Mobile, Data, dan Competitive Programming.", "period": "Mingguan", "status": "Akan Datang"}]'
),
(
  'kewirausahaan',
  'Kewirausahaan',
  'Kewirausahaan',
  'Pilar kemandirian ekonomi himpunan melalui inovasi merchandise, technopreneurship, dan pendanaan kreatif.',
  7,
  '{"name": "Muhammad Awaludin Ikbar", "role": "Kepala Divisi Kewirausahaan", "nim": "3012410025", "imageUrl": ""}',
  NULL,
  '[{"name": "Farisha Na''ila Zahronissa", "role": "Anggota Divisi", "nim": "3012510710", "imageUrl": ""}, {"name": "Rio Al Kaseno", "role": "Anggota Divisi", "nim": "3012510018", "imageUrl": ""}, {"name": "Muhammad Revaldo Pratama", "role": "Anggota Divisi", "nim": "3012510031", "imageUrl": ""}, {"name": "Andini Dwi Rismayani", "role": "Anggota Divisi", "nim": "3012510009", "imageUrl": ""}]',
  '[{"title": "Official Merchandise Informatika UISI", "description": "Pengadaan atribut identitas jurusan seperti PDH, kaos, dan lanyard.", "period": "Awal Semester", "status": "Direncanakan"}]'
),
(
  'humas',
  'Hubungan Masyarakat (HUMAS)',
  'Humas',
  'Garda terdepan diplomasi eksternal, jejaring alumni, kolaborasi antar kampus, dan relasi industri teknologi informasi.',
  8,
  '{"name": "Rendy Hikmawan Saputro", "role": "Kepala Divisi Humas", "nim": "3012410049", "imageUrl": ""}',
  NULL,
  '[{"name": "Ahmad Andi Alfiansyah", "role": "Anggota Divisi", "nim": "3012410053", "imageUrl": ""}, {"name": "Jafar Sodiq", "role": "Anggota Divisi", "nim": "3012510038", "imageUrl": ""}, {"name": "Ahmad Ubaydillah", "role": "Anggota Divisi", "nim": "3012510027", "imageUrl": ""}, {"name": "Fatir Awaluddin Putra", "role": "Anggota Divisi", "nim": "3012410027", "imageUrl": ""}, {"name": "Dinda Auliaul Qibtiyah", "role": "Anggota Divisi", "nim": "3012510704", "imageUrl": ""}]',
  '[{"title": "Industrial Tech Visit", "description": "Studi ekskursi ke korporasi dan industri IT terkemuka.", "period": "Semester Genap", "status": "Direncanakan"}]'
)
ON CONFLICT (slug) DO NOTHING;
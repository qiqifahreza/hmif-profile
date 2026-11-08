import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ludywbzvqjhurtwnjscw.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'samvaya_secure_server_token_2026';

const supabaseServer = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ==========================================
  // 1. GET: Ambil Seluruh Data Sekaligus di Server
  // ==========================================
  if (req.method === 'GET') {
    try {
      const [settingsRes, divisionsRes, annRes, compRes, blogsRes] = await Promise.all([
        supabaseServer.from('site_settings').select('*').eq('id', 1).single(),
        supabaseServer.from('divisions').select('*').order('order_index', { ascending: true }),
        supabaseServer.from('announcements').select('*').order('created_at', { ascending: false }),
        supabaseServer.from('competitions').select('*').order('deadline', { ascending: true }),
        supabaseServer.from('blogs').select('*').order('created_at', { ascending: false }),
      ]);

      return res.status(200).json({
        settings: settingsRes.data || null,
        divisions: divisionsRes.data || [],
        announcements: annRes.data || [],
        competitions: compRes.data || [],
        blogs: blogsRes.data || [],
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Server error';
      return res.status(500).json({ error: errorMsg });
    }
  }

  // ==========================================
  // 2. POST: Mutasi Data (Wajib Verifikasi Token Admin)
  // ==========================================
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return res.status(403).json({ error: 'Akses ditolak: Token admin tidak valid' });
    }

    const { type, payload } = req.body || {};

    try {
      switch (type) {
        // Update Pengaturan Situs
        case 'update-settings': {
          const { error } = await supabaseServer.from('site_settings').update(payload).eq('id', 1);
          if (error) throw error;
          return res.status(200).json({ success: true });
        }

        // Update Divisi / Proker / Anggota
        case 'update-division': {
          const { slug, data } = payload;
          const { error } = await supabaseServer.from('divisions').update({
            name: data.name,
            short_name: data.shortName,
            about: data.about,
            leader: data.leader,
            co_leader: data.coLeader || null,
            members: data.members || [],
            programs: data.programs || [],
          }).eq('slug', slug);
          if (error) throw error;
          return res.status(200).json({ success: true });
        }

        // CRUD Pengumuman
        case 'save-announcement': {
          if (payload.id) {
            await supabaseServer.from('announcements').update(payload).eq('id', payload.id);
          } else {
            await supabaseServer.from('announcements').insert([payload]);
          }
          return res.status(200).json({ success: true });
        }
        case 'delete-announcement': {
          await supabaseServer.from('announcements').delete().eq('id', payload.id);
          return res.status(200).json({ success: true });
        }

        // CRUD Kompetisi
        case 'save-competition': {
          if (payload.id) {
            await supabaseServer.from('competitions').update(payload).eq('id', payload.id);
          } else {
            await supabaseServer.from('competitions').insert([payload]);
          }
          return res.status(200).json({ success: true });
        }
        case 'delete-competition': {
          await supabaseServer.from('competitions').delete().eq('id', payload.id);
          return res.status(200).json({ success: true });
        }

        // CRUD Blog
        case 'save-blog': {
          if (payload.id) {
            await supabaseServer.from('blogs').update(payload).eq('id', payload.id);
          } else {
            await supabaseServer.from('blogs').insert([payload]);
          }
          return res.status(200).json({ success: true });
        }
        case 'delete-blog': {
          await supabaseServer.from('blogs').delete().eq('id', payload.id);
          return res.status(200).json({ success: true });
        }

        default:
          return res.status(400).json({ error: 'Tipe mutasi data tidak dikenal' });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Database error';
      return res.status(500).json({ error: errorMsg });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
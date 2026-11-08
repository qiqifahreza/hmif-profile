import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ludywbzvqjhurtwnjscw.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const ADMIN_TOKEN = process.env.ADMIN_SECRET_TOKEN || 'samvaya_secure_server_token_2026';

const supabaseServer = createClient(supabaseUrl, serviceRoleKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, username, password, newUsername, newPassword } = req.body || {};

  try {
    // 1. LOGIN ADMIN (Diproses di Server)
    if (action === 'login') {
      const { data, error } = await supabaseServer
        .from('admin_creds')
        .select('username, password')
        .eq('id', 1)
        .single();

      if (error || !data) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (data.username === username?.trim() && data.password === password) {
        return res.status(200).json({
          success: true,
          username: data.username,
          token: ADMIN_TOKEN, // Kirim token sesi aman
        });
      }

      return res.status(401).json({ success: false, message: 'Kredensial salah' });
    }

    // 2. GANTI KREDENSIAL ADMIN (Verifikasi Token di Server)
    if (action === 'change-credentials') {
      const authHeader = req.headers.authorization;
      if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
        return res.status(403).json({ error: 'Akses ditolak: Token tidak valid' });
      }

      const { error } = await supabaseServer
        .from('admin_creds')
        .update({ username: newUsername.trim(), password: newPassword })
        .eq('id', 1);

      if (error) throw error;
      return res.status(200).json({ success: true, username: newUsername.trim() });
    }

    return res.status(400).json({ error: 'Aksi tidak dikenal' });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown server error';
    return res.status(500).json({ error: errorMsg });
  }
}
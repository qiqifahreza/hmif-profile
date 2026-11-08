import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Middleware lokal untuk menjalankan fungsi Serverless saat npm run dev
function localServerlessPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'local-serverless-plugin',
    configureServer(server) {
      // Pastikan process.env lokal terisi variabel dari .env
      process.env = { ...process.env, ...env };

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next();

        // Parse Request Body (JSON) secara aman
        let body: unknown = {};
        if (req.method === 'POST' || req.method === 'PUT') {
          const raw = await new Promise<string>((resolve) => {
            let data = '';
            req.on('data', (chunk) => { data += chunk; });
            req.on('end', () => resolve(data));
          });
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = {};
          }
        }

        const customReq = Object.assign(req, { body });
        const customRes = Object.assign(res, {
          status: (code: number) => {
            res.statusCode = code;
            return customRes;
          },
          json: (data: unknown) => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
        });

        try {
          if (req.url.startsWith('/api/auth')) {
            // @ts-ignore
            const authHandler = (await import('./api/auth')).default;
            await authHandler(customReq as never, customRes as never);
          } else if (req.url.startsWith('/api/data')) {
            // @ts-ignore
            const dataHandler = (await import('./api/data')).default;
            await dataHandler(customReq as never, customRes as never);
          } else {
            next();
          }
        } catch (err) {
          console.error('Local Serverless Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Local serverless execution failed' }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Muat file .env ke environment Node.js lokal
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      tailwindcss(),
      react(),
      localServerlessPlugin(env),
    ],
  };
});
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

/**
 * Proxy route for Google Apps Script to eliminate all browser CORS and redirect issues.
 */
app.all('/api/gas-proxy', async (req: Request, res: Response) => {
  const targetUrl = (req.query.url as string) || (req.body && req.body.url);
  const action = (req.query.action as string) || (req.body && req.body.action) || 'ping';

  if (!targetUrl) {
    return res.status(400).json({
      status: 'error',
      message: 'Parameter "url" wajib disertakan.',
    });
  }

  try {
    let fetchUrl = targetUrl;
    if (!fetchUrl.includes('?')) {
      fetchUrl += `?action=${encodeURIComponent(action)}`;
    } else if (!fetchUrl.includes('action=')) {
      fetchUrl += `&action=${encodeURIComponent(action)}`;
    }

    const fetchOptions: RequestInit = {
      method: req.method === 'POST' ? 'POST' : 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Obeecreatives-WorkspaceOS/2.0',
      },
      redirect: 'follow',
    };

    if (req.method === 'POST' && req.body && req.body.payload) {
      fetchOptions.body = JSON.stringify({
        action,
        payload: req.body.payload,
      });
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(fetchUrl, fetchOptions);
    const text = await response.text();

    // Diagnostic detection of legacy Access Denied / HTML page
    if (text.includes('Akses Ditolak') || text.includes('AccessDenied')) {
      return res.status(200).json({
        status: 'error',
        code: 'ACCESS_DENIED',
        title: 'Akses Ditolak oleh Google Apps Script',
        message:
          'Google Apps Script menolak akses karena di kode lama terdapat filter email Session.getActiveUser().getEmail() yang kosong saat dipanggil via API, atau setting akses deployment masih "Anyone with Google account".',
        instruction: [
          'Buka Google Apps Script CRM Anda (Extensions -> Apps Script).',
          'Deploy -> Manage deployments -> klik ikon Pensil (Edit).',
          'Ubah "Who has access" dari "Anyone with Google account" menjadi "Anyone" (Siapa saja).',
          'Perbarui fungsi doGet dengan skrip API Router V2 yang kami sediakan.',
          'Pilih Version: "New version" lalu klik Deploy.',
        ],
        rawSnippet: text.slice(0, 300),
      });
    }

    if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
      return res.status(200).json({
        status: 'error',
        code: 'HTML_RESPONSE',
        title: 'Respons Format HTML Lama',
        message:
          'Google Apps Script mengembalikan halaman HTML aplikasi lama, bukan JSON. Silakan pasang skrip API Router V2 di Code.gs agar doGet mengembalikan ContentService.createTextOutput(JSON).',
        rawSnippet: text.slice(0, 300),
      });
    }

    try {
      const json = JSON.parse(text);
      return res.status(200).json({
        status: 'success',
        data: json.data || json,
        message: json.message || 'Data berhasil disinkronkan.',
      });
    } catch {
      return res.status(200).json({
        status: 'warning',
        message: 'Endpoint merespons teks non-JSON: ' + text.slice(0, 150),
        raw: text,
      });
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      status: 'error',
      message: `Gagal memanggil endpoint Google Apps Script: ${errorMsg}`,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CRM OBEECREATIVES Workspace OS server running on port ${PORT}`);
  });
}

startServer();

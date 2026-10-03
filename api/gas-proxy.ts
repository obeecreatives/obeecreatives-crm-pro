// Vercel Serverless Function for Google Apps Script Proxy
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetUrl = req.query.url || (req.body && req.body.url);
  const action = req.query.action || (req.body && req.body.action) || 'ping';

  if (!targetUrl) {
    return res.status(400).json({ status: 'error', message: 'Parameter "url" wajib disertakan.' });
  }

  try {
    let fetchUrl = String(targetUrl);
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
    const trimmed = text.trim();

    if (trimmed.includes('Akses Ditolak') || trimmed.includes('AccessDenied')) {
      return res.status(200).json({
        status: 'error',
        code: 'ACCESS_DENIED',
        message: 'Akses Ditolak oleh Google Apps Script. Pastikan opsi "Who has access" diset ke "Anyone" (Siapa saja).',
      });
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      const json = JSON.parse(trimmed);
      return res.status(200).json(json);
    }

    return res.status(200).json({
      status: 'error',
      code: 'HTML_RESPONSE',
      message: 'Endpoint Google Apps Script mengembalikan format HTML, bukan JSON API.',
      rawSnippet: trimmed.slice(0, 200),
    });
  } catch (err: any) {
    return res.status(500).json({ status: 'error', message: err.message || 'Internal proxy error' });
  }
}
